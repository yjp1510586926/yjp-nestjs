#!/bin/bash

# Lambda 部署脚本 - 参考 yd-ai-bff

set -e  # 遇到错误立即退出

echo "🚀 开始 Lambda 部署..."

# 1. 构建
echo "🔨 步骤 1/2: 构建..."
./lambda-build.sh

# 2. 部署
echo "🚢 步骤 2/2: 部署到 AWS..."
sam deploy

echo ""
echo "✅ 部署完成！"
echo ""

# 获取 API 地址
STACK_NAME="yjp-nestjs-stack"
API_URL=$(aws cloudformation describe-stacks \
  --stack-name "$STACK_NAME" \
  --query 'Stacks[0].Outputs[?OutputKey==`ApiEndpoint`].OutputValue' \
  --output text 2>/dev/null || echo "")

if [ -n "$API_URL" ]; then
  echo "📋 API 地址: $API_URL"
  echo ""
  echo "🧪 测试:"
  echo "  curl $API_URL"
fi
