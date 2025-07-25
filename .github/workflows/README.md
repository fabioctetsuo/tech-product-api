# GitHub Actions Workflows Guide

This directory contains all the GitHub Actions workflows for the Product API microservice.

## 📋 Available Workflows

### 1. CI/CD Pipeline (`ci-cd.yml`)
**Trigger**: Automatic on push to main branch or pull requests

**What it does**:
- Runs tests and linting
- Builds Docker image and pushes to Docker Hub
- Deploys to AWS EKS cluster

**Required Secrets**:
- `DOCKERHUB_USERNAME`
- `DOCKERHUB_TOKEN`
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`

### 2. Manual Deploy (`manual-deploy.yml`)
**Trigger**: Manual (workflow_dispatch)

**What it does**:
- Deploys any Docker image to AWS EKS
- Runs database migrations
- Configurable environment, namespace, and replicas

**Inputs**:
- `docker_image`: Docker image to deploy (e.g., `username/tech-product-api:latest`)
- `database_url`: Database connection string
- `environment`: Environment name (production/staging)
- `namespace`: Kubernetes namespace (default: `products-service`)
- `replicas`: Number of replicas (default: `2`)

**Usage**:
1. Go to GitHub Actions tab
2. Select "Manual Deploy to AWS"
3. Click "Run workflow"
4. Fill in the required inputs
5. Click "Run workflow"

### 3. Rollback (`rollback.yml`)
**Trigger**: Manual (workflow_dispatch)

**What it does**:
- Rolls back to a previous deployment version
- Performs health checks after rollback

**Inputs**:
- `namespace`: Kubernetes namespace (default: `products-service`)
- `revision`: Revision number to rollback to (optional, defaults to previous)

**Usage**:
1. Go to GitHub Actions tab
2. Select "Rollback Deployment"
3. Click "Run workflow"
4. Optionally specify a revision number
5. Click "Run workflow"

### 4. Scale (`scale.yml`)
**Trigger**: Manual (workflow_dispatch)

**What it does**:
- Scales the deployment up or down
- Supports absolute scaling or relative scaling

**Inputs**:
- `namespace`: Kubernetes namespace (default: `products-service`)
- `replicas`: Number of replicas
- `action`: Scaling action (scale/scale-up/scale-down)

**Usage**:
1. Go to GitHub Actions tab
2. Select "Scale Deployment"
3. Click "Run workflow"
4. Choose scaling action and number of replicas
5. Click "Run workflow"

## 🔧 Workflow Examples

### Deploy a Specific Version
```yaml
# Manual Deploy inputs
docker_image: your-username/tech-product-api:v1.2.3
database_url: postgresql://user:password@host:5432/database
environment: production
namespace: products-service
replicas: 3
```

### Rollback to Previous Version
```yaml
# Rollback inputs
namespace: products-service
revision: (leave empty for previous)
```

### Scale Up for High Traffic
```yaml
# Scale inputs
namespace: products-service
replicas: 2
action: scale-up
```

### Scale Down for Cost Optimization
```yaml
# Scale inputs
namespace: products-service
replicas: 1
action: scale-down
```

## 🚨 Troubleshooting

### Common Issues

1. **Workflow fails with AWS credentials error**:
   - Verify AWS secrets are set correctly
   - Check that AWS credentials have EKS permissions

2. **Workflow fails with Docker Hub error**:
   - Verify Docker Hub credentials
   - Check that the image exists in Docker Hub

3. **Deployment fails**:
   - Check Kubernetes cluster is accessible
   - Verify namespace exists
   - Check database connection string

4. **Rollback fails**:
   - Verify deployment has previous revisions
   - Check deployment history with kubectl

### Debugging Commands

```bash
# Check deployment history
kubectl rollout history deployment/tech-product-api -n products-service

# Check current status
kubectl get pods -n products-service

# Check logs
kubectl logs -f deployment/tech-product-api -n products-service

# Check events
kubectl get events -n products-service --sort-by='.lastTimestamp'
```

## 🔒 Security Considerations

### Secrets Management
- All sensitive data (AWS credentials, Docker Hub tokens, database URLs) are stored as GitHub secrets
- Secrets are encrypted and only accessible during workflow execution
- Never commit secrets to the repository

### Access Control
- Workflows run with the permissions of the GitHub repository
- Ensure only authorized users can trigger manual workflows
- Consider using branch protection rules

### Network Security
- Workflows connect to AWS EKS cluster
- Database connections use secure URLs
- All communication is over HTTPS

## 📊 Monitoring

### Workflow Monitoring
- Monitor workflow runs in GitHub Actions tab
- Set up notifications for workflow failures
- Use workflow summaries for deployment status

### Application Monitoring
- Health checks are performed after each deployment
- Service URLs are provided in workflow summaries
- Use kubectl commands for detailed monitoring

## 🔄 Best Practices

### Deployment
1. Always test changes locally first
2. Use semantic versioning for Docker images
3. Deploy to staging before production
4. Monitor deployments closely

### Rollback
1. Keep deployment history clean
2. Test rollback procedures regularly
3. Have a rollback plan for critical deployments

### Scaling
1. Monitor resource usage before scaling
2. Use HPA for automatic scaling when possible
3. Scale down during low-traffic periods

### Security
1. Rotate secrets regularly
2. Use least-privilege access
3. Monitor for unauthorized access
4. Keep dependencies updated

## 📞 Support

If you encounter issues:

1. Check the troubleshooting section
2. Review workflow logs in GitHub Actions
3. Verify infrastructure configuration
4. Check application logs in Kubernetes
5. Consult the main deployment documentation 