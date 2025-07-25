# 🔄 Dynamic Database URL Setup

This guide explains how to set up dynamic database URL retrieval from AWS RDS, eliminating the need for static secrets.

## 🎯 Overview

Instead of storing the database URL as a static secret, the system now:
1. **Retrieves RDS endpoint dynamically** from AWS
2. **Gets credentials from SSM Parameter Store** securely
3. **Constructs the database URL** at runtime
4. **Works with any RDS changes** automatically

## 🔧 Setup Process

### Step 1: Store Database Credentials in SSM Parameter Store

```bash
# Navigate to the tech-product-api directory
cd tech-product-api

# Store database credentials in AWS SSM Parameter Store
npm run db:credentials:store
```

This will:
- Prompt for database username and password
- Store them securely in AWS SSM Parameter Store
- Verify the storage was successful

### Step 2: Verify the Setup

```bash
# Verify credentials are stored correctly
npm run db:credentials:verify

# Test database connection
npm run db:url:test
```

### Step 3: Deploy

The CI/CD pipeline will now automatically:
- Get RDS endpoint from AWS
- Retrieve credentials from SSM Parameter Store
- Construct the database URL dynamically
- Deploy the application

## 🔄 How It Works

### CI/CD Pipeline Flow

```mermaid
graph TD
    A[Push to main] --> B[Build & Test]
    B --> C[Configure AWS]
    C --> D[Get RDS Endpoint]
    D --> E[Get Credentials from SSM]
    E --> F[Construct Database URL]
    F --> G[Deploy to Kubernetes]
```

### Dynamic Database URL Construction

The pipeline constructs the database URL using:

```bash
# Get RDS endpoint
RDS_ENDPOINT=$(aws rds describe-db-instances \
  --db-instance-identifier tech-challenge-products-db \
  --query 'DBInstances[0].Endpoint.Address' \
  --output text)

# Get credentials from SSM
DB_USERNAME=$(aws ssm get-parameter \
  --name "/tech-challenge/products/db/username" \
  --with-decryption \
  --query 'Parameter.Value' \
  --output text)

DB_PASSWORD=$(aws ssm get-parameter \
  --name "/tech-challenge/products/db/password" \
  --with-decryption \
  --query 'Parameter.Value' \
  --output text)

# Construct URL
DATABASE_URL="postgresql://${DB_USERNAME}:${DB_PASSWORD}@${RDS_ENDPOINT}:5432/productsdb"
```

## 🔐 Security Benefits

### ✅ **No Static Secrets**
- Database URL is never stored in GitHub secrets
- Credentials are encrypted in AWS SSM Parameter Store
- Dynamic retrieval prevents credential exposure

### ✅ **Automatic Updates**
- RDS endpoint changes are automatically detected
- No manual intervention needed for endpoint updates
- Works with RDS failovers and maintenance

### ✅ **Access Control**
- AWS IAM controls access to SSM parameters
- Fine-grained permissions possible
- Audit trail for credential access

## 🛠️ Available Commands

### Database Credentials Management
```bash
# Store credentials in SSM Parameter Store
npm run db:credentials:store

# Verify stored credentials
npm run db:credentials:verify

# Clean up stored credentials
npm run db:credentials:cleanup
```

### Database URL Operations
```bash
# Get database URL and show usage
npm run db:url

# Get database URL and test connection
npm run db:url:test

# Get database URL and update GitHub secrets (legacy)
npm run db:url:update-secrets

# Complete setup (get URL, test, update secrets)
npm run db:url:all
```

## 🔍 AWS Resources Used

### SSM Parameter Store
- **Path**: `/tech-challenge/products/db/`
- **Parameters**:
  - `username` - Database username (SecureString)
  - `password` - Database password (SecureString)

### RDS Instance
- **Identifier**: `tech-challenge-products-db`
- **Endpoint**: Retrieved dynamically
- **Port**: 5432 (PostgreSQL default)

### Required AWS Permissions
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "rds:DescribeDBInstances"
      ],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "ssm:GetParameter",
        "ssm:PutParameter"
      ],
      "Resource": [
        "arn:aws:ssm:us-east-1:*:parameter/tech-challenge/products/db/*"
      ]
    }
  ]
}
```

## 🚨 Troubleshooting

### Common Issues

1. **RDS Instance Not Found**:
   ```bash
   # Check if RDS instance exists
   aws rds describe-db-instances --db-instance-identifier tech-challenge-products-db
   ```

2. **SSM Parameters Not Found**:
   ```bash
   # Check if parameters exist
   aws ssm get-parameter --name "/tech-challenge/products/db/username"
   aws ssm get-parameter --name "/tech-challenge/products/db/password"
   ```

3. **Insufficient Permissions**:
   ```bash
   # Check AWS identity
   aws sts get-caller-identity
   
   # Test permissions
   aws rds describe-db-instances --db-instance-identifier tech-challenge-products-db
   aws ssm get-parameter --name "/tech-challenge/products/db/username"
   ```

### Debugging Commands

```bash
# Get RDS endpoint manually
aws rds describe-db-instances \
  --db-instance-identifier tech-challenge-products-db \
  --query 'DBInstances[0].Endpoint.Address' \
  --output text

# Get credentials manually
aws ssm get-parameter \
  --name "/tech-challenge/products/db/username" \
  --with-decryption \
  --query 'Parameter.Value' \
  --output text

# Test database connection
psql "postgresql://username:password@endpoint:5432/database"
```

## 🔄 Migration from Static Secrets

If you were previously using static GitHub secrets:

1. **Store credentials in SSM**:
   ```bash
   npm run db:credentials:store
   ```

2. **Remove GitHub secrets** (optional):
   - Go to GitHub repository settings
   - Navigate to Secrets and variables > Actions
   - Remove `DATABASE_URL` secret

3. **Test the new setup**:
   ```bash
   npm run db:credentials:verify
   npm run db:url:test
   ```

## 📊 Monitoring

### SSM Parameter Access
```bash
# Check parameter access logs
aws logs describe-log-groups --log-group-name-prefix "/aws/ssm"
```

### RDS Monitoring
```bash
# Check RDS instance status
aws rds describe-db-instances \
  --db-instance-identifier tech-challenge-products-db \
  --query 'DBInstances[0].{Status:DBInstanceStatus,Endpoint:Endpoint}'
```

## 🔄 Updating Credentials

To update database credentials:

1. **Store new credentials**:
   ```bash
   npm run db:credentials:store
   ```

2. **Verify the update**:
   ```bash
   npm run db:credentials:verify
   ```

3. **Redeploy** (automatic on next push):
   ```bash
   git push origin main
   ```

## 🎉 Benefits Summary

- ✅ **Dynamic**: No static secrets to manage
- ✅ **Secure**: Credentials encrypted in AWS
- ✅ **Automatic**: Works with RDS changes
- ✅ **Scalable**: Easy to add more environments
- ✅ **Auditable**: Access logs available
- ✅ **Reliable**: No manual intervention needed

The system is now fully automated and secure! 🚀 