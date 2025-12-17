#!/bin/bash

# Lambda 构建和部署脚本 - 优化版，参考 yd-ai-bff

set -e  # 遇到错误立即退出

echo "🚀 开始构建 Lambda 部署包..."

# 清理旧的构建文件
echo "🧹 清理旧构建文件..."
rm -rf dist/
rm -rf .aws-sam/
rm -rf layer/

# 创建必要的目录
mkdir -p dist/
mkdir -p layer/nodejs

# 使用 NestJS 构建应用
echo "🏗️ 构建 NestJS 应用..."
npm run build

# 复制 views 目录（如果存在）
if [ -d "src/views" ]; then
  echo "📋 复制 views 目录到 dist..."
  cp -r src/views dist/views
fi

# 构建前端资源（如果存在）
if [ -d "client" ]; then
  echo "🎨 构建前端资源..."
  npm run build:client
fi

# === 新策略：将 Prisma 放到 dist 而不是 layer ===
echo "📦 准备 Prisma Client到 dist..."
# 在 dist 中创建 node_modules
mkdir -p dist/node_modules/@prisma
mkdir -p dist/node_modules/.prisma

# 复制所有 @prisma 相关模块（一次性解决依赖问题）
if [ -d "node_modules/@prisma" ]; then
  echo "复制所有 @prisma 模块..."
  cp -r node_modules/@prisma/* dist/node_modules/@prisma/
fi

# 复制生成的 Prisma Client
if [ -d "node_modules/.prisma/client" ]; then
  cp -r node_modules/.prisma/client dist/node_modules/.prisma/
fi

# 为 dist 中安装 bcrypt 和 pg (ARM64架构)
echo "🔐 为 Lambda ARM64 安装 bcrypt, pg, adapter-pg..."
mkdir -p /tmp/deps-install
cd /tmp/deps-install
yarn init -y > /dev/null 2>&1
# 同时安装 bcrypt, pg, prisma adapter 以及验证相关的库
yarn add bcrypt pg @prisma/adapter-pg class-validator class-transformer reflect-metadata --ignore-engines 2>&1 | grep -v "warning" || true

# 复制安装好的包到 dist
if [ -d "node_modules" ]; then
  echo "📦 复制 yarn 安装的依赖到 dist..."
  cp -r node_modules/* "$OLDPWD/dist/node_modules/"
fi

cd "$OLDPWD"
rm -rf /tmp/deps-install

# 准备 Layer（不包含 Prisma）
echo "📦 准备 Lambda Layer..."

# 创建一个最小化的 package.json
cat > layer/nodejs/package.json << EOF
{
  "name": "yjp-nestjs-layer",
  "dependencies": {
    "@nestjs/common": "^10.0.0",
    "@nestjs/config": "^3.1.1",
    "@nestjs/core": "^10.0.0",
    "@nestjs/jwt": "^10.2.0",
    "@nestjs/passport": "^10.0.3",
    "@nestjs/platform-express": "^10.0.0",
    "@nestjs/serve-static": "^4.0.0",
    "@vendia/serverless-express": "^4.12.6",
    "axios": "^1.6.2",
    "class-transformer": "^0.5.1",
    "class-validator": "^0.14.0",
    "ejs": "^3.1.9",
    "express": "^4.18.0",
    "passport": "^0.7.0",
    "passport-jwt": "^4.0.1",
    "passport-local": "^1.0.0",
    "redis": "^4.6.11",
    "reflect-metadata": "^0.1.13",
    "rxjs": "^7.8.1"
  }
}
EOF

# 在 layer 中安装最小依赖
cd layer/nodejs
echo "📥 安装 Layer 最小依赖..."
yarn install --production --ignore-scripts --ignore-engines

# 删除不需要的包
echo "🧹 清理 Layer..."
rm -rf node_modules/aws-sdk
rm -rf node_modules/typescript
rm -rf node_modules/@types

echo "📊 Layer 大小:"
du -sh node_modules/
cd ../../

echo "📊 Dist 大小:"
du -sh dist/

# 执行 SAM 构建
echo "🚀 运行 SAM 构建..."
sam build --skip-pull-image

if [ $? -eq 0 ]; then
    echo "✅ 构建成功！"
    echo ""
    echo "📊 最终大小检查:"
    du -sh .aws-sam/build/NodeModulesLayer || true
    du -sh .aws-sam/build/NestJSFunction || true
    echo ""
    echo "下一步:"
    echo "  运行: sam deploy"
else
    echo "❌ SAM 构建失败!"
    exit 1
fi
