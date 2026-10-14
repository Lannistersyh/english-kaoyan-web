#!/bin/bash
set -e
ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
LAUNCHER="$HOME/Desktop/English Study.command"
printf '#!/bin/bash\nexec /bin/bash %q "$@"\n' "$ROOT_DIR/scripts/launch.command" > "$LAUNCHER"
chmod +x "$LAUNCHER"
echo "Launcher created: $LAUNCHER"
