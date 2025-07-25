# 🔧 Troubleshooting Guide

This guide helps you resolve common issues with the Product API microservice.

## 🚨 Prisma Installation Issues

### Common Error: `ECONNRESET` during Prisma installation

**Symptoms:**
```
npm error Error: aborted
npm error code: 'ECONNRESET'
npm error at TLSSocket.socketCloseListener
```

**Solutions:**

#### 1. Use the Prisma Fix Script (Recommended)
```bash
# Fix Prisma installation issues
npm run fix:prisma

# Or run the script directly
./scripts/fix-prisma.sh fix
```

#### 2. Clean Installation
```bash
# Remove everything and reinstall
npm run fix:prisma:clean

# Or manually
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
npx prisma generate
```

#### 3. Clear Cache Only
```bash
npm run fix:prisma:cache
```

#### 4. Generate Prisma Client Only
```bash
npm run fix:prisma:generate
```

### GitHub Actions Prisma Issues

**If CI/CD fails with Prisma errors:**

1. **Check the workflow logs** for specific error messages
2. **The workflow now includes retry mechanisms** for Prisma installation
3. **Use the manual deploy workflow** if automatic deployment fails

## 🔄 CI/CD Pipeline Issues

### Build Failures

**Common causes:**
- Prisma installation issues (see above)
- Node.js version incompatibility
- Missing dependencies

**Solutions:**
1. Check the GitHub Actions logs
2. Use the Prisma fix script locally first
3. Try the manual deploy workflow

### Docker Build Issues

**Common causes:**
- Large build context
- Network timeouts
- Memory issues

**Solutions:**
1. Check the `.dockerignore` file is properly configured
2. Use Docker BuildKit: `DOCKER_BUILDKIT=1 docker build .`
3. Increase Docker memory limits

### Deployment Failures

**Common causes:**
- AWS credentials issues
- Kubernetes cluster access problems
- Database connection issues

**Solutions:**
1. Verify AWS credentials in GitHub secrets
2. Check EKS cluster is accessible
3. Verify database connection string

## 🗄️ Database Issues

### Connection Problems

**Symptoms:**
- Application fails to start
- Migration failures
- Connection timeout errors

**Solutions:**

#### 1. Check Database URL
```bash
# Get database information
./scripts/get-db-info.sh
```

#### 2. Verify Database Credentials
- Check username and password
- Verify database exists
- Check network connectivity

#### 3. Test Database Connection
```bash
# Test connection locally
psql "postgresql://user:password@host:5432/database"

# Or use the application
DATABASE_URL="your-connection-string" npm run start:dev
```

### Migration Issues

**Symptoms:**
- Migration job fails
- Schema mismatch errors
- Data corruption

**Solutions:**

#### 1. Check Migration Status
```bash
npx prisma migrate status
```

#### 2. Reset Database (Development Only)
```bash
npx prisma migrate reset
```

#### 3. Deploy Migrations
```bash
npx prisma migrate deploy
```

## 🐳 Docker Issues

### Container Won't Start

**Common causes:**
- Port conflicts
- Volume mount issues
- Environment variable problems

**Solutions:**

#### 1. Check Container Logs
```bash
docker logs <container-name>
```

#### 2. Check Port Availability
```bash
# Check if port 3001 is in use
lsof -i :3001
```

#### 3. Verify Environment Variables
```bash
docker run --env-file .env your-image
```

### Image Build Failures

**Common causes:**
- Large build context
- Missing files
- Permission issues

**Solutions:**

#### 1. Check Build Context
```bash
# See what's being sent to Docker
docker build --progress=plain .
```

#### 2. Use Multi-stage Build
The Dockerfile already uses multi-stage builds for optimization.

#### 3. Check File Permissions
```bash
chmod +x scripts/*.sh
```

## ☁️ Kubernetes Issues

### Pod Won't Start

**Common causes:**
- Resource limits
- Image pull issues
- Configuration problems

**Solutions:**

#### 1. Check Pod Status
```bash
kubectl get pods -n products-service
kubectl describe pod <pod-name> -n products-service
```

#### 2. Check Pod Logs
```bash
kubectl logs <pod-name> -n products-service
```

#### 3. Check Events
```bash
kubectl get events -n products-service --sort-by='.lastTimestamp'
```

### Service Not Accessible

**Common causes:**
- Ingress configuration issues
- Load balancer problems
- Network policies

**Solutions:**

#### 1. Check Service Status
```bash
kubectl get services -n products-service
kubectl get ingress -n products-service
```

#### 2. Check Load Balancer
```bash
kubectl describe ingress tech-product-api-ingress -n products-service
```

#### 3. Test Service Directly
```bash
kubectl port-forward service/tech-product-api-service 3001:3001 -n products-service
curl http://localhost:3001/health
```

## 🔍 Debugging Commands

### General Debugging
```bash
# Check application status
curl http://localhost:3001/health

# Check logs
docker-compose logs -f product-api

# Check database
docker-compose exec product-postgres psql -U postgres -d product_db
```

### Kubernetes Debugging
```bash
# Get all resources
kubectl get all -n products-service

# Check deployment history
kubectl rollout history deployment/tech-product-api -n products-service

# Check resource usage
kubectl top pods -n products-service

# Check configuration
kubectl get configmap tech-product-api-config -n products-service -o yaml
kubectl get secret tech-product-api-secret -n products-service -o yaml
```

### AWS Debugging
```bash
# Check EKS cluster
aws eks describe-cluster --name tech_challenge_cluster --region us-east-1

# Check EKS nodes
kubectl get nodes

# Check AWS Load Balancer
aws elbv2 describe-load-balancers --region us-east-1
```

## 📞 Getting Help

### Before Asking for Help

1. **Check the logs** - Most issues can be identified from logs
2. **Try the fix scripts** - Use the provided troubleshooting scripts
3. **Check documentation** - Review the main README and deployment guides
4. **Search existing issues** - Check if the problem has been reported before

### When Reporting Issues

Please include:
1. **Error messages** - Copy the exact error text
2. **Environment details** - OS, Node.js version, Docker version
3. **Steps to reproduce** - What you did before the error
4. **Logs** - Relevant log output
5. **Configuration** - Any custom configuration you're using

### Useful Resources

- [Prisma Documentation](https://www.prisma.io/docs/)
- [NestJS Documentation](https://docs.nestjs.com/)
- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [AWS EKS Documentation](https://docs.aws.amazon.com/eks/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions) 