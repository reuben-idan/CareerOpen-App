#!/bin/bash
# Script to clean and reinstall project dependencies

echo "🚀 Starting clean installation process..."

# Remove node_modules and lock files
echo "🧹 Removing node_modules and lock files..."
rm -rf node_modules
rm -f package-lock.json
rm -f yarn.lock
rm -f pnpm-lock.yaml

# Clear npm cache
echo "🧼 Clearing npm cache..."
npm cache clean --force

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the project
echo "🔨 Building the project..."
npm run build

echo "✅ Clean installation completed successfully!"
echo "You can now run 'npm run dev' to start the development server."
