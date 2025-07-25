#!/bin/bash

# Product Microservice Deployment Script
set -e

echo "🚀 Starting Product Microservice Deployment..."

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

# Check if required tools are installed
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed"
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed"
        exit 1
    fi
    
    print_status "All prerequisites are satisfied"
}

# Build Docker image
build_image() {
    print_status "Building Product API Docker image..."
    docker-compose build
    print_status "Image built successfully"
}

# Start services
start_services() {
    print_status "Starting Product microservice..."
    docker-compose up -d
    print_status "Services started successfully"
}

# Run database migrations
run_migrations() {
    print_status "Running database migrations..."
    
    # Wait for database to be ready
    print_status "Waiting for database to be ready..."
    sleep 10
    
    # Run migrations
    print_status "Running Product API migrations..."
    docker-compose exec product-api npx prisma migrate deploy
    
    print_status "Migrations completed successfully"
}

# Check service health
check_health() {
    print_status "Checking service health..."
    
    if curl -f -s "http://localhost:3001/health" > /dev/null; then
        print_status "✅ Product API is healthy"
    else
        print_error "❌ Product API is not responding"
    fi
}

# Show service URLs
show_urls() {
    echo ""
    print_status "🎉 Product Microservice is running!"
    echo ""
    echo "Service URLs:"
    echo "  🛍️  Product API:    http://localhost:3001"
    echo "  🗄️  Product Database: localhost:5433"
    echo ""
    echo "Health Check:"
    echo "  Product API:    http://localhost:3001/health"
    echo "  Swagger Docs:   http://localhost:3001/api"
    echo ""
}

# Stop services
stop_services() {
    print_status "Stopping Product microservice..."
    docker-compose down
    print_status "Services stopped successfully"
}

# Show logs
show_logs() {
    print_status "Showing service logs..."
    docker-compose logs -f
}

# Main script logic
case "${1:-deploy}" in
    "deploy")
        check_prerequisites
        build_image
        start_services
        run_migrations
        check_health
        show_urls
        ;;
    "start")
        start_services
        show_urls
        ;;
    "stop")
        stop_services
        ;;
    "restart")
        stop_services
        start_services
        show_urls
        ;;
    "logs")
        show_logs
        ;;
    "build")
        check_prerequisites
        build_image
        ;;
    "migrate")
        run_migrations
        ;;
    "health")
        check_health
        ;;
    *)
        echo "Usage: $0 {deploy|start|stop|restart|logs|build|migrate|health}"
        echo ""
        echo "Commands:"
        echo "  deploy   - Full deployment (build, start, migrate, health check)"
        echo "  start    - Start services only"
        echo "  stop     - Stop services"
        echo "  restart  - Restart services"
        echo "  logs     - Show service logs"
        echo "  build    - Build Docker image only"
        echo "  migrate  - Run database migrations only"
        echo "  health   - Check service health only"
        exit 1
        ;;
esac 