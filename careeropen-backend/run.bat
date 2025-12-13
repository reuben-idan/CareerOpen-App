@echo off
setlocal

:: Set environment variables
set SECRET_KEY=test-secret-key-for-development-only
set DEBUG=True
set ALLOWED_HOSTS=localhost,127.0.0.1
set CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000

:: Run the specified command or start the development server
if "%1"=="" (
    echo Starting Django development server...
    echo.
    echo You can test the API endpoints at:
    echo http://localhost:8000/api/categories/
    echo http://localhost:8000/api/jobs/
    echo http://localhost:8000/api/companies/
    echo.
    python manage.py runserver
) else (
    python manage.py %*
)

endlocal
