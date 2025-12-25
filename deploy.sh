#!/bin/bash

# Lambda 部署脚本 - 使用现有VPC配置

set -e  # 遇到错误立即退出

# 颜色输出
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 开始 Lambda 部署...${NC}"
echo ""

# # 询问数据库URL
# echo -e "${BLUE}数据库配置:${NC}"
# read -p "请输入数据库URL (留空使用默认): " DATABASE_URL
# echo ""

# # 显示部署配置
# echo -e "${YELLOW}部署配置:${NC}"
# echo "Stack Name: yjp-nestjs-stack"
# echo "Region: us-west-2"
# echo "VPC架构: 1个公有子网 + 3个私有子网"
# echo "Security Group: sg-0f80dcde1e5a3dbbc (ec2-rds-1)"
# echo ""
# echo "公有子网 (直接访问外网):"
# echo "  - subnet-0e5c8131a811adc95 (us-west-2a, 172.31.32.0/20)"
# echo ""
# echo "私有子网 (Lambda部署,通过NAT访问外网):"
# echo "  - subnet-0782da7395e112a97 (us-west-2a, 172.31.64.0/20)"
# echo "  - subnet-03da04142d46ba4f6 (us-west-2b, 172.31.80.0/20)"
# echo "  - subnet-081e618ba9e6219bd (us-west-2c, 172.31.96.0/20)"
# echo ""
# echo "Database URL: ${DATABASE_URL:-<使用默认>}"
# echo ""

# 1. 构建
echo -e "${GREEN}🔨 步骤 1/2: 构建...${NC}"
./lambda-build.sh

# 2. 部署
echo -e "${GREEN}🚢 步骤 2/2: 部署到 AWS...${NC}"

# 准备参数
PARAMS="EnableVPC=true"
PARAMS="$PARAMS PrivateSubnet1Id=subnet-07c8fd31488a05381"
PARAMS="$PARAMS PrivateSubnet2Id=subnet-08dd59db3b7dc1aee"
PARAMS="$PARAMS PrivateSubnet3Id=subnet-0673ce7d1d2e18113"
if [ -n "$DATABASE_URL" ]; then
    PARAMS="$PARAMS DatabaseUrl=$DATABASE_URL"
fi

sam deploy \
    --stack-name yjp-nestjs-stack \
    --parameter-overrides $PARAMS \
    --capabilities CAPABILITY_IAM \
    --resolve-s3

echo ""
echo -e "${GREEN}✅ 部署完成！${NC}"
echo ""

# 获取 API 地址
STACK_NAME="yjp-nestjs-stack"
API_URL=$(aws cloudformation describe-stacks \
  --stack-name "$STACK_NAME" \
  --query 'Stacks[0].Outputs[?OutputKey==`ApiEndpoint`].OutputValue' \
  --output text 2>/dev/null || echo "")

if [ -n "$API_URL" ]; then
  echo -e "${YELLOW}📋 API 地址: $API_URL${NC}"
  echo ""
  echo -e "${BLUE}🧪 测试:${NC}"
  echo "  curl $API_URL"
  echo ""
fi

# 显示所有输出
echo -e "${YELLOW}=== 部署输出信息 ===${NC}"
aws cloudformation describe-stacks \
    --stack-name $STACK_NAME \
    --query 'Stacks[0].Outputs[*].[OutputKey,OutputValue,Description]' \
    --output table 2>/dev/null || true

echo ""
echo -e "${GREEN}=== 下一步操作 ===${NC}"
echo "1. 访问API端点测试应用"
echo "2. 检查CloudWatch日志"
echo "3. 验证VPC网络连接"
echo ""

