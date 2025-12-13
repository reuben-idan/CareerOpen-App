@echo off
echo 🚀 Starting clean installation process...

echo 🧹 Removing node_modules and lock files...
rmdir /s /q node_modules
del /f /q package-lock.json
del /f /q yarn.lock
del /f /q pnpm-lock.yaml

echo 🧼 Clearing npm cache...
npm cache clean --force

echo 📦 Installing dependencies...
npm install

if %ERRORLEVEL% NEQ 0 (
    echo ❌ Error installing dependencies. Please check the error message above.
    exit /b %ERRORLEVEL%
)

echo 🔨 Building the project...
npm run build

if %ERRORLEVEL% EQU 0 (
    echo ✅ Clean installation completed successfully!
    echo You can now run 'npm run dev' to start the development server.
) else (
    echo ❌ Build failed. Please check the error message above.
    exit /b %ERRORLEVEL%
)
