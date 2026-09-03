#!/bin/bash
echo "🚀 启动英语学习网站所有服务..."
echo ""

# 启动后端服务器
echo "1. 启动后端服务器 (端口 3003)..."
node server.js &
SERVER_PID=$!
echo "   后端服务器已启动 (PID: $SERVER_PID)"
echo ""

# 等待2秒让后端服务器启动
sleep 2

# 启动前端开发服务器
echo "2. 启动前端开发服务器 (端口 5173)..."
npm run dev &
CLIENT_PID=$!
echo "   前端服务器已启动 (PID: $CLIENT_PID)"
echo ""

echo "✅ 所有服务已启动！"
echo ""
echo "📌 服务地址："
echo "   - 前端网站：http://localhost:5173/"
echo "   - 后端API：http://localhost:3003/api/deepseek-score"
echo ""
echo "💡 使用说明："
echo "   - 在浏览器中访问 http://localhost:5173/ 使用网站"
echo "   - 按 Ctrl+C 停止所有服务"
echo ""

# 等待任意一个进程结束
wait $SERVER_PID $CLIENT_PID
