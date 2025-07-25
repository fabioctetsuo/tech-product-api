#!/bin/bash

# Script to store database credentials in AWS SSM Parameter Store
set -e

echo "🔐 Storing database credentials in AWS SSM Parameter Store..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

# Function to check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    if ! command -v aws &> /dev/null; then
        print_error "AWS CLI is not installed"
        exit 1
    fi
    
    if ! command -v terraform &> /dev/null; then
        print_error "Terraform is not installed"
        exit 1
    fi
    
    # Check AWS credentials
    if ! aws sts get-caller-identity &> /dev/null; then
        print_error "AWS credentials not configured"
        print_info "Please run: aws configure"
        exit 1
    fi
    
    print_status "Prerequisites check completed"
}

# Function to get database credentials from Terraform
get_database_credentials() {
    print_status "Getting database credentials from Terraform..."
    
    # Check if database repository exists
    if [ ! -d "../tech-challenge-fiap-db" ]; then
        print_error "Database repository not found at ../tech-challenge-fiap-db"
        print_info "Please clone the database repository first:"
        echo "  git clone https://github.com/fabioctetsuo/tech-challenge-fiap-db.git ../tech-challenge-fiap-db"
        exit 1
    fi
    
    # Navigate to database repository
    cd ../tech-challenge-fiap-db
    
    # Check if Terraform is initialized
    if [ ! -f ".terraform/terraform.tfstate" ]; then
        print_error "Terraform state not found"
        print_info "Please run 'terraform init' and 'terraform apply' in the database repository first"
        exit 1
    fi
    
    # Get database credentials from Terraform variables or outputs
    # Note: We need to get these from the Terraform state or variables
    print_status "Extracting database credentials..."
    
    # For now, we'll prompt for credentials (you can modify this based on your setup)
    if [ -z "$DB_USERNAME" ]; then
        read -p "Enter database username: " DB_USERNAME
    fi
    
    if [ -z "$DB_PASSWORD" ]; then
        read -s -p "Enter database password: " DB_PASSWORD
        echo
    fi
    
    if [ -z "$DB_USERNAME" ] || [ -z "$DB_PASSWORD" ]; then
        print_error "Database credentials are required"
        exit 1
    fi
    
    # Go back to the original directory
    cd ../tech-product-api
    
    # Export the variables
    export DB_USERNAME
    export DB_PASSWORD
}

# Function to store credentials in SSM Parameter Store
store_credentials() {
    print_status "Storing credentials in AWS SSM Parameter Store..."
    
    # Store username
    aws ssm put-parameter \
        --name "/tech-challenge/products/db/username" \
        --value "$DB_USERNAME" \
        --type "SecureString" \
        --description "Products database username" \
        --overwrite \
        --region us-east-1
    
    # Store password
    aws ssm put-parameter \
        --name "/tech-challenge/products/db/password" \
        --value "$DB_PASSWORD" \
        --type "SecureString" \
        --description "Products database password" \
        --overwrite \
        --region us-east-1
    
    print_status "✅ Credentials stored successfully in SSM Parameter Store"
}

# Function to verify stored credentials
verify_credentials() {
    print_status "Verifying stored credentials..."
    
    # Retrieve and verify username
    STORED_USERNAME=$(aws ssm get-parameter \
        --name "/tech-challenge/products/db/username" \
        --with-decryption \
        --query 'Parameter.Value' \
        --output text \
        --region us-east-1)
    
    if [ "$STORED_USERNAME" = "$DB_USERNAME" ]; then
        print_status "✅ Username stored correctly"
    else
        print_error "❌ Username verification failed"
        exit 1
    fi
    
    # Retrieve and verify password (without displaying it)
    STORED_PASSWORD=$(aws ssm get-parameter \
        --name "/tech-challenge/products/db/password" \
        --with-decryption \
        --query 'Parameter.Value' \
        --output text \
        --region us-east-1)
    
    if [ "$STORED_PASSWORD" = "$DB_PASSWORD" ]; then
        print_status "✅ Password stored correctly"
    else
        print_error "❌ Password verification failed"
        exit 1
    fi
}

# Function to show usage instructions
show_usage() {
    echo ""
    print_info "Setup completed successfully!"
    echo ""
    print_info "Your database credentials are now stored in AWS SSM Parameter Store:"
    echo "  - Username: /tech-challenge/products/db/username"
    echo "  - Password: /tech-challenge/products/db/password"
    echo ""
    print_info "The CI/CD pipeline will now automatically retrieve these credentials"
    echo "and construct the database URL dynamically from AWS RDS."
    echo ""
    print_info "To test the setup:"
    echo "1. Push a commit to main branch"
    echo "2. Check the GitHub Actions tab"
    echo "3. The deployment should retrieve credentials dynamically"
    echo ""
    print_warning "⚠️  Keep your database credentials secure!"
}

# Function to clean up credentials (if needed)
cleanup_credentials() {
    print_status "Cleaning up stored credentials..."
    
    # Remove username parameter
    aws ssm delete-parameter \
        --name "/tech-challenge/products/db/username" \
        --region us-east-1 2>/dev/null || true
    
    # Remove password parameter
    aws ssm delete-parameter \
        --name "/tech-challenge/products/db/password" \
        --region us-east-1 2>/dev/null || true
    
    print_status "✅ Credentials cleaned up successfully"
}

# Main script logic
main() {
    case "${1:-store}" in
        "store")
            print_status "Storing database credentials..."
            check_prerequisites
            get_database_credentials
            store_credentials
            verify_credentials
            show_usage
            ;;
        "verify")
            print_status "Verifying stored credentials..."
            check_prerequisites
            get_database_credentials
            verify_credentials
            ;;
        "cleanup")
            print_status "Cleaning up stored credentials..."
            check_prerequisites
            cleanup_credentials
            ;;
        *)
            echo "Usage: $0 {store|verify|cleanup}"
            echo ""
            echo "Commands:"
            echo "  store   - Store database credentials in SSM Parameter Store"
            echo "  verify  - Verify that credentials are stored correctly"
            echo "  cleanup - Remove stored credentials from SSM Parameter Store"
            echo ""
            echo "Environment variables:"
            echo "  DB_USERNAME - Database username (optional, will prompt if not set)"
            echo "  DB_PASSWORD - Database password (optional, will prompt if not set)"
            exit 1
            ;;
    esac
}

# Run main function
main "$@" 