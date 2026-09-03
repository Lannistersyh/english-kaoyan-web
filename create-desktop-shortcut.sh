#!/bin/bash
echo "🖥️ 创建桌面快捷方式..."

# 创建 Automator 应用
cat > ~/Desktop/英语学习网站.command << AUTOMATOR
#!/bin/bash
cd /Users/Admin/english-kaoyan-mac
echo "🚀 启动英语学习网站..."
echo "📌 网站地址：http://localhost:5173/"
echo "💡 按 Ctrl+C 可以停止服务"
echo ""
./start-all.sh
AUTOMATOR

# 使脚本可执行
chmod +x ~/Desktop/英语学习网站.command

echo "✅ 桌面快捷方式已创建！"
echo "📌 双击桌面上的 '英语学习网站' 图标即可启动"
echo "🔧 首次运行可能需要右键点击 → 打开"
