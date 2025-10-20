# Azure Resource Management Scripts

This directory contains scripts to automatically create and delete Azure resources based on branch activity to optimize costs.

## Scripts Overview

### 1. `create-branch-resources.sh`

Creates Azure resources when a new branch is created.

**Usage:**

```bash
./scripts/create-branch-resources.sh <branch-name>
```

**What it creates:**

-   Azure Static Web App for the branch
-   Storage Account (optional)
-   GitHub secret with deployment token
-   Resource information file for cleanup

### 2. `delete-branch-resources.sh`

Deletes Azure resources when a branch is deleted.

**Usage:**

```bash
./scripts/delete-branch-resources.sh <branch-name>
```

**What it deletes:**

-   Azure Static Web App
-   Storage Account
-   GitHub secret
-   Resource information file
-   Empty resource groups

## Prerequisites

1. **Azure CLI** installed and configured

    ```bash
    az login
    az account set --subscription "your-subscription-id"
    ```

2. **GitHub CLI** (optional, for automatic secret management)

    ```bash
    gh auth login
    ```

3. **jq** for JSON processing

    ```bash
    # macOS
    brew install jq

    # Ubuntu/Debian
    sudo apt-get install jq
    ```

## Configuration

Before running the scripts, update these variables in `create-branch-resources.sh`:

```bash
RESOURCE_GROUP="citysnap-rg"        # Your Azure resource group
LOCATION="eastus"                   # Azure region
SUBSCRIPTION_ID="${AZURE_SUBSCRIPTION_ID}"  # Your Azure subscription
```

And update the GitHub repository URL:

```bash
--source "https://github.com/YOUR_USERNAME/YOUR_REPO"
```

## Cost Optimization Benefits

-   **Automatic cleanup**: Resources are deleted when branches are removed
-   **Pay-per-use**: Only pay for resources while branches are active
-   **No manual intervention**: Scripts handle the entire lifecycle
-   **Resource tracking**: JSON files track all created resources

## Example Workflow

1. **Create a feature branch:**

    ```bash
    git checkout -b feature/new-feature
    ./scripts/create-branch-resources.sh feature/new-feature
    ```

2. **Develop and deploy:**

    - Push code to trigger CI/CD
    - Resources are automatically deployed

3. **Clean up when done:**
    ```bash
    git checkout main
    git branch -D feature/new-feature
    ./scripts/delete-branch-resources.sh feature/new-feature
    ```

## Integration with CI/CD

The scripts work seamlessly with your existing CI/CD workflow:

1. **Create resources** before development
2. **CI/CD deploys** using the generated tokens
3. **Delete resources** when branch is removed

## Safety Features

-   **Confirmation prompts** before deletion
-   **Resource validation** before operations
-   **Error handling** with colored output
-   **Resource tracking** via JSON files
-   **Dry-run capability** (can be added)

## Monitoring

Track your cost savings by monitoring:

-   Azure Cost Management dashboard
-   Resource group activity logs
-   GitHub Actions workflow runs

## Troubleshooting

### Common Issues:

1. **"Not logged in to Azure"**

    ```bash
    az login
    ```

2. **"Resource group not found"**

    - Check subscription ID
    - Verify resource group name

3. **"GitHub secret creation failed"**
    - Install GitHub CLI: `gh auth login`
    - Or create secrets manually in GitHub UI

### Logs and Debugging:

Scripts provide colored output:

-   🔵 **Blue**: Information
-   🟢 **Green**: Success
-   🟡 **Yellow**: Warnings
-   🔴 **Red**: Errors

## Security Notes

-   Deployment tokens are automatically managed
-   Resources are scoped to specific branches
-   No hardcoded credentials in scripts
-   GitHub secrets are automatically cleaned up
