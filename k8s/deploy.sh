#!/bin/bash

# Product API Kubernetes Deployment Script
set -e

echo "🚀 Starting Product API Kubernetes Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required environment variables are set
check_environment() {
    print_status "Checking environment variables..."
    
    if [ -z "$DOCKER_IMAGE" ]; then
        print_error "DOCKER_IMAGE environment variable is required"
        exit 1
    fi
    
    # If DATABASE_URL is not provided, try to get it from AWS RDS
    if [ -z "$DATABASE_URL" ]; then
        print_status "DATABASE_URL not provided, attempting to get it from AWS RDS..."
        
        # Check if we can access the database directory
        if [ -d "../tech-challenge-fiap-db" ]; then
            cd ../tech-challenge-fiap-db
            
            # Check if Terraform is initialized
            if [ -f ".terraform/terraform.tfstate" ]; then
                # Get the database URL from Terraform outputs
                DATABASE_URL=$(terraform output -raw products_database_url 2>/dev/null || echo "")
                
                if [ -n "$DATABASE_URL" ]; then
                    print_status "✅ Database URL retrieved from AWS RDS"
                    export DATABASE_URL
                else
                    print_error "❌ Could not retrieve DATABASE_URL from AWS RDS"
                    print_error "Please set DATABASE_URL environment variable manually"
                    exit 1
                fi
                
                # Go back to the original directory
                cd ../tech-product-api
            else
                print_error "❌ Terraform state not found in tech-challenge-fiap-db"
                print_error "Please run 'terraform init' and 'terraform apply' in the database directory first"
                exit 1
            fi
        else
            print_error "❌ tech-challenge-fiap-db directory not found"
            print_error "Please set DATABASE_URL environment variable manually"
            exit 1
        fi
    fi
    
    print_status "Environment variables are set"
}

# Create or update the secret with database URL
update_secret() {
    print_status "Updating Kubernetes secret..."
    
    # Encode DATABASE_URL to base64
    ENCODED_DB_URL=$(echo -n "$DATABASE_URL" | base64)
    
    # Create or update the secret
    kubectl create secret generic tech-product-api-secret \
        --from-literal=DATABASE_URL="$DATABASE_URL" \
        --namespace=products-service \
        --dry-run=client -o yaml | kubectl apply -f -
    
    print_status "Secret updated successfully"
}

# Run database migrations
run_migrations() {
    print_status "Running database migrations..."
    
    # Generate migration job manifest
    envsubst < k8s/migration-job.yaml > k8s/migration-job-generated.yaml
    
    # Apply migration job
    kubectl apply -f k8s/migration-job-generated.yaml
    
    # Wait for migration job to complete
    print_status "Waiting for migration job to complete..."
    kubectl wait --for=condition=complete job/tech-product-api-migration -n products-service --timeout=300s
    
    # Clean up migration job
    kubectl delete -f k8s/migration-job-generated.yaml
    
    print_status "Migrations completed successfully"
}

# Deploy the application
deploy_application() {
    print_status "Deploying application..."
    
    # Generate manifests with environment variables
    envsubst < k8s/deployment.yaml.template > k8s/deployment-generated.yaml
    envsubst < k8s/service.yaml.template > k8s/service-generated.yaml
    envsubst < k8s/ingress.yaml.template > k8s/ingress-generated.yaml
    
    # Apply manifests
    kubectl apply -f k8s/namespace.yaml
    kubectl apply -f k8s/configmap.yaml
    kubectl apply -f k8s/deployment-generated.yaml
    kubectl apply -f k8s/service-generated.yaml
    kubectl apply -f k8s/ingress-generated.yaml
    kubectl apply -f k8s/hpa.yaml
    
    # Wait for deployment to be ready
    print_status "Waiting for deployment to be ready..."
    kubectl rollout status deployment/tech-product-api -n products-service --timeout=300s
    
    print_status "Application deployed successfully"
}

# Check service health
check_health() {
    print_status "Checking service health..."
    
    # Get the service URL
    SERVICE_URL=$(kubectl get ingress tech-product-api-ingress -n products-service -o jsonpath='{.status.loadBalancer.ingress[0].hostname}')
    
    if [ -n "$SERVICE_URL" ]; then
        print_status "Service URL: http://$SERVICE_URL"
        
        # Wait a bit for the service to be fully ready
        sleep 10
        
        # Check health endpoint
        if curl -f -s "http://$SERVICE_URL/health" > /dev/null; then
            print_status "✅ Service is healthy"
        else
            print_warning "⚠️  Service health check failed, but deployment completed"
        fi
    else
        print_warning "⚠️  Service URL not available yet"
    fi
}

# Show deployment information
show_info() {
    echo ""
    print_status "🎉 Product API Deployment Complete!"
    echo ""
    echo "Deployment Information:"
    echo "  📦 Image: $DOCKER_IMAGE"
    echo "  🏷️  Namespace: products-service"
    echo "  🔧 Replicas: 2 (with HPA enabled)"
    echo ""
    echo "Useful Commands:"
    echo "  kubectl get pods -n products-service"
    echo "  kubectl logs -f deployment/tech-product-api -n products-service"
    echo "  kubectl describe ingress tech-product-api-ingress -n products-service"
    echo ""
}

# Main script logic
main() {
    check_environment
    update_secret
    run_migrations
    deploy_application
    check_health
    show_info
}

# Run main function
main "$@" 