#!/bin/bash

# Script to get database connection information from Terraform outputs
set -e

echo "🔍 Retrieving database connection information..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Check if we're in the right directory
if [ ! -d "../tech-challenge-fiap-db" ]; then
    print_warning "tech-challenge-fiap-db directory not found. Please run this script from the tech-product-api directory."
    exit 1
fi

# Navigate to the database directory
cd ../tech-challenge-fiap-db

# Check if Terraform is initialized
if [ ! -f ".terraform/terraform.tfstate" ]; then
    print_warning "Terraform state not found. Please run 'terraform init' and 'terraform apply' in the tech-challenge-fiap-db directory first."
    exit 1
fi

# Get the database endpoint
print_status "Getting database endpoint..."
DB_ENDPOINT=$(terraform output -raw products_rds_endpoint 2>/dev/null || echo "")

if [ -z "$DB_ENDPOINT" ]; then
    print_warning "Could not retrieve database endpoint. Please check your Terraform outputs."
    exit 1
fi

print_status "Database endpoint: $DB_ENDPOINT"

# Get the database name from variables
DB_NAME=$(grep -A 5 "variable \"db_name\"" variables.tf | grep "default" | sed 's/.*default.*=.*"\([^"]*\)".*/\1/' 2>/dev/null || echo "product_db")

print_status "Database name: $DB_NAME"

# Construct the DATABASE_URL
# Note: You'll need to replace USERNAME and PASSWORD with your actual database credentials
DATABASE_URL="postgresql://USERNAME:PASSWORD@$DB_ENDPOINT/$DB_NAME"

echo ""
print_status "Database connection information:"
echo "  Endpoint: $DB_ENDPOINT"
echo "  Database: $DB_NAME"
echo "  DATABASE_URL: $DATABASE_URL"
echo ""
print_warning "⚠️  Remember to replace USERNAME and PASSWORD with your actual database credentials!"
echo ""
print_status "To use this in deployment:"
echo "  export DATABASE_URL=\"$DATABASE_URL\""
echo "  ./k8s/deploy.sh" 