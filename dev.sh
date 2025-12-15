#!/bin/bash

# 开发模式启动脚本 - 自动监听前端和后端变化

echo "🚀 启动开发环境..."
echo ""

# 检查是否有进程在运行
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  端口 3000 已被占用"
    echo "请先停止现有的服务器，或者运行: lsof -ti:3000 | xargs kill"
    exit 1
fi

# 启动前端 watch 模式（后台）
echo "📦 启动前端 watch 模式..."
pnpm run watch:client > /dev/null 2>&1 &
WEBPACK_PID=$!
echo "✅ 前端 watch 已启动 (PID: $WEBPACK_PID)"

# 等待 webpack 首次编译完成
sleep 3

# 启动后端开发服务器
echo "🔧 启动后端开发服务器..."
echo ""
pnpm run start:dev

# 清理：当脚本退出时，停止 webpack watch
trap "kill $WEBPACK_PID 2>/dev/null" EXIT
