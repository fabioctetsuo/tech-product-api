# 🛍️ Product Microservice

Product catalog management microservice for handling products and categories.

## 🚀 Quick Start

### Local Development
```bash
# Full deployment (build, start, migrate, health check)
./deploy.sh

# Or step by step
./deploy.sh build    # Build Docker image
./deploy.sh start    # Start services
./deploy.sh migrate  # Run database migrations
./deploy.sh health   # Check service health
```

### Manual Start
```bash
# Start services
docker-compose up -d

# Run migrations
docker-compose exec product-api npx prisma migrate deploy

# Check health
curl http://localhost:3001/health
```

## ☁️ Production Deployment (AWS EKS)

### Prerequisites
- AWS EKS cluster deployed (see `tech-challenge-fiap-infra`)
- RDS PostgreSQL database (see `tech-challenge-fiap-db`)
- Docker Hub account
- kubectl configured for your EKS cluster
- AWS credentials configured for CI/CD pipeline

### CI/CD Pipeline
The application uses GitHub Actions for automated deployment:

1. **Push to main branch** triggers the pipeline
2. **Tests** run linting and unit tests
3. **Docker image** is built and pushed to Docker Hub
4. **Deployment** to AWS EKS cluster

### Manual Workflows
Additional GitHub Actions workflows are available for manual operations:

- **Manual Deploy** (`manual-deploy.yml`): Deploy any Docker image with custom parameters
- **Rollback** (`rollback.yml`): Rollback to a previous deployment version
- **Scale** (`scale.yml`): Scale the deployment up or down

These workflows can be triggered from the GitHub Actions tab with custom inputs.

### Manual Deployment
```bash
# Set environment variables
export DOCKER_IMAGE="your-username/tech-product-api:latest"

# Deploy to Kubernetes (database URL retrieved dynamically)
./k8s/deploy.sh
```

For detailed deployment instructions, see [k8s/README.md](k8s/README.md).

### Dynamic Database URL Setup

The application now uses **dynamic database URL retrieval** from AWS RDS:

1. **Set up GitHub secrets** for database credentials:
   ```bash
   npm run setup-secrets
   ```

2. **Verify setup**:
   ```bash
   npm run verify-secrets
   ```

3. **Deploy** - The CI/CD pipeline automatically:
   - Gets RDS endpoint and port from AWS dynamically
   - Gets credentials from GitHub secrets
   - Constructs database URL automatically

The system only retrieves the **dynamic parts** (endpoint, port) from AWS and uses **static credentials** from GitHub secrets.

## 📋 Available Commands

```bash
./deploy.sh deploy   # Full deployment
./deploy.sh start    # Start services only
./deploy.sh stop     # Stop services
./deploy.sh restart  # Restart services
./deploy.sh logs     # Show service logs
./deploy.sh build    # Build Docker image only
./deploy.sh migrate  # Run database migrations only
./deploy.sh health   # Check service health only
```

## 🌐 Service URLs

- **API**: http://localhost:3001
- **Health Check**: http://localhost:3001/health
- **Swagger Docs**: http://localhost:3001/api
- **Database**: localhost:5433

## 🗄️ Database

- **Database**: `product_db`
- **Tables**: `categoria`, `produto`

## 📡 API Endpoints

### Categories
- `GET /categorias` - List all categories
- `POST /categorias` - Create new category
- `GET /categorias/:id` - Get category by ID
- `PUT /categorias/:id` - Update category
- `DELETE /categorias/:id` - Delete category

### Products
- `GET /produtos` - List all products
- `POST /produtos` - Create new product
- `GET /produtos/:id` - Get product by ID
- `PUT /produtos/:id` - Update product
- `DELETE /produtos/:id` - Delete product
- `GET /produtos/categoria/:categoria_id` - Get products by category
- `GET /produtos/nome/:nome` - Search products by name

## 🔧 Environment Variables

```bash
DATABASE_URL=postgresql://postgres:password@product-postgres:5432/product_db
```

## 🛠️ Development

### Local Development
```bash
# Install dependencies
npm install

# Start in development mode
npm run start:dev

# Run migrations
npm run migrate:dev

# Open Prisma Studio
npm run prisma:studio
```

### Database Management
```bash
# Create migration
npx prisma migrate dev --name migration_name

# Apply migrations
npx prisma migrate deploy

# Reset database
npx prisma migrate reset

# View database
npx prisma studio
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run e2e tests
npm run test:e2e
```

## 📦 Docker

### Build Image
```bash
docker build -f Dockerfile.dev -t tech-product-api:dev .
```

### Run Container
```bash
docker run -p 3001:3001 tech-product-api:dev
```

## 🔍 Monitoring

- **Health Check**: `/health`
- **Logs**: `docker-compose logs -f product-api`
- **Database**: Connect to `localhost:5433` with `product_db`

## 🚨 Troubleshooting

### Service Not Starting
```bash
# Check logs
docker-compose logs product-api

# Check database connection
docker-compose exec product-postgres psql -U postgres -d product_db
```

### Migration Issues
```bash
# Reset database
docker-compose exec product-api npx prisma migrate reset

# Check migration status
docker-compose exec product-api npx prisma migrate status
```

### Kubernetes Migration Job Issues
If you encounter issues with migration jobs in Kubernetes (especially in CI/CD):

```bash
# Run the troubleshooting script
./scripts/troubleshoot-migration.sh

# Check job status manually
kubectl get job tech-product-api-migration -n products-service
kubectl describe job tech-product-api-migration -n products-service

# Check pod logs
kubectl get pods -n products-service -l job-name=tech-product-api-migration
kubectl logs <pod-name> -n products-service
```

#### Common Migration Job Issues:

1. **Job completes but CI reports timeout**: This was a known issue with job status detection. The scripts have been updated with better status checking logic.

2. **Job stuck in Pending**: Check resource requests/limits and node availability.

3. **Database connection errors**: Verify DATABASE_URL in the Kubernetes secret.

4. **Migration timeout**: Check if migrations are taking too long or if there are database performance issues.

5. **Database connectivity test fails in CI**: This is expected behavior. The RDS instance is in private subnets and not accessible from GitHub Actions runners (which are outside the VPC). The actual connectivity is tested when the migration job runs inside the EKS cluster.

### Network Security

The application uses a secure network configuration:

- **RDS instances** are in private subnets (not publicly accessible)
- **EKS cluster** can access RDS through security group rules
- **GitHub Actions runners** cannot directly access RDS (this is by design)
- **Security groups** are configured to allow only necessary traffic

To update the RDS security group for better security:
```bash
cd tech-challenge-fiap-db
./update-security-groups.sh
```

This will restrict RDS access to only the EKS cluster instead of allowing connections from anywhere.

### Port Conflicts
If port 3001 or 5433 is already in use, modify the ports in `docker-compose.yml`:
```yaml
ports:
  - '3002:3001'  # Change 3001 to 3002
```

## 📊 Category Types

The service supports the following category types:
- `BEBIDA` - Beverages
- `SOBREMESA` - Desserts
- `ACOMPANHAMENTO` - Side dishes
- `LANCHE` - Snacks/Sandwiches 