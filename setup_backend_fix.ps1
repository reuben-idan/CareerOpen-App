# Script to fix and set up the CareerOpen backend

# Navigate to backend directory
$backendDir = Join-Path $PSScriptRoot "careeropen-backend"
Set-Location $backendDir

# Create a Python virtual environment if it doesn't exist
$venvPath = Join-Path $PSScriptRoot "venv"
if (-not (Test-Path $venvPath)) {
    Write-Host "Creating Python virtual environment..." -ForegroundColor Cyan
    python -m venv $venvPath
}

# Activate the virtual environment
$activateScript = Join-Path $venvPath "Scripts\Activate.ps1"
if (Test-Path $activateScript) {
    Write-Host "Activating virtual environment..." -ForegroundColor Cyan
    . $activateScript
} else {
    Write-Host "Failed to find virtual environment activation script" -ForegroundColor Red
    exit 1
}

# Upgrade pip
Write-Host "Upgrading pip..." -ForegroundColor Cyan
python -m pip install --upgrade pip

# Install Python dependencies
Write-Host "Installing Python dependencies..." -ForegroundColor Cyan
pip install -r requirements.txt

# Create .env file if it doesn't exist
$envFile = Join-Path $backendDir ".env"
if (-not (Test-Path $envFile)) {
    @"
# Django settings
SECRET_KEY=django-insecure-test-key-1234567890
DEBUG=True
ALLOWED_HOSTS=127.0.0.1,localhost

# Database (using SQLite for development)
DB_ENGINE=sqlite
DB_NAME=db.sqlite3
DB_USER=
DB_PASSWORD=
DB_HOST=
DB_PORT=

# CORS
CORS_ALLOW_ALL_ORIGINS=True
"@ | Out-File -FilePath $envFile -Encoding utf8
    Write-Host "Created .env file for development" -ForegroundColor Green
} else {
    Write-Host ".env file already exists, skipping creation" -ForegroundColor Yellow
}

# Run database migrations
Write-Host "Running database migrations..." -ForegroundColor Cyan
python manage.py migrate

# Create superuser if one doesn't exist
$superuserCheck = python -c "import os; os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings'); import django; django.setup(); from django.contrib.auth import get_user_model; print(get_user_model().objects.filter(is_superuser=True).exists())"

if ($superuserCheck -eq "False") {
    Write-Host "Creating superuser..." -ForegroundColor Cyan
    $env:DJANGO_SUPERUSER_USERNAME = "admin"
    $env:DJANGO_SUPERUSER_EMAIL = "admin@example.com"
    $env:DJANGO_SUPERUSER_PASSWORD = "admin123"
    python manage.py createsuperuser --noinput
    Write-Host "Superuser created with username: admin and email: admin@example.com" -ForegroundColor Green
} else {
    Write-Host "Superuser already exists, skipping creation" -ForegroundColor Yellow
}

# Start the development server
Write-Host "Starting Django development server..." -ForegroundColor Cyan
Write-Host "Server will be available at http://127.0.0.1:8000/" -ForegroundColor Green
Write-Host "Admin interface: http://127.0.0.1:8000/admin/" -ForegroundColor Green
Write-Host "API documentation: http://127.0.0.1:8000/api/docs/" -ForegroundColor Green
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
python manage.py runserver
