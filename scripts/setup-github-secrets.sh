#!/bin/bash

# Script to set up GitHub secrets for database credentials
set -e

echo "🔐 Setting up GitHub secrets for database credentials..."

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
    
    if ! command -v gh &> /dev/null; then
        print_error "GitHub CLI is not installed"
        print_info "Install it from: https://cli.github.com/"
        exit 1
    fi
    
    # Check if user is authenticated with GitHub CLI
    if ! gh auth status &> /dev/null; then
        print_error "Not authenticated with GitHub CLI"
        print_info "Please run: gh auth login"
        exit 1
    fi
    
    print_status "Prerequisites check completed"
}

# Function to get database credentials
get_database_credentials() {
    print_status "Getting database credentials..."
    
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
    
    # Get database credentials from Terraform outputs
    print_status "Extracting database credentials from Terraform..."
    
    # Get username from Terraform outputs
    DB_USERNAME=$(terraform output -raw products_rds_username 2>/dev/null || echo "")
    
    # Get database name from Terraform outputs
    DB_NAME=$(terraform output -raw products_rds_database_name 2>/dev/null || echo "")
    
    # For password, we need to get it from variables or prompt
    if [ -z "$DB_PASSWORD" ]; then
        read -s -p "Enter database password: " DB_PASSWORD
        echo
    fi
    
    if [ -z "$DB_USERNAME" ] || [ -z "$DB_PASSWORD" ] || [ -z "$DB_NAME" ]; then
        print_error "Database credentials are incomplete"
        print_info "Username: $DB_USERNAME"
        print_info "Database: $DB_NAME"
        print_info "Password: [HIDDEN]"
        exit 1
    fi
    
    # Go back to the original directory
    cd ../tech-product-api
    
    # Export the variables
    export DB_USERNAME
    export DB_PASSWORD
    export DB_NAME
}

# Function to set GitHub secrets
set_github_secrets() {
    print_status "Setting GitHub secrets..."
    
    # Get the repository name
    REPO_NAME=$(gh repo view --json name -q .name 2>/dev/null || echo "")
    
    if [ -z "$REPO_NAME" ]; then
        print_error "Could not determine repository name"
        exit 1
    fi
    
    print_info "Setting secrets for repository: $REPO_NAME"
    
    # Set DB_USERNAME secret
    print_status "Setting DB_USERNAME secret..."
    echo "$DB_USERNAME" | gh secret set DB_USERNAME --repo "$REPO_NAME"
    
    # Set DB_PASSWORD secret
    print_status "Setting DB_PASSWORD secret..."
    echo "$DB_PASSWORD" | gh secret set DB_PASSWORD --repo "$REPO_NAME"
    
    # Set DB_NAME secret
    print_status "Setting DB_NAME secret..."
    echo "$DB_NAME" | gh secret set DB_NAME --repo "$REPO_NAME"
    
    print_status "✅ GitHub secrets set successfully"
}

# Function to verify secrets
verify_secrets() {
    print_status "Verifying GitHub secrets..."
    
    # Get the repository name
    REPO_NAME=$(gh repo view --json name -q .name 2>/dev/null || echo "")
    
    if [ -z "$REPO_NAME" ]; then
        print_error "Could not determine repository name"
        exit 1
    fi
    
    # Check if secrets exist
    if gh secret list --repo "$REPO_NAME" | grep -q "DB_USERNAME"; then
        print_status "✅ DB_USERNAME secret is set"
    else
        print_error "❌ DB_USERNAME secret is not set"
        exit 1
    fi
    
    if gh secret list --repo "$REPO_NAME" | grep -q "DB_PASSWORD"; then
        print_status "✅ DB_PASSWORD secret is set"
    else
        print_error "❌ DB_PASSWORD secret is not set"
        exit 1
    fi
    
    if gh secret list --repo "$REPO_NAME" | grep -q "DB_NAME"; then
        print_status "✅ DB_NAME secret is set"
    else
        print_error "❌ DB_NAME secret is not set"
        exit 1
    fi
}

# Function to show usage instructions
show_usage() {
    echo ""
    print_info "Setup completed successfully!"
    echo ""
    print_info "Your GitHub secrets are now configured:"
    echo "  - DB_USERNAME: Database username"
    echo "  - DB_PASSWORD: Database password"
    echo "  - DB_NAME: Database name"
    echo ""
    print_info "The CI/CD pipeline will now:"
    echo "1. Get RDS endpoint and port from AWS dynamically"
    echo "2. Get credentials from GitHub secrets"
    echo "3. Construct the database URL automatically"
    echo ""
    print_info "To test the setup:"
    echo "1. Push a commit to main branch"
    echo "2. Check the GitHub Actions tab"
    echo "3. The deployment should work automatically"
    echo ""
    print_warning "⚠️  Keep your database credentials secure!"
}

# Function to show current secrets
show_secrets() {
    print_status "Current GitHub secrets:"
    
    # Get the repository name
    REPO_NAME=$(gh repo view --json name -q .name 2>/dev/null || echo "")
    
    if [ -n "$REPO_NAME" ]; then
        print_info "Repository: $REPO_NAME"
        print_info "DB_USERNAME: [HIDDEN]"
        print_info "DB_PASSWORD: [HIDDEN]"
        print_info "DB_NAME: [HIDDEN]"
        print_info "Note: Secret values are hidden for security"
    fi
}

# Main script logic
main() {
    case "${1:-setup}" in
        "setup")
            print_status "Setting up GitHub secrets..."
            check_prerequisites
            get_database_credentials
            set_github_secrets
            verify_secrets
            show_usage
            ;;
        "verify")
            print_status "Verifying GitHub secrets..."
            check_prerequisites
            verify_secrets
            ;;
        "show")
            print_status "Showing current secrets..."
            check_prerequisites
            show_secrets
            ;;
        "get-credentials")
            print_status "Getting database credentials only..."
            get_database_credentials
            echo "DB_USERNAME=$DB_USERNAME"
            echo "DB_NAME=$DB_NAME"
            echo "DB_PASSWORD=[HIDDEN]"
            ;;
        *)
            echo "Usage: $0 {setup|verify|show|get-credentials}"
            echo ""
            echo "Commands:"
            echo "  setup          - Set up GitHub secrets from database repository"
            echo "  verify         - Verify that GitHub secrets are set correctly"
            echo "  show           - Show current GitHub secrets (names only)"
            echo "  get-credentials - Get database credentials only (for manual use)"
            echo ""
            echo "Environment variables:"
            echo "  DB_PASSWORD - Database password (optional, will prompt if not set)"
            exit 1
            ;;
    esac
}

# Run main function
main "$@" 