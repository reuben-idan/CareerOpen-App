Write-Host "Starting fresh build process..." -ForegroundColor Cyan

# Remove existing build artifacts
Write-Host "`nRemoving build artifacts..."
Remove-Item -Recurse -Force -ErrorAction SilentlyContinue node_modules, dist, .vite
Remove-Item -Force -ErrorAction SilentlyContinue package-lock.json

# Clear npm cache
Write-Host "`nClearing npm cache..."
npm cache clean --force

# Install dependencies
Write-Host "`nInstalling dependencies..."
npm install

# Build the project
Write-Host "`nBuilding the project..."
npm run build

Write-Host "`nFresh build process completed!" -ForegroundColor Green
