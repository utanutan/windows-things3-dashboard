#!/bin/bash
# Windows Things3 Dashboard - Development Server Startup Script

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

cd "$PROJECT_DIR"

echo "=== Windows Things3 Dashboard ==="
echo "Project: $PROJECT_DIR"
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "⚠️  .env.local not found, copying from .env.example..."
    cp .env.example .env.local
    echo "📝 Please edit .env.local with your Mac's Tailscale IP"
fi

# Check if node_modules exists
if [ ! -d node_modules ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Display current configuration
echo "📋 Current Configuration:"
grep -E "^(API_BASE_URL|NEXT_PUBLIC_MOCK_MODE)" .env.local 2>/dev/null || echo "  (using defaults)"
echo ""

# Start development server
echo "🚀 Starting development server..."
echo "   Local:   http://localhost:3000"
echo "   Network: http://$(hostname -I | awk '{print $1}'):3000"
echo ""

exec npm run dev
