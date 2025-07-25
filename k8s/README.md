# Product API Kubernetes Deployment

This directory contains all the Kubernetes manifests and deployment scripts for the Product API microservice.

## Prerequisites

1. **AWS EKS Cluster**: The infrastructure should be deployed using the `tech-challenge-fiap-infra` repository
2. **Database**: RDS PostgreSQL instance should be running (deployed via `tech-challenge-fiap-db`)
3. **kubectl**: Configured to access your EKS cluster
4. **Docker Hub**: Account with access to push images

## Configuration

### Environment Variables

The following environment variables need to be set:

- `DOCKER_IMAGE`: The Docker image to deploy (e.g., `your-username/tech-product-api:latest`)
- `DATABASE_URL`: PostgreSQL connection string (e.g., `postgresql://user:password@host:5432/database`)

### Secrets

Sensitive data like database credentials are stored in Kubernetes secrets:

```bash
# Create the secret manually
kubectl create secret generic tech-product-api-secret \
  --from-literal=DATABASE_URL="your-database-url" \
  --namespace=products-service
```

## Deployment

### Option 1: Using the Deployment Script

```bash
# Set environment variables
export DOCKER_IMAGE="your-username/tech-product-api:latest"
export DATABASE_URL="postgresql://user:password@host:5432/database"

# Run deployment
./k8s/deploy.sh
```

### Option 2: Manual Deployment

```bash
# 1. Create namespace
kubectl apply -f k8s/namespace.yaml

# 2. Create ConfigMap
kubectl apply -f k8s/configmap.yaml

# 3. Create Secret (if not exists)
kubectl create secret generic tech-product-api-secret \
  --from-literal=DATABASE_URL="your-database-url" \
  --namespace=products-service

# 4. Generate manifests with environment variables
envsubst < k8s/deployment.yaml.template > k8s/deployment.yaml
envsubst < k8s/service.yaml.template > k8s/service.yaml
envsubst < k8s/ingress.yaml.template > k8s/ingress.yaml

# 5. Apply manifests
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
kubectl apply -f k8s/ingress.yaml
kubectl apply -f k8s/hpa.yaml

# 6. Run migrations
envsubst < k8s/migration-job.yaml > k8s/migration-job-generated.yaml
kubectl apply -f k8s/migration-job-generated.yaml
kubectl wait --for=condition=complete job/tech-product-api-migration -n products-service
kubectl delete -f k8s/migration-job-generated.yaml
```

## CI/CD Pipeline

The GitHub Actions workflow (`.github/workflows/ci-cd.yml`) automatically:

1. **Tests**: Runs linting and unit tests
2. **Builds**: Creates Docker image and pushes to Docker Hub
3. **Deploys**: Deploys to AWS EKS cluster

### Required GitHub Secrets

Configure these secrets in your GitHub repository:

- `DOCKERHUB_USERNAME`: Your Docker Hub username
- `DOCKERHUB_TOKEN`: Your Docker Hub access token
- `AWS_ACCESS_KEY_ID`: AWS access key with EKS permissions
- `AWS_SECRET_ACCESS_KEY`: AWS secret access key

## Monitoring and Troubleshooting

### Check Deployment Status

```bash
# Check pods
kubectl get pods -n products-service

# Check services
kubectl get services -n products-service

# Check ingress
kubectl get ingress -n products-service

# Check HPA
kubectl get hpa -n products-service
```

### View Logs

```bash
# View application logs
kubectl logs -f deployment/tech-product-api -n products-service

# View logs for specific pod
kubectl logs -f <pod-name> -n products-service
```

### Health Checks

```bash
# Check health endpoint
curl http://your-ingress-url/health

# Check service directly
kubectl port-forward service/tech-product-api-service 3001:3001 -n products-service
curl http://localhost:3001/health
```

### Scaling

The application uses Horizontal Pod Autoscaler (HPA) with:
- Minimum replicas: 2
- Maximum replicas: 10
- CPU target: 70%
- Memory target: 80%

```bash
# Check HPA status
kubectl describe hpa tech-product-api-hpa -n products-service

# Manual scaling (if needed)
kubectl scale deployment tech-product-api --replicas=3 -n products-service
```

## Architecture

### Components

1. **Deployment**: Runs 2 replicas of the application
2. **Service**: ClusterIP service exposing port 3001
3. **Ingress**: ALB Ingress Controller for external access
4. **HPA**: Automatic scaling based on resource usage
5. **ConfigMap**: Non-sensitive configuration
6. **Secret**: Sensitive data (database credentials)

### Network Flow

```
Internet → ALB Ingress → Service → Pods
```

### Resource Limits

- **CPU**: 250m request, 500m limit
- **Memory**: 256Mi request, 512Mi limit

## Security

- Non-root user in containers
- Proper signal handling with dumb-init
- Secrets for sensitive data
- Network policies (if configured)

## Rollback

```bash
# Rollback to previous version
kubectl rollout undo deployment/tech-product-api -n products-service

# Check rollout history
kubectl rollout history deployment/tech-product-api -n products-service
```

## Cleanup

```bash
# Delete all resources
kubectl delete namespace products-service

# Or delete individual resources
kubectl delete -f k8s/
``` 