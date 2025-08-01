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
    
    # Wait for migration job to complete with better error handling
    print_status "Waiting for migration job to complete..."
    
    # First, try using kubectl wait with the correct condition
    if kubectl wait --for=condition=complete job/tech-product-api-migration -n products-service --timeout=300s 2>/dev/null; then
        print_status "✅ Migration job completed successfully using kubectl wait!"
    else
        print_status "kubectl wait timed out, checking job status manually..."
        
        # Alternative: Check if job has succeeded by looking at completion status
        JOB_SUCCEEDED_COUNT=$(kubectl get job tech-product-api-migration -n products-service -o jsonpath='{.status.succeeded}' 2>/dev/null || echo "0")
        if [ "$JOB_SUCCEEDED_COUNT" = "1" ]; then
            print_status "✅ Migration job completed successfully (succeeded count: $JOB_SUCCEEDED_COUNT)!"
        else
            print_status "Job not completed yet, checking status manually..."
            
            # Check job status every 10 seconds for up to 5 minutes
    for i in {1..30}; do
        print_status "Checking migration job status (attempt $i/30)..."
        
        # Get job status - check for both Complete and Succeeded conditions
        JOB_COMPLETE=$(kubectl get job tech-product-api-migration -n products-service -o jsonpath='{.status.conditions[?(@.type=="Complete")].status}' 2>/dev/null || echo "Unknown")
        JOB_SUCCEEDED=$(kubectl get job tech-product-api-migration -n products-service -o jsonpath='{.status.conditions[?(@.type=="Succeeded")].status}' 2>/dev/null || echo "Unknown")
        JOB_FAILED=$(kubectl get job tech-product-api-migration -n products-service -o jsonpath='{.status.conditions[?(@.type=="Failed")].status}' 2>/dev/null || echo "Unknown")
        
        print_status "Job Complete status: $JOB_COMPLETE"
        print_status "Job Succeeded status: $JOB_SUCCEEDED"
        print_status "Job Failed status: $JOB_FAILED"
        
        # Get pod logs if job is running
        POD_NAME=$(kubectl get pods -n products-service -l job-name=tech-product-api-migration -o jsonpath='{.items[0].metadata.name}' 2>/dev/null || echo "")
        if [ -n "$POD_NAME" ]; then
            print_status "Pod name: $POD_NAME"
            print_status "Pod status: $(kubectl get pod $POD_NAME -n products-service -o jsonpath='{.status.phase}')"
            print_status "Recent logs:"
            kubectl logs $POD_NAME -n products-service --tail=20 || echo "No logs available"
        fi
        
        # Check if job completed successfully
        if [ "$JOB_COMPLETE" = "True" ] || [ "$JOB_SUCCEEDED" = "True" ]; then
            print_status "✅ Migration job completed successfully!"
            break
        elif [ "$JOB_FAILED" = "True" ]; then
            print_error "❌ Migration job failed!"
            print_error "Full job description:"
            kubectl describe job tech-product-api-migration -n products-service
            print_error "Pod logs:"
            kubectl logs $POD_NAME -n products-service || echo "No logs available"
            exit 1
        fi
        
        # Alternative check: look at succeeded count
        JOB_SUCCEEDED_COUNT=$(kubectl get job tech-product-api-migration -n products-service -o jsonpath='{.status.succeeded}' 2>/dev/null || echo "0")
        if [ "$JOB_SUCCEEDED_COUNT" = "1" ]; then
            print_status "✅ Migration job completed successfully (succeeded count: $JOB_SUCCEEDED_COUNT)!"
            break
        fi
        
        # Wait 10 seconds before next check
        sleep 10
    done
    
    # Final check
    if [ "$JOB_COMPLETE" != "True" ] && [ "$JOB_SUCCEEDED" != "True" ]; then
        print_error "❌ Migration job timed out after 5 minutes!"
        print_error "Job description:"
        kubectl describe job tech-product-api-migration -n products-service
        print_error "Pod logs:"
        kubectl logs $POD_NAME -n products-service || echo "No logs available"
        exit 1
    fi
    fi
    
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
    
    # Apply manifests
    kubectl apply -f k8s/namespace.yaml
    kubectl apply -f k8s/configmap.yaml
    kubectl apply -f k8s/deployment-generated.yaml
    kubectl apply -f k8s/service-generated.yaml
    kubectl apply -f k8s/hpa.yaml
    
    # Wait for deployment to be ready
    print_status "Waiting for deployment to be ready..."
    kubectl rollout status deployment/tech-product-api -n products-service --timeout=300s
    
    print_status "Application deployed successfully"
}

# Check service health
check_health() {
    print_status "Checking service health..."
    
    # Get the LoadBalancer service URL
    SERVICE_URL=$(kubectl get svc products-service-loadbalancer -n products-service -o jsonpath='{.status.loadBalancer.ingress[0].hostname}')
    
    if [ -n "$SERVICE_URL" ]; then
        print_status "Service URL: http://$SERVICE_URL:3001"
        
        # Wait a bit for the service to be fully ready
        sleep 10
        
        # Check health endpoint
        if curl -f -s "http://$SERVICE_URL:3001/health" > /dev/null; then
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
    echo "  kubectl get svc -n products-service"
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