#!/bin/bash

# Azure Resource Provisioning Script for Branch-based Environments
# This script creates Azure Static Web App resources when branches are created
# Usage: ./scripts/create-branch-resources.sh <branch-name>

set -e

# Configuration
RESOURCE_GROUP="citysnap-rg"
LOCATION="eastus2"
SUBSCRIPTION_ID="${AZURE_SUBSCRIPTION_ID}"
BRANCH_NAME="${1:-develop}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
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

# Check if Azure CLI is installed
if ! command -v az &> /dev/null; then
    print_error "Azure CLI is not installed. Please install it first."
    exit 1
fi

# Check if logged in to Azure
if ! az account show &> /dev/null; then
    print_error "Not logged in to Azure. Please run 'az login' first."
    exit 1
fi

# Set subscription if provided
if [ -n "$SUBSCRIPTION_ID" ]; then
    print_status "Setting Azure subscription to: $SUBSCRIPTION_ID"
    az account set --subscription "$SUBSCRIPTION_ID"
fi

# Generate unique names based on branch
SAFE_BRANCH_NAME=$(echo "$BRANCH_NAME" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9-]/-/g' | sed 's/--*/-/g' | sed 's/^-\|-$//g')
SWA_NAME="citysnap-${SAFE_BRANCH_NAME}-$(date +%s)"
STORAGE_ACCOUNT_NAME="citysnap${SAFE_BRANCH_NAME}$(date +%s | tail -c 6)"

print_status "Creating resources for branch: $BRANCH_NAME"
print_status "Static Web App name: $SWA_NAME"
print_status "Storage Account name: $STORAGE_ACCOUNT_NAME"

# Create resource group if it doesn't exist
print_status "Creating resource group: $RESOURCE_GROUP"
if az group show --name "$RESOURCE_GROUP" &> /dev/null; then
    print_warning "Resource group $RESOURCE_GROUP already exists"
else
    az group create --name "$RESOURCE_GROUP" --location "$LOCATION"
    print_success "Resource group created"
fi

# Create Azure Static Web App
print_status "Creating Azure Static Web App: $SWA_NAME"
SWA_OUTPUT=$(az staticwebapp create \
    --name "$SWA_NAME" \
    --resource-group "$RESOURCE_GROUP" \
    --source "https://github.com/kd444/citysnap-app" \
    --branch "$BRANCH_NAME" \
    --app-location "/" \
    --output-location ".next" \
    --location "$LOCATION" \
    --output json)

# Extract deployment token
DEPLOYMENT_TOKEN=$(echo "$SWA_OUTPUT" | jq -r '.deploymentToken')
SWA_URL=$(echo "$SWA_OUTPUT" | jq -r '.defaultHostname')

print_success "Azure Static Web App created successfully!"
print_success "App URL: https://$SWA_URL"
print_success "Deployment Token: $DEPLOYMENT_TOKEN"

# Create storage account for additional resources (optional)
print_status "Creating storage account: $STORAGE_ACCOUNT_NAME"
az storage account create \
    --name "$STORAGE_ACCOUNT_NAME" \
    --resource-group "$RESOURCE_GROUP" \
    --location "$LOCATION" \
    --sku Standard_LRS \
    --kind StorageV2 \
    --access-tier Hot

print_success "Storage account created"

# Save resource information to file for cleanup script
RESOURCE_INFO_FILE="scripts/resource-info-${SAFE_BRANCH_NAME}.json"
cat > "$RESOURCE_INFO_FILE" << EOF
{
    "branch_name": "$BRANCH_NAME",
    "safe_branch_name": "$SAFE_BRANCH_NAME",
    "resource_group": "$RESOURCE_GROUP",
    "static_web_app_name": "$SWA_NAME",
    "static_web_app_url": "$SWA_URL",
    "deployment_token": "$DEPLOYMENT_TOKEN",
    "storage_account_name": "$STORAGE_ACCOUNT_NAME",
    "created_at": "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
}
EOF

print_success "Resource information saved to: $RESOURCE_INFO_FILE"

# Create GitHub secret (requires GitHub CLI)
if command -v gh &> /dev/null; then
    SECRET_NAME="CITYSNAP_SWA_TOKEN_$(echo "$BRANCH_NAME" | tr '[:lower:]' '[:upper:]')"
    print_status "Creating GitHub secret: $SECRET_NAME"
    
    if gh secret set "$SECRET_NAME" --body "$DEPLOYMENT_TOKEN" 2>/dev/null; then
        print_success "GitHub secret created: $SECRET_NAME"
    else
        print_warning "Failed to create GitHub secret. Please create it manually:"
        print_warning "Secret name: $SECRET_NAME"
        print_warning "Secret value: $DEPLOYMENT_TOKEN"
    fi
else
    print_warning "GitHub CLI not found. Please create GitHub secret manually:"
    print_warning "Secret name: CITYSNAP_SWA_TOKEN_$(echo "$BRANCH_NAME" | tr '[:lower:]' '[:upper:]')"
    print_warning "Secret value: $DEPLOYMENT_TOKEN"
fi

print_success "Branch resources created successfully!"
print_status "Next steps:"
print_status "1. Update your CI/CD workflow to use the new deployment token"
print_status "2. Push your code to trigger the deployment"
print_status "3. Access your app at: https://$SWA_URL"
Azure Static Web Apps