# 🗄️ Database Setup Guide

This guide explains how to set up and retrieve the database URL from AWS RDS for the Product API microservice.

## 📋 Prerequisites

Before proceeding, ensure you have:

1. **AWS RDS Database Deployed**: The database should be created using the `tech-challenge-fiap-db` repository
2. **Terraform State Available**: The Terraform state should contain the database outputs
3. **AWS CLI Configured**: With appropriate permissions to access RDS
4. **GitHub CLI** (optional): For updating GitHub secrets automatically

## 🔧 Getting the Database URL

### Option 1: Using the Script (Recommended)

```bash
# Navigate to the tech-product-api directory
cd tech-product-api

# Get database URL and show usage instructions
npm run db:url

# Get database URL and test connection
npm run db:url:test

# Get database URL and update GitHub secrets
npm run db:url:update-secrets

# Get database URL, test connection, and update secrets
npm run db:url:all
```

### Option 2: Manual Terraform Output

```bash
# Navigate to the database directory
cd tech-challenge-fiap-db

# Get the database URL
terraform output -raw products_database_url

# Get individual components
terraform output -raw products_rds_endpoint
terraform output -raw products_rds_username
terraform output -raw products_rds_database_name
```

### Option 3: AWS CLI

```bash
# Get RDS instance details
aws rds describe-db-instances --db-instance-identifier tech-challenge-products-db

# Extract endpoint
aws rds describe-db-instances \
  --db-instance-identifier tech-challenge-products-db \
  --query 'DBInstances[0].Endpoint.Address' \
  --output text
```

## 🔐 Database Credentials

The database credentials are stored in Terraform variables. You can find them in:

- **Terraform Variables**: `tech-challenge-fiap-db/variables.tf`
- **Terraform State**: Contains the actual values
- **AWS Secrets Manager** (if configured)

### Default Database Configuration

```hcl
# From tech-challenge-fiap-db/variables.tf
variable "products_db_username" {
  description = "The username for the Products RDS instance"
  type        = string
  sensitive   = true
}

variable "products_db_password" {
  description = "The password for the Products RDS instance"
  type        = string
  sensitive   = true
}

variable "products_db_name" {
  description = "Products database name"
  type        = string
  default     = "productsdb"
}

variable "products_db_identifier" {
  description = "The identifier for the Products RDS instance"
  type        = string
  default     = "tech-challenge-products-db"
}
```

## 🚀 Using the Database URL

### For Local Development

```bash
# Set environment variable
export DATABASE_URL="postgresql://username:password@host:5432/database"

# Run the application
npm run start:dev
```

### For Docker Compose

```bash
# Set environment variable
export DATABASE_URL="postgresql://username:password@host:5432/database"

# Start services
docker-compose up -d
```

### For Kubernetes Deployment

```bash
# Set environment variable
export DATABASE_URL="postgresql://username:password@host:5432/database"

# Deploy to Kubernetes
./k8s/deploy.sh
```

### For GitHub Actions

The CI/CD workflows automatically retrieve the database URL from AWS RDS, so no manual configuration is needed.

## 🔒 Security Considerations

### GitHub Secrets

If you want to store the database URL in GitHub secrets:

```bash
# Using GitHub CLI
echo "your-database-url" | gh secret set DATABASE_URL

# Or manually in GitHub web interface
# Settings > Secrets and variables > Actions > New repository secret
```

### Environment Variables

Never commit the database URL to version control:

```bash
# ✅ Good - Use environment variables
export DATABASE_URL="postgresql://user:pass@host:5432/db"

# ❌ Bad - Don't hardcode in files
DATABASE_URL="postgresql://user:pass@host:5432/db"
```

### AWS IAM Permissions

Ensure your AWS credentials have the necessary permissions:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "rds:DescribeDBInstances",
        "rds:DescribeDBClusters"
      ],
      "Resource": "*"
    }
  ]
}
```

## 🧪 Testing Database Connection

### Using the Script

```bash
# Test connection using the script
npm run db:url:test
```

### Using psql

```bash
# Test connection with PostgreSQL client
psql "postgresql://username:password@host:5432/database" -c "SELECT 1;"
```

### Using the Application

```bash
# Test connection through the application
DATABASE_URL="postgresql://username:password@host:5432/database" npm run start:dev
```

## 🔄 Database Migrations

### Running Migrations

```bash
# Run migrations locally
npx prisma migrate deploy

# Run migrations in Docker
docker-compose exec product-api npx prisma migrate deploy

# Run migrations in Kubernetes (automatic in deployment)
kubectl exec -it deployment/tech-product-api -n products-service -- npx prisma migrate deploy
```

### Migration Status

```bash
# Check migration status
npx prisma migrate status

# Check migration history
npx prisma migrate status --preview-feature
```

## 🚨 Troubleshooting

### Common Issues

1. **Database URL not found**:
   ```bash
   # Check if Terraform state exists
   ls -la tech-challenge-fiap-db/.terraform/
   
   # Re-run Terraform apply
   cd tech-challenge-fiap-db
   terraform apply
   ```

2. **Connection refused**:
   - Check if RDS instance is running
   - Verify security group allows connections
   - Check network connectivity

3. **Authentication failed**:
   - Verify username and password
   - Check if credentials are correct in Terraform state

4. **Database does not exist**:
   - Check if database was created
   - Verify database name in configuration

### Debugging Commands

```bash
# Check RDS instance status
aws rds describe-db-instances --db-instance-identifier tech-challenge-products-db

# Check security groups
aws ec2 describe-security-groups --group-ids sg-xxxxxxxxx

# Test network connectivity
telnet your-rds-endpoint 5432

# Check Terraform outputs
cd tech-challenge-fiap-db
terraform output
```

## 📊 Database Schema

The database contains the following tables:

- **categoria**: Product categories
- **produto**: Products
- **_prisma_migrations**: Migration history

### Viewing Schema

```bash
# Using Prisma Studio
npx prisma studio

# Using psql
psql "your-database-url" -c "\dt"

# Using the application
curl http://localhost:3001/categorias
curl http://localhost:3001/produtos
```

## 🔄 Updating Database URL

If the database URL changes (e.g., after RDS modifications):

1. **Update Terraform state**:
   ```bash
   cd tech-challenge-fiap-db
   terraform apply
   ```

2. **Get new database URL**:
   ```bash
   npm run db:url
   ```

3. **Update GitHub secrets** (if using):
   ```bash
   npm run db:url:update-secrets
   ```

4. **Redeploy application**:
   ```bash
   ./k8s/deploy.sh
   ```

## 📞 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Verify AWS credentials and permissions
3. Check Terraform state and outputs
4. Test database connectivity manually
5. Review application logs for connection errors 