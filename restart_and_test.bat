@echo off
echo Stopping any running backend servers...
taskkill /F /IM python.exe /T >nul 2>&1

echo.
echo Starting backend server...
start "" /B /MIN cmd /c "cd /d %~dp0careeropen-backend && python manage.py runserver 0.0.0.0:8000 --noreload"

echo Waiting for server to start...
timeout /t 5 >nul

echo.
echo Testing health endpoint...
python test_health.py

echo.
echo If you see a 200 OK response above, the backend is working correctly.
echo You can now try logging in to the frontend.
echo.
pause
