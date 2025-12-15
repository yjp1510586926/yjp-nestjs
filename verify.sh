#!/bin/bash

# 验证 SSR 和静态资源是否正常工作

echo "🔍 验证 NestJS + React SSR 项目..."
echo ""

# 检查服务器是否运行
echo "1️⃣ 检查服务器状态..."
if curl -s http://localhost:3000/health > /dev/null; then
    echo "✅ 服务器正在运行"
else
    echo "❌ 服务器未运行，请先运行: pnpm run start:dev"
    exit 1
fi
echo ""

# 检查静态资源
echo "2️⃣ 检查静态资源..."
CSS_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/static/home.css)
JS_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/static/home.js)

if [ "$CSS_STATUS" = "200" ]; then
    echo "✅ CSS 文件加载正常 (home.css)"
else
    echo "❌ CSS 文件加载失败 (状态码: $CSS_STATUS)"
fi

if [ "$JS_STATUS" = "200" ]; then
    echo "✅ JS 文件加载正常 (home.js)"
else
    echo "❌ JS 文件加载失败 (状态码: $JS_STATUS)"
fi
echo ""

# 检查 SSR
echo "3️⃣ 检查服务端渲染..."
HTML_CONTENT=$(curl -s http://localhost:3000)

if echo "$HTML_CONTENT" | grep -q '<div id="root">.*NestJS 多页应用'; then
    echo "✅ SSR 正常工作（HTML 包含渲染内容）"
else
    echo "⚠️  SSR 可能有问题（HTML 不包含预期内容）"
fi
echo ""

# 检查文件大小
echo "4️⃣ 检查构建产物..."
if [ -f "dist/client/home.css" ]; then
    CSS_SIZE=$(du -h dist/client/home.css | cut -f1)
    echo "✅ CSS 文件存在 ($CSS_SIZE)"
else
    echo "❌ CSS 文件不存在"
fi

if [ -f "dist/client/home.js" ]; then
    JS_SIZE=$(du -h dist/client/home.js | cut -f1)
    echo "✅ JS 文件存在 ($JS_SIZE)"
else
    echo "❌ JS 文件不存在"
fi
echo ""

# 总结
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 验证完成！"
echo ""
echo "🌐 访问应用: http://localhost:3000"
echo "📚 API 文档: http://localhost:3000/api/docs"
echo "💚 健康检查: http://localhost:3000/health"
echo ""
echo "📖 查看文档:"
echo "  - docs/SSR_IMPLEMENTATION.md - SSR 实现详解"
echo "  - docs/FINAL_FIX.md - 问题解决报告"
echo "  - docs/QUICK_START.md - 快速开始指南"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
