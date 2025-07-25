#!/bin/bash

# Script to get database URL from AWS RDS and optionally update GitHub secrets
set -e

echo "🔍 Retrieving database URL from AWS RDS..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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
    
    if ! command -v gh &> /dev/null; then
        print_warning "GitHub CLI is not installed. Cannot update GitHub secrets automatically."
    fi
    
    print_status "Prerequisites check completed"
}

# Function to get database URL from Terraform outputs
get_database_url() {
    print_status "Getting database URL from Terraform outputs..."
    
    # Check if we're in the right directory
    if [ ! -d "../tech-challenge-fiap-db" ]; then
        print_error "tech-challenge-fiap-db directory not found. Please run this script from the tech-product-api directory."
        exit 1
    fi
    
    # Navigate to the database directory
    cd ../tech-challenge-fiap-db
    
    # Check if Terraform is initialized
    if [ ! -f ".terraform/terraform.tfstate" ]; then
        print_error "Terraform state not found. Please run 'terraform init' and 'terraform apply' in the tech-challenge-fiap-db directory first."
        exit 1
    fi
    
    # Get the database URL
    print_status "Retrieving database URL..."
    DATABASE_URL=$(terraform output -raw products_database_url 2>/dev/null || echo "")
    
    if [ -z "$DATABASE_URL" ]; then
        print_error "Could not retrieve database URL. Please check your Terraform outputs."
        exit 1
    fi
    
    print_status "Database URL retrieved successfully"
    echo ""
    print_info "Database Connection Information:"
    echo "  Endpoint: $(terraform output -raw products_rds_endpoint)"
    echo "  Port: $(terraform output -raw products_rds_port)"
    echo "  Username: $(terraform output -raw products_rds_username)"
    echo "  Database: $(terraform output -raw products_rds_database_name)"
    echo "  DATABASE_URL: $DATABASE_URL"
    echo ""
    
    # Export the variable for use in other scripts
    export DATABASE_URL
}

# Function to update GitHub secrets
update_github_secrets() {
    if ! command -v gh &> /dev/null; then
        print_warning "GitHub CLI not available. Skipping GitHub secrets update."
        return
    fi
    
    print_status "Updating GitHub secrets..."
    
    # Check if user is authenticated with GitHub CLI
    if ! gh auth status &> /dev/null; then
        print_warning "Not authenticated with GitHub CLI. Please run 'gh auth login' first."
        return
    fi
    
    # Get the repository name
    REPO_NAME=$(gh repo view --json name -q .name 2>/dev/null || echo "")
    
    if [ -z "$REPO_NAME" ]; then
        print_warning "Could not determine repository name. Skipping GitHub secrets update."
        return
    fi
    
    # Update the DATABASE_URL secret
    print_status "Updating DATABASE_URL secret in GitHub..."
    echo "$DATABASE_URL" | gh secret set DATABASE_URL --repo "$REPO_NAME"
    
    print_status "GitHub secrets updated successfully"
}

# Function to show usage instructions
show_usage() {
    echo ""
    print_info "Usage Instructions:"
    echo ""
    echo "1. Set the DATABASE_URL environment variable:"
    echo "   export DATABASE_URL=\"$DATABASE_URL\""
    echo ""
    echo "2. Use in deployment:"
    echo "   ./k8s/deploy.sh"
    echo ""
    echo "3. Or use in manual GitHub Actions workflow with:"
    echo "   DATABASE_URL: $DATABASE_URL"
    echo ""
    print_warning "⚠️  Keep this URL secure and never commit it to version control!"
}

# Function to test database connection
test_connection() {
    print_status "Testing database connection..."
    
    # Check if psql is available
    if ! command -v psql &> /dev/null; then
        print_warning "PostgreSQL client (psql) not available. Skipping connection test."
        return
    fi
    
    # Extract connection details from URL
    DB_HOST=$(echo "$DATABASE_URL" | sed -n 's/.*@\([^:]*\):.*/\1/p')
    DB_PORT=$(echo "$DATABASE_URL" | sed -n 's/.*:\([0-9]*\)\/.*/\1/p')
    DB_NAME=$(echo "$DATABASE_URL" | sed -n 's/.*\/\([^?]*\).*/\1/p')
    DB_USER=$(echo "$DATABASE_URL" | sed -n 's/.*:\/\/\([^:]*\):.*/\1/p')
    
    print_status "Testing connection to $DB_HOST:$DB_PORT..."
    
    # Test connection (timeout after 10 seconds)
    if timeout 10 psql "$DATABASE_URL" -c "SELECT 1;" &> /dev/null; then
        print_status "✅ Database connection successful"
    else
        print_warning "⚠️  Database connection failed. This might be due to:"
        echo "   - Network connectivity issues"
        echo "   - Security group restrictions"
        echo "   - Database not ready yet"
        echo "   - Incorrect credentials"
    fi
}

# Main script logic
main() {
    case "${1:-get}" in
        "get")
            check_prerequisites
            get_database_url
            show_usage
            ;;
        "test")
            check_prerequisites
            get_database_url
            test_connection
            ;;
        "update-secrets")
            check_prerequisites
            get_database_url
            update_github_secrets
            ;;
        "all")
            check_prerequisites
            get_database_url
            test_connection
            update_github_secrets
            show_usage
            ;;
        *)
            echo "Usage: $0 {get|test|update-secrets|all}"
            echo ""
            echo "Commands:"
            echo "  get           - Get database URL and show usage instructions"
            echo "  test          - Get database URL and test connection"
            echo "  update-secrets - Get database URL and update GitHub secrets"
            echo "  all           - Get database URL, test connection, and update secrets"
            exit 1
            ;;
    esac
}

# Run main function
main "$@" 