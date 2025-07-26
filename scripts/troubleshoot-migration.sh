#!/bin/bash

# Migration Job Troubleshooting Script
set -e

echo "🔍 Migration Job Troubleshooting Script"
echo "========================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if kubectl is available
if ! command -v kubectl &> /dev/null; then
    print_error "kubectl is not installed or not in PATH"
    exit 1
fi

# Check if namespace exists
print_info "Checking namespace..."
if kubectl get namespace products-service &> /dev/null; then
    print_success "Namespace 'products-service' exists"
else
    print_error "Namespace 'products-service' does not exist"
    exit 1
fi

# Check if migration job exists
print_info "Checking migration job..."
if kubectl get job tech-product-api-migration -n products-service &> /dev/null; then
    print_success "Migration job exists"
    
    # Get job details
    echo ""
    print_info "Job Details:"
    kubectl describe job tech-product-api-migration -n products-service
    
    # Get job status
    echo ""
    print_info "Job Status:"
    kubectl get job tech-product-api-migration -n products-service -o yaml | grep -A 10 "status:"
    
else
    print_warning "Migration job does not exist"
fi

# Check for pods related to the migration job
print_info "Checking migration job pods..."
PODS=$(kubectl get pods -n products-service -l job-name=tech-product-api-migration -o jsonpath='{.items[*].metadata.name}' 2>/dev/null || echo "")

if [ -n "$PODS" ]; then
    print_success "Found migration job pods: $PODS"
    
    for POD in $PODS; do
        echo ""
        print_info "Pod: $POD"
        print_info "Pod Status:"
        kubectl get pod $POD -n products-service -o wide
        
        echo ""
        print_info "Pod Details:"
        kubectl describe pod $POD -n products-service
        
        echo ""
        print_info "Pod Logs:"
        kubectl logs $POD -n products-service || echo "No logs available"
    done
else
    print_warning "No migration job pods found"
fi

# Check if secret exists
print_info "Checking database secret..."
if kubectl get secret tech-product-api-secret -n products-service &> /dev/null; then
    print_success "Database secret exists"
    
    # Check if DATABASE_URL is set (without exposing the value)
    if kubectl get secret tech-product-api-secret -n products-service -o jsonpath='{.data.DATABASE_URL}' &> /dev/null; then
        print_success "DATABASE_URL is set in secret"
    else
        print_error "DATABASE_URL is not set in secret"
    fi
else
    print_error "Database secret does not exist"
fi

# Check database connectivity (if possible)
print_info "Checking database connectivity..."
if kubectl get secret tech-product-api-secret -n products-service -o jsonpath='{.data.DATABASE_URL}' &> /dev/null; then
    # Try to get database host from the URL
    DB_URL=$(kubectl get secret tech-product-api-secret -n products-service -o jsonpath='{.data.DATABASE_URL}' | base64 -d)
    DB_HOST=$(echo $DB_URL | sed -n 's/.*@\([^:]*\):.*/\1/p')
    
    if [ -n "$DB_HOST" ]; then
        print_info "Database host: $DB_HOST"
        
        # Try to check if the host is reachable from within the cluster
        print_info "Testing connectivity from within the cluster..."
        if kubectl run db-connectivity-test --image=busybox --rm -it --restart=Never -- sh -c "nc -z $DB_HOST 5432" 2>/dev/null; then
            print_success "Database host is reachable from within the cluster"
        else
            print_warning "Database host is not reachable from within the cluster"
            print_warning "This might indicate:"
            print_warning "1. RDS instance is not running"
            print_warning "2. Security group doesn't allow connections from EKS"
            print_warning "3. Network connectivity issues within the VPC"
        fi
    fi
fi

# Check recent events in the namespace
echo ""
print_info "Recent events in namespace:"
kubectl get events -n products-service --sort-by='.lastTimestamp' | tail -20

echo ""
print_info "Troubleshooting complete!"
echo ""
print_info "Common issues and solutions:"
echo "1. If job is stuck in 'Pending': Check resource requests/limits"
echo "2. If job fails with database errors: Check DATABASE_URL and network connectivity"
echo "3. If job times out: Check if migrations are taking too long"
echo "4. If job succeeds but CI reports failure: Check job status detection logic" 