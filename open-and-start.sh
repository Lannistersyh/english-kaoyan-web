#!/bin/bash
echo "🌐 启动英语学习网站并打开浏览器..."

# 启动服务器
echo "1. 启动后端服务器..."
node server.js &
SERVER_PID=$!
echo "   后端服务器已启动 (PID: $SERVER_PID)"

# 等待服务器启动
echo "2. 等待服务器启动..."
sleep 3

# 打开浏览器
echo "3. 打开浏览器..."
open http://localhost:5173/

# 启动前端开发服务器
echo "4. 启动前端服务器..."
npm run dev &
CLIENT_PID=$!
echo "   前端服务器已启动 (PID: $CLIENT_PID)"

echo ""
echo "✅ 英语学习网站已启动！"
echo "📌 网站地址：http://localhost:5173/"
echo "💡 使用完毕后按 Ctrl+C 停止服务"
echo ""

# 等待任意一个进程结束
wait $SERVER_PID $CLIENT_PID
