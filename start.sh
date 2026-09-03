#!/bin/bash
echo "启动后端服务器..."
node server.js &
SERVER_PID=$!
echo "后端服务器已启动 (PID: $SERVER_PID)"
echo "启动前端开发服务器..."
npm run dev
echo "前端服务器已启动"
echo "按 Ctrl+C 停止所有服务器"
wait $SERVER_PID
