#!/bin/bash
echo "🚀 设置开机自启动..."

# 创建 Launch Agent 目录
mkdir -p ~/Library/LaunchAgents

# 创建 plist 文件
cat > ~/Library/LaunchAgents/com.english-site.server.plist << PLIST
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.english-site.server</string>
    <key>ProgramArguments</key>
    <array>
        <string>/usr/local/bin/node</string>
        <string>/Users/Admin/english-kaoyan-mac/server.js</string>
    </array>
    <key>WorkingDirectory</key>
    <string>/Users/Admin/english-kaoyan-mac</string>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <true/>
    <key>StandardOutPath</key>
    <string>/Users/Admin/english-kaoyan-mac/server.log</string>
    <key>StandardErrorPath</key>
    <string>/Users/Admin/english-kaoyan-mac/server.error.log</string>
</dict>
</plist>
PLIST

# 加载服务
launchctl load ~/Library/LaunchAgents/com.english-site.server.plist

echo "✅ 开机自启动已设置！"
echo "📌 服务将在每次开机时自动启动"
echo "🔧 如需停止服务：launchctl unload ~/Library/LaunchAgents/com.english-site.server.plist"
