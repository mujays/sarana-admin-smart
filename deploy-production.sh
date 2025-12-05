#!/bin/bash

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Resolve script dir and repo root (works even if script is placed in /public)
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR" && git rev-parse --show-toplevel 2>/dev/null || echo "$SCRIPT_DIR")"
cd "$REPO_ROOT"

# Configuration for PRODUCTION
AWS_REGION="ap-southeast-1"
AWS_ACCOUNT_ID="481534398414"
ECR_REPOSITORY="fe-admin-smart"
APP_RUNNER_SERVICE="fe-admin-smart-production"  # Different service for production
ECR_REGISTRY="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"

# Load environment variables from .env.production if available
ENV_FILE=".env.production"

if [ ! -f "$ENV_FILE" ] && [ -f "public/.env.production" ]; then
    ENV_FILE="public/.env.production"
fi

if [ -f "$ENV_FILE" ]; then
    set -o allexport
    # shellcheck source=/dev/null
    source "$ENV_FILE"
    set +o allexport
else
    echo -e "${RED}Environment file not found (.env.production or public/.env.production).${NC}"
    exit 1
fi

: "${NEXT_PUBLIC_API_SOURCE:?NEXT_PUBLIC_API_SOURCE is required}"
: "${NEXT_PUBLIC_API_SOURCE_FINANCE:?NEXT_PUBLIC_API_SOURCE_FINANCE is required}"
: "${NEXT_PUBLIC_URL_PORTAL:?NEXT_PUBLIC_URL_PORTAL is required}"

BUILD_ARGS=(
    --build-arg NEXT_PUBLIC_API_SOURCE="${NEXT_PUBLIC_API_SOURCE}"
    --build-arg NEXT_PUBLIC_API_SOURCE_FINANCE="${NEXT_PUBLIC_API_SOURCE_FINANCE}"
    --build-arg NEXT_PUBLIC_URL_PORTAL="${NEXT_PUBLIC_URL_PORTAL}"
)

if [ -n "${NEXT_PUBLIC_API_SOURCE_PERPUS}" ]; then
    BUILD_ARGS+=(--build-arg NEXT_PUBLIC_API_SOURCE_PERPUS="${NEXT_PUBLIC_API_SOURCE_PERPUS}")
fi

if [ -n "${NEXT_PUBLIC_API_MOCKING}" ]; then
    BUILD_ARGS+=(--build-arg NEXT_PUBLIC_API_MOCKING="${NEXT_PUBLIC_API_MOCKING}")
fi

# Get version tag (default to timestamp)
VERSION=${1:-$(date +%Y%m%d-%H%M%S)}
IMAGE_NAME="${ECR_REGISTRY}/${ECR_REPOSITORY}:prod-${VERSION}"
IMAGE_LATEST="${ECR_REGISTRY}/${ECR_REPOSITORY}:production-latest"

echo -e "${GREEN}=== PRODUCTION Deployment Script ===${NC}"
echo "Environment: PRODUCTION"
echo "AWS Region: ${AWS_REGION}"
echo "ECR Repository: ${ECR_REPOSITORY}"
echo "App Runner Service: ${APP_RUNNER_SERVICE}"
echo "Version: prod-${VERSION}"
echo ""

# Confirmation prompt for production
echo -e "${RED}⚠️  WARNING: You are about to deploy to PRODUCTION!${NC}"
read -p "Are you sure you want to continue? (yes/no) " -r
echo
if [[ ! $REPLY =~ ^[Yy](es)?$ ]]; then
    echo "Deployment cancelled."
    exit 1
fi

# Step 1: Build Docker image
echo -e "${YELLOW}[1/4] Building Docker image for PRODUCTION...${NC}"
docker build "${BUILD_ARGS[@]}" -t ${ECR_REPOSITORY}:prod-${VERSION} .
docker tag ${ECR_REPOSITORY}:prod-${VERSION} ${ECR_REPOSITORY}:production-latest

# Step 2: Ensure ECR repository exists, then login
echo -e "${YELLOW}[2/4] Ensuring ECR repository exists...${NC}"
if aws ecr describe-repositories --repository-names "${ECR_REPOSITORY}" --region ${AWS_REGION} >/dev/null 2>&1; then
    echo "Repository ${ECR_REPOSITORY} already exists."
else
    echo "Repository ${ECR_REPOSITORY} not found. Creating..."
    aws ecr create-repository --repository-name "${ECR_REPOSITORY}" --region ${AWS_REGION} >/dev/null
    echo "Repository created."
fi

# Step 3: Login to ECR
echo -e "${YELLOW}[3/4] Logging in to Amazon ECR...${NC}"
aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${ECR_REGISTRY}

# Step 4: Tag and push to ECR
echo -e "${YELLOW}[4/4] Pushing image to ECR...${NC}"
docker tag ${ECR_REPOSITORY}:prod-${VERSION} ${IMAGE_NAME}
docker tag ${ECR_REPOSITORY}:prod-${VERSION} ${IMAGE_LATEST}

docker push ${IMAGE_NAME}
docker push ${IMAGE_LATEST}

echo -e "${GREEN}✓ Image pushed successfully!${NC}"
echo "  - ${IMAGE_NAME}"
echo "  - ${IMAGE_LATEST}"
