@echo off
echo Starting Django backend server in debug mode...
cd /d %~dp0careeropen-backend
python manage.py runserver 0.0.0.0:8000 --noreload --verbosity 2
pause
