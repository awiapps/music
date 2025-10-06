#!/bin/bash

# Script to clone an Expo repository and integrate it with Tauri for desktop (macOS, Linux, Windows)

if [ $# -ne 1 ]; then
  echo "Usage: $0 <repo-url>"
  exit 1
fi

REPO_URL="$1"
PROJECT_DIR=$(basename "$REPO_URL" .git)

# Create project directory and clone the repo
mkdir -p "$PROJECT_DIR"
cd "$PROJECT_DIR"
git clone "$REPO_URL" .
cd ..

# Move into the cloned directory
cd "$PROJECT_DIR"

# Install dependencies
npm install

# Install Tauri CLI
npm install --save-dev @tauri-apps/cli@latest

# Add Tauri script to package.json
node -e "
const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
pkg.scripts = pkg.scripts || {};
pkg.scripts.tauri = 'tauri';
fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
"

# Get app name from package.json
APP_NAME=$(node -p "require('./package.json').name.replace(/[^a-z0-9]/gi, '-').toLowerCase() || 'expo-app'")

# Prepare answers for tauri init (non-interactive via pipe)
# App name, Window title, Web assets location (Expo web-build), Dev server URL, Dev command, Build command
ANSWERS=$(printf "%s\n%s\n../web-build\nhttp://localhost:19006\nexpo start --web\nexpo build:web\n")

# Run tauri init with piped answers
echo "$ANSWERS" | npx tauri init

# Install Tauri API (optional, for invoking Rust commands from JS)
npm install @tauri-apps/api@latest

echo "Setup complete!"
echo "To run in development: npm run tauri dev"
echo "To build for desktop (macOS/Linux/Windows): npm run tauri build"
echo ""
echo "Note: Ensure Rust is installed[](https://rustup.rs/) and your OS has the required build tools."
echo "For Expo web support, run 'npx expo install react-native-web react-dom' if not already present."
echo "The build targets the current OS; for cross-compilation, see Tauri docs."
