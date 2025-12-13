# Setup script for CareerOpen backend

# Navigate to backend directory
$backendDir = Join-Path $PSScriptRoot "careeropen-backend"
Set-Location $backendDir

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

# Install Python dependencies
Write-Host "Installing Python dependencies..." -ForegroundColor Cyan
pip install -r requirements.txt

# Run database migrations
Write-Host "Running database migrations..." -ForegroundColor Cyan
python manage.py migrate

# Create superuser if one doesn't exist
$superuserCheck = python -c "import os; os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings'); import django; django.setup(); from django.contrib.auth import get_user_model; print(get_user_model().objects.filter(is_superuser=True).exists())"

if ($superuserCheck -eq "False") {
    Write-Host "Creating superuser..." -ForegroundColor Cyan
    python manage.py createsuperuser --noinput --username admin --email admin@example.com
    Write-Host "Superuser created with username: admin and email: admin@example.com" -ForegroundColor Green
    Write-Host "You can set a password later with: python manage.py changepassword admin" -ForegroundColor Yellow
} else {
    Write-Host "Superuser already exists, skipping creation" -ForegroundColor Yellow
}

# Start the development server
Write-Host "Starting Django development server..." -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
python manage.py runserver
