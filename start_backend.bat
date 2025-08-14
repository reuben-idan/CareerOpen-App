@echo off
set PYTHONPATH=.
set DJANGO_SETTINGS_MODULE=core.settings
set DEPLOY_ENV=development
set DEBUG=True
set ALLOWED_HOSTS=localhost,127.0.0.1

echo Starting Django development server...
cd careeropen-backend
python manage.py runserver
