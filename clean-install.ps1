Write-Host "Cleaning up project..." -ForegroundColor Cyan

# Remove node_modules if it exists
if (Test-Path "node_modules") {
    Write-Host "Removing node_modules..."
    Remove-Item -Recurse -Force node_modules
}

# Remove package-lock.json if it exists
if (Test-Path "package-lock.json") {
    Write-Host "Removing package-lock.json..."
    Remove-Item -Force package-lock.json
}

# Remove dist directory if it exists
if (Test-Path "dist") {
    Write-Host "Removing dist directory..."
    Remove-Item -Recurse -Force dist
}

# Remove .vite directory if it exists
if (Test-Path ".vite") {
    Write-Host "Removing .vite directory..."
    Remove-Item -Recurse -Force .vite
}

Write-Host "`nInstalling dependencies..." -ForegroundColor Cyan
npm install

Write-Host "`nCleaning complete. You can now try building the project again." -ForegroundColor Green
