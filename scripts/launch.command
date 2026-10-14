#!/bin/bash
set -e
cd "$(dirname "$0")/.."
export PATH="/usr/local/bin:/opt/homebrew/bin:$HOME/homebrew/bin:$PATH"
NODE_BIN="$(command -v node || true)"
if [ -z "$NODE_BIN" ]; then
  echo "Node.js was not found. Install Node.js, then open this launcher again."
  read -r -p "Press Enter to close."
  exit 1
fi
exec "$NODE_BIN" scripts/launch.mjs "$@"
