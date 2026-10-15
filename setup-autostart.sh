#!/bin/bash
set -e
cd "$(dirname "$0")"
export PATH="/usr/local/bin:/opt/homebrew/bin:$HOME/homebrew/bin:$PATH"
NODE_BIN="$(command -v node || true)"
if [ -z "$NODE_BIN" ]; then
  echo "Node.js is required to configure autostart."
  exit 1
fi
"$NODE_BIN" --input-type=module - "$PWD" <<'NODE'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
const root = process.argv[2]
const folder = path.join(os.homedir(), 'Library', 'LaunchAgents')
const file = path.join(folder, 'com.english-site.server.plist')
const xml = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;')
fs.mkdirSync(folder, { recursive: true })
fs.writeFileSync(file, `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0"><dict>
<key>Label</key><string>com.english-site.server</string>
<key>ProgramArguments</key><array>
<string>${xml(process.execPath)}</string><string>${xml(path.join(root, 'scripts', 'launch.mjs'))}</string><string>--no-open</string>
</array>
<key>WorkingDirectory</key><string>${xml(root)}</string>
<key>RunAtLoad</key><true/>
<key>KeepAlive</key><dict><key>SuccessfulExit</key><false/></dict>
<key>ThrottleInterval</key><integer>30</integer>
<key>StandardOutPath</key><string>${xml(path.join(root, 'server.log'))}</string>
<key>StandardErrorPath</key><string>${xml(path.join(root, 'server.error.log'))}</string>
</dict></plist>
`)
const domain = `gui/${process.getuid()}`
spawnSync('/bin/launchctl', ['bootout', domain, file], { stdio: 'ignore' })
const loaded = spawnSync('/bin/launchctl', ['bootstrap', domain, file], { stdio: 'inherit' })
if (loaded.error || loaded.status !== 0) process.exit(1)
console.log(`Autostart configured: ${file}`)
console.log('The complete study site will start at login, using the same launcher as the desktop shortcut.')
NODE
