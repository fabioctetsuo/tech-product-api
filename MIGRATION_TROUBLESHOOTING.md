# 🔧 Migration Job Troubleshooting

This guide helps you troubleshoot issues with the database migration job in the CI/CD pipeline.

## 🚨 Common Issues

### 1. Migration Job Stuck/Hanging

**Symptoms:**
- Job shows "Running" status but never completes
- Timeout after 5 minutes
- No error messages in logs

**Possible Causes:**
- Database connection issues
- Missing GitHub secrets
- RDS endpoint not accessible from EKS
- Network connectivity problems

**Solutions:**

#### A. Check GitHub Secrets
Make sure these secrets are set in your GitHub repository:
- `DB_USERNAME`
- `DB_PASSWORD`
- `DB_NAME`

```bash
# Set them up locally
cd tech-product-api
npm run setup-secrets
```

#### B. Verify RDS Instance
Check if your RDS instance is running and accessible:

```bash
# Check RDS status
aws rds describe-db-instances \
  --db-instance-identifier tech-challenge-products-db \
  --query 'DBInstances[0].{Status:DBInstanceStatus,Endpoint:Endpoint}'
```

#### C. Check Security Groups
Ensure the RDS security group allows connections from the EKS cluster:

```bash
# Get EKS cluster security group
aws eks describe-cluster --name tech_challenge_cluster --query 'cluster.resourcesVpcConfig.clusterSecurityGroupId'

# Check RDS security group rules
aws rds describe-db-instances \
  --db-instance-identifier tech-challenge-products-db \
  --query 'DBInstances[0].VpcSecurityGroups[0].VpcSecurityGroupId'
```

### 2. Database Connection Errors

**Symptoms:**
- "Connection refused" errors
- "Authentication failed" errors
- "Database does not exist" errors

**Solutions:**

#### A. Test Database Connection Locally
```bash
# Get database URL
cd tech-product-api
npm run db:url:test
```

#### B. Check Database Credentials
```bash
# Verify secrets are set correctly
npm run verify-secrets
```

### 3. Prisma Migration Errors

**Symptoms:**
- "Migration failed" errors
- "Schema mismatch" errors
- "Table already exists" errors

**Solutions:**

#### A. Check Migration Files
Ensure your migration files are up to date:

```bash
# Generate migration files
npx prisma migrate dev --name fix_migration

# Check migration status
npx prisma migrate status
```

#### B. Reset Database (Development Only)
```bash
# Reset database and reapply migrations
npx prisma migrate reset
```

## 🔍 Debugging Steps

### 1. Check Job Status
```bash
# Get job status
kubectl get jobs -n products-service

# Get job details
kubectl describe job tech-product-api-migration -n products-service
```

### 2. Check Pod Logs
```bash
# Get pod name
kubectl get pods -n products-service -l job-name=tech-product-api-migration

# Get logs
kubectl logs <pod-name> -n products-service
```

### 3. Check Pod Events
```bash
# Get pod events
kubectl describe pod <pod-name> -n products-service
```

### 4. Test Database Connectivity
```bash
# Test from within the cluster
kubectl run test-db-connection --rm -i --tty --image=postgres:15 -- bash

# Inside the pod, test connection
psql "postgresql://username:password@host:5432/database"
```

## 🛠️ Quick Fixes

### 1. Restart Migration Job
```bash
# Delete the stuck job
kubectl delete job tech-product-api-migration -n products-service

# The CI/CD pipeline will recreate it on next run
```

### 2. Update GitHub Secrets
```bash
# Re-setup secrets
npm run setup-secrets
```

### 3. Check RDS Status
```bash
# Ensure RDS is available
aws rds wait db-instance-available \
  --db-instance-identifier tech-challenge-products-db
```

## 📋 Pre-Deployment Checklist

Before running the CI/CD pipeline, ensure:

- [ ] GitHub secrets are set (`DB_USERNAME`, `DB_PASSWORD`, `DB_NAME`)
- [ ] RDS instance is running and available
- [ ] Security groups allow EKS → RDS connections
- [ ] Migration files are up to date
- [ ] Database schema is compatible

## 🚀 Manual Migration (Emergency)

If the automated migration fails, you can run it manually:

```bash
# Set environment variables
export DATABASE_URL="postgresql://username:password@host:5432/database"

# Run migration manually
npx prisma migrate deploy
```

## 📞 Getting Help

If you're still having issues:

1. **Check the enhanced CI/CD logs** - The updated workflow now provides detailed debugging information
2. **Verify all prerequisites** - Use the checklist above
3. **Test locally first** - Run `npm run db:url:test` to verify database connectivity
4. **Check AWS resources** - Ensure RDS and EKS are properly configured

The updated CI/CD workflow will now provide much more detailed information about what's failing, making it easier to diagnose and fix issues. 