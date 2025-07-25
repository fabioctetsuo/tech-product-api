# 🚀 Product API Deployment Guide

This guide provides step-by-step instructions for deploying the Product API microservice to AWS EKS.

## 📋 Prerequisites

Before starting the deployment, ensure you have:

1. **Infrastructure Deployed**:
   - AWS EKS cluster (from `tech-challenge-fiap-infra`)
   - RDS PostgreSQL database (from `tech-challenge-fiap-db`)

2. **Tools Installed**:
   - `kubectl` configured for your EKS cluster
   - `aws-cli` configured with appropriate permissions
   - `docker` for local testing

3. **Accounts & Access**:
   - Docker Hub account
   - GitHub repository with access to secrets
   - AWS credentials with EKS permissions

## 🔧 Setup Steps

### 1. Configure GitHub Secrets

Add these secrets to your GitHub repository:

```bash
# Docker Hub credentials
DOCKERHUB_USERNAME=your-dockerhub-username
DOCKERHUB_TOKEN=your-dockerhub-access-token

# AWS credentials
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
```

### 2. Get Database Connection Information

```bash
# From the tech-product-api directory
./scripts/get-db-info.sh
```

This will output the database endpoint. You'll need to construct the full DATABASE_URL with your credentials.

### 3. Update Ingress Configuration

Edit `k8s/ingress.yaml.template` and replace:
- `ACCOUNT_ID` with your AWS account ID
- `CERTIFICATE_ID` with your SSL certificate ARN (if using HTTPS)

## 🚀 Deployment Options

### Option A: Automated CI/CD (Recommended)

1. **Push to main branch** - This triggers the GitHub Actions pipeline
2. **Monitor the pipeline** in GitHub Actions tab
3. **Verify deployment** using kubectl commands

### Option B: Manual Deployment

```bash
# 1. Set environment variables
export DOCKER_IMAGE="your-username/tech-product-api:latest"
export DATABASE_URL="postgresql://user:password@host:5432/database"

# 2. Build and push Docker image
docker build -t $DOCKER_IMAGE .
docker push $DOCKER_IMAGE

# 3. Deploy to Kubernetes
./k8s/deploy.sh
```

## 🔍 Verification

### Check Deployment Status

```bash
# Check all resources
kubectl get all -n products-service

# Check pods
kubectl get pods -n products-service

# Check services
kubectl get services -n products-service

# Check ingress
kubectl get ingress -n products-service
```

### Test the Application

```bash
# Get the service URL
kubectl get ingress tech-product-api-ingress -n products-service -o jsonpath='{.status.loadBalancer.ingress[0].hostname}'

# Test health endpoint
curl http://your-ingress-url/health

# Test API endpoints
curl http://your-ingress-url/categorias
curl http://your-ingress-url/produtos
```

### View Logs

```bash
# Application logs
kubectl logs -f deployment/tech-product-api -n products-service

# Migration job logs (if running)
kubectl logs job/tech-product-api-migration -n products-service
```

## 🛠️ Troubleshooting

### Common Issues

1. **Pods not starting**:
   ```bash
   kubectl describe pod <pod-name> -n products-service
   kubectl logs <pod-name> -n products-service
   ```

2. **Database connection issues**:
   - Verify DATABASE_URL is correct
   - Check RDS security groups allow EKS access
   - Verify database credentials

3. **Ingress not working**:
   ```bash
   kubectl describe ingress tech-product-api-ingress -n products-service
   ```

4. **Migration failures**:
   ```bash
   kubectl logs job/tech-product-api-migration -n products-service
   ```

### Scaling

```bash
# Check HPA status
kubectl get hpa -n products-service

# Manual scaling
kubectl scale deployment tech-product-api --replicas=3 -n products-service
```

### Rollback

```bash
# Rollback to previous version
kubectl rollout undo deployment/tech-product-api -n products-service

# Check rollout history
kubectl rollout history deployment/tech-product-api -n products-service
```

## 📊 Monitoring

### Resource Usage

```bash
# Check resource usage
kubectl top pods -n products-service
kubectl top nodes
```

### Health Checks

The application provides health checks at `/health` endpoint:
- **Liveness probe**: Checks if the application is running
- **Readiness probe**: Checks if the application is ready to serve traffic

### Logs and Metrics

- **Application logs**: Available via kubectl logs
- **Metrics**: Prometheus metrics available at `/metrics` (if configured)
- **Health**: Health endpoint at `/health`

## 🔒 Security

### Secrets Management

- Database credentials are stored in Kubernetes secrets
- Secrets are base64 encoded
- Access is restricted to the namespace

### Network Security

- Service uses ClusterIP (internal access only)
- External access via ALB Ingress Controller
- SSL termination at the load balancer

### Container Security

- Non-root user in containers
- Proper signal handling
- Resource limits configured

## 🧹 Cleanup

### Remove Deployment

```bash
# Delete all resources
kubectl delete namespace products-service

# Or delete individual resources
kubectl delete -f k8s/
```

### Remove Docker Images

```bash
# Remove local images
docker rmi your-username/tech-product-api:latest

# Remove from Docker Hub (if needed)
docker hub rm your-username/tech-product-api:latest
```

## 📞 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review application logs
3. Verify infrastructure configuration
4. Check GitHub Actions pipeline logs

## 📚 Additional Resources

- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [AWS EKS Documentation](https://docs.aws.amazon.com/eks/)
- [Docker Documentation](https://docs.docker.com/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions) 