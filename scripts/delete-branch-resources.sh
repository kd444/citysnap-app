#!/bin/bash

# Azure Resource Cleanup Script for Branch-based Environments
# This script deletes Azure resources when branches are deleted
# Usage: ./scripts/delete-branch-resources.sh <branch-name>

set -e

# Configuration
BRANCH_NAME="${1}"
RESOURCE_INFO_FILE="scripts/resource-info-${BRANCH_NAME}.json"

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

# Check if branch name is provided
if [ -z "$BRANCH_NAME" ]; then
    print_error "Branch name is required. Usage: $0 <branch-name>"
    exit 1
fi

# Check if resource info file exists
if [ ! -f "$RESOURCE_INFO_FILE" ]; then
    print_error "Resource info file not found: $RESOURCE_INFO_FILE"
    print_error "Cannot cleanup resources without resource information."
    exit 1
fi

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

# Load resource information
print_status "Loading resource information from: $RESOURCE_INFO_FILE"
RESOURCE_GROUP=$(jq -r '.resource_group' "$RESOURCE_INFO_FILE")
SWA_NAME=$(jq -r '.static_web_app_name' "$RESOURCE_INFO_FILE")
STORAGE_ACCOUNT_NAME=$(jq -r '.storage_account_name' "$RESOURCE_INFO_FILE")
CREATED_AT=$(jq -r '.created_at' "$RESOURCE_INFO_FILE")

print_status "Cleaning up resources for branch: $BRANCH_NAME"
print_status "Resource Group: $RESOURCE_GROUP"
print_status "Static Web App: $SWA_NAME"
print_status "Storage Account: $STORAGE_ACCOUNT_NAME"
print_status "Created at: $CREATED_AT"

# Confirmation prompt
echo -e "${YELLOW}This will permanently delete the following resources:${NC}"
echo "  - Static Web App: $SWA_NAME"
echo "  - Storage Account: $STORAGE_ACCOUNT_NAME"
echo "  - All associated data and configurations"
echo ""
read -p "Are you sure you want to continue? (yes/no): " -r
if [[ ! $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
    print_warning "Cleanup cancelled by user"
    exit 0
fi

# Delete Static Web App
print_status "Deleting Static Web App: $SWA_NAME"
if az staticwebapp show --name "$SWA_NAME" --resource-group "$RESOURCE_GROUP" &> /dev/null; then
    az staticwebapp delete --name "$SWA_NAME" --resource-group "$RESOURCE_GROUP" --yes
    print_success "Static Web App deleted: $SWA_NAME"
else
    print_warning "Static Web App not found: $SWA_NAME"
fi

# Delete Storage Account
print_status "Deleting Storage Account: $STORAGE_ACCOUNT_NAME"
if az storage account show --name "$STORAGE_ACCOUNT_NAME" --resource-group "$RESOURCE_GROUP" &> /dev/null; then
    az storage account delete --name "$STORAGE_ACCOUNT_NAME" --resource-group "$RESOURCE_GROUP" --yes
    print_success "Storage Account deleted: $STORAGE_ACCOUNT_NAME"
else
    print_warning "Storage Account not found: $STORAGE_ACCOUNT_NAME"
fi

# Delete GitHub secret (requires GitHub CLI)
if command -v gh &> /dev/null; then
    SECRET_NAME="CITYSNAP_SWA_TOKEN_$(echo "$BRANCH_NAME" | tr '[:lower:]' '[:upper:]')"
    print_status "Deleting GitHub secret: $SECRET_NAME"
    
    if gh secret delete "$SECRET_NAME" --confirm 2>/dev/null; then
        print_success "GitHub secret deleted: $SECRET_NAME"
    else
        print_warning "Failed to delete GitHub secret or secret doesn't exist: $SECRET_NAME"
    fi
else
    print_warning "GitHub CLI not found. Please delete GitHub secret manually:"
    print_warning "Secret name: CITYSNAP_SWA_TOKEN_$(echo "$BRANCH_NAME" | tr '[:lower:]' '[:upper:]')"
fi

# Remove resource info file
print_status "Removing resource info file: $RESOURCE_INFO_FILE"
rm -f "$RESOURCE_INFO_FILE"
print_success "Resource info file removed"

# Check if resource group is empty and delete if so
print_status "Checking if resource group is empty..."
RESOURCES_IN_RG=$(az resource list --resource-group "$RESOURCE_GROUP" --query "length(@)" --output tsv)

if [ "$RESOURCES_IN_RG" -eq 0 ]; then
    print_status "Resource group is empty. Deleting resource group: $RESOURCE_GROUP"
    az group delete --name "$RESOURCE_GROUP" --yes --no-wait
    print_success "Resource group deletion initiated: $RESOURCE_GROUP"
else
    print_warning "Resource group still contains $RESOURCES_IN_RG resources. Keeping resource group."
fi

print_success "Branch resources cleanup completed successfully!"
print_status "Cost savings achieved by removing unused resources."
