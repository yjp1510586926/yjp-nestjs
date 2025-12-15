#!/bin/bash

# NestJS MPA 项目快速启动脚本

echo "🚀 NestJS + React MPA 项目初始化"
echo "================================"
echo ""

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 错误: 未找到 Node.js，请先安装 Node.js >= 18.x"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ 错误: Node.js 版本过低，需要 >= 18.x，当前版本: $(node -v)"
    exit 1
fi

echo "✅ Node.js 版本: $(node -v)"

# 检查包管理器
if command -v pnpm &> /dev/null; then
    PKG_MANAGER="pnpm"
    echo "✅ 使用包管理器: pnpm"
elif command -v yarn &> /dev/null; then
    PKG_MANAGER="yarn"
    echo "✅ 使用包管理器: yarn"
else
    PKG_MANAGER="npm"
    echo "✅ 使用包管理器: npm"
fi

echo ""
echo "📦 步骤 1/4: 安装依赖..."
$PKG_MANAGER install

if [ $? -ne 0 ]; then
    echo "❌ 依赖安装失败"
    exit 1
fi

echo ""
echo "⚙️  步骤 2/4: 配置环境变量..."
if [ ! -f .env ]; then
    cp .env.example .env
    echo "✅ 已创建 .env 文件（从 .env.example 复制）"
    echo "⚠️  请编辑 .env 文件，配置必要的环境变量"
else
    echo "✅ .env 文件已存在"
fi

echo ""
echo "🎨 步骤 3/4: 构建前端资源..."
$PKG_MANAGER run build:client:dev

if [ $? -ne 0 ]; then
    echo "❌ 前端构建失败"
    exit 1
fi

echo ""
echo "🏗️  步骤 4/4: 构建后端..."
$PKG_MANAGER run build

if [ $? -ne 0 ]; then
    echo "❌ 后端构建失败"
    exit 1
fi

echo ""
echo "================================"
echo "✅ 项目初始化完成！"
echo ""
echo "📝 下一步操作："
echo ""
echo "1. 编辑 .env 文件配置环境变量（如果需要）"
echo ""
echo "2. 启动开发服务器："
echo "   终端 1: $PKG_MANAGER run watch:client   # 监听前端变化"
echo "   终端 2: $PKG_MANAGER run start:dev      # 启动后端服务"
echo ""
echo "3. 访问应用："
echo "   应用首页: http://localhost:3000"
echo "   API 文档: http://localhost:3000/api/docs"
echo ""
echo "📚 查看文档："
echo "   - docs/PROJECT_OVERVIEW.md - 项目概览"
echo "   - docs/QUICK_START.md - 快速开始指南"
echo "   - docs/MPA_ARCHITECTURE.md - 架构文档"
echo ""
echo "🎉 祝您开发愉快！"
