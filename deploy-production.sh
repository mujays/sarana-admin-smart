#!/bin/bash
set -e

# ==================================================
# AWS SSO CONFIG
# ==================================================
export AWS_PROFILE="mujib"

# ==================================================
# Colors
# ==================================================
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# ==================================================
# PRODUCTION CONFIG
# ==================================================
AWS_REGION="ap-southeast-1"
AWS_ACCOUNT_ID="481534398414"
ECR_REPOSITORY="fe-admin-smart"
ECR_REGISTRY="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"

# ==================================================
# IMAGE TAGS
# ==================================================
VERSION=${1:-$(date +%Y%m%d-%H%M%S)}
IMAGE_NAME="${ECR_REGISTRY}/${ECR_REPOSITORY}:prod-${VERSION}"
IMAGE_LATEST="${ECR_REGISTRY}/${ECR_REPOSITORY}:production-latest"

echo -e "${GREEN}=== PRODUCTION DEPLOYMENT (AWS SSO + MULTI-ARCH) ===${NC}"
echo "AWS Profile        : ${AWS_PROFILE}"
echo "AWS Region         : ${AWS_REGION}"
echo "AWS Account ID     : ${AWS_ACCOUNT_ID}"
echo "ECR Repository     : ${ECR_REPOSITORY}"
echo "Version            : prod-${VERSION}"
echo ""

# ==================================================
# CONFIRM PRODUCTION
# ==================================================
echo -e "${RED}⚠️  WARNING: DEPLOYING TO PRODUCTION ⚠️${NC}"
read -p "Type 'yes' to continue: " CONFIRM
echo
if [[ "$CONFIRM" != "yes" ]]; then
  echo "Deployment cancelled."
  exit 1
fi

# ==================================================
# ENV
# ==================================================
echo -e "${YELLOW}Loading environment variables from .env.production...${NC}"
if [[ ! -f .env.production ]]; then
  echo -e "${RED}Error: .env.production file not found${NC}"
  exit 1
fi

# Load environment variables from .env.production
export $(grep -v '^#' .env.production | xargs)

# ==================================================
# STEP 0: SSO LOGIN CHECK
# ==================================================
echo -e "${YELLOW}[0/3] Checking AWS SSO session...${NC}"
aws sts get-caller-identity >/dev/null 2>&1 || {
  echo "SSO session expired. Logging in..."
  aws sso login --profile ${AWS_PROFILE}
}

# ==================================================
# STEP 1: ENSURE ECR REPOSITORY
# ==================================================
echo -e "${YELLOW}[1/3] Checking ECR repository...${NC}"
if aws ecr describe-repositories \
  --repository-names "${ECR_REPOSITORY}" \
  --region ${AWS_REGION} >/dev/null 2>&1; then
  echo "ECR repository exists."
else
  echo "Creating ECR repository..."
  aws ecr create-repository \
    --repository-name "${ECR_REPOSITORY}" \
    --region ${AWS_REGION} >/dev/null
  echo "ECR repository created."
fi

# ==================================================
# STEP 2: ECR LOGIN
# ==================================================
echo -e "${YELLOW}[2/3] Logging in to Amazon ECR...${NC}"
aws ecr get-login-password \
  --region ${AWS_REGION} \
| docker login \
  --username AWS \
  --password-stdin ${ECR_REGISTRY}

# ==================================================
# STEP 3: BUILD & PUSH (MULTI-ARCH)
# ==================================================
echo -e "${YELLOW}[3/3] Building & pushing Docker image (amd64 + arm64)...${NC}"

# Ensure buildx
docker buildx inspect multi-builder >/dev/null 2>&1 || \
docker buildx create --name multi-builder --use

docker buildx build \
  --platform linux/amd64,linux/arm64 \
  --build-arg NEXT_PUBLIC_API_SOURCE="${NEXT_PUBLIC_API_SOURCE}" \
  --build-arg NEXT_PUBLIC_API_SOURCE_FINANCE="${NEXT_PUBLIC_API_SOURCE_FINANCE}" \
  --build-arg NEXT_PUBLIC_API_SOURCE_PERPUS="${NEXT_PUBLIC_API_SOURCE_PERPUS}" \
  --build-arg NEXT_PUBLIC_API_SOURCE_AKADEMIK="${NEXT_PUBLIC_API_SOURCE_AKADEMIK}" \
  --build-arg NEXT_PUBLIC_URL_PORTAL="${NEXT_PUBLIC_URL_PORTAL}" \
  --build-arg NEXT_PUBLIC_RECAPTCHA_SITE_KEY="${NEXT_PUBLIC_RECAPTCHA_SITE_KEY}" \
  --build-arg RECAPTCHA_SECRET_KEY="${RECAPTCHA_SECRET_KEY}" \
  -t ${IMAGE_NAME} \
  -t ${IMAGE_LATEST} \
  --push .

echo ""
echo -e "${GREEN}✅ DEPLOY SUCCESS${NC}"
echo "Images pushed:"
echo " - ${IMAGE_NAME}"
echo " - ${IMAGE_LATEST}"
