#!/bin/bash

# 构建脚本 - 参考 yd-ai-bff

set -e  # 遇到错误立即退出

echo "🔨 开始构建..."

# 1. 编译 TypeScript
echo "📦 编译 TypeScript..."
npm run build

# 2. 复制 lambda.js 到 dist 根目录（重要！）
echo "🔧 复制 lambda.js 到 dist 根目录..."
cp dist/src/lambda.js dist/lambda.js
cp dist/src/lambda.js.map dist/lambda.js.map 2>/dev/null || true

# 3. 复制 views 目录（如果存在）
if [ -d "src/views" ]; then
  echo "📋 复制 views 目录到 dist..."
  cp -r src/views dist/views
fi

# 4. 复制 client/dist 到 dist/views/client（如果存在）
if [ -d "client/dist" ]; then
  echo "🎨 复制前端资源到 dist/views..."
  mkdir -p dist/views/client
  cp -r client/dist dist/views/client
fi

# 5. 复制 package.json 到 layer 层
echo "📦 复制 package.json 到 layer 层..."
mkdir -p layer/nodejs
cp package.json layer/nodejs/

echo "✅ 构建完成！"
