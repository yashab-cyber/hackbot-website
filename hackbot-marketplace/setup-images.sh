#!/bin/bash
# Copy images from the original website into the Next.js public folder
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
SRC="$SCRIPT_DIR/../website/images"
DEST="$SCRIPT_DIR/public/images"

mkdir -p "$DEST/screenshots"

cp "$SRC/logo.png" "$DEST/logo.png"
cp "$SRC/screenshots/hackbot-cli-view.png" "$DEST/screenshots/hackbot-cli-view.png"
cp "$SRC/screenshots/hackbot-gui-view.png" "$DEST/screenshots/hackbot-gui-view.png"
cp "$SRC/screenshots/hackbot-settings.png" "$DEST/screenshots/hackbot-settings.png"

echo "✅ Images copied to public/images/"
