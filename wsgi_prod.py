"""
Production WSGI entry point for CareerOpen.
This file ensures the correct Python path is set up before loading the WSGI application.
"""

import os
import sys
from pathlib import Path

# Add debug output
print("=" * 50)
print("Starting Production WSGI Application")
print("=" * 50)
print(f"Initial Python Path: {sys.path}")
print(f"Current Working Directory: {os.getcwd()}")

# Add the project directory to the Python path
project_root = Path(__file__).resolve().parent
backend_dir = project_root / 'careeropen-backend'

# Add the project root and backend directory to Python path
for path in [str(project_root), str(backend_dir)]:
    if path not in sys.path:
        print(f"Adding to path: {path}")
        sys.path.insert(0, path)

# Force production environment
os.environ['DEPLOY_ENV'] = 'production'
os.environ['DJANGO_SETTINGS_MODULE'] = 'core.settings'

print(f"Using DJANGO_SETTINGS_MODULE: {os.environ.get('DJANGO_SETTINGS_MODULE')}")
print(f"Using DEPLOY_ENV: {os.environ.get('DEPLOY_ENV')}")

# Import Django after setting environment variables
import django
django.setup()

# This application object is used by any WSGI server configured to use this file.
from django.core.wsgi import get_wsgi_application

# Get the application
application = get_wsgi_application()

# Debug information
print("=" * 50)
print("WSGI Application Loaded")
print("=" * 50)
print(f"Final Python Path: {sys.path}")
print(f"Current Working Directory: {os.getcwd()}")
print(f"DJANGO_SETTINGS_MODULE: {os.environ.get('DJANGO_SETTINGS_MODULE')}")
print(f"DEPLOY_ENV: {os.environ.get('DEPLOY_ENV')}")

# Verify settings
from django.conf import settings
print(f"DEBUG: {settings.DEBUG}")
print(f"ALLOWED_HOSTS: {getattr(settings, 'ALLOWED_HOSTS', [])}")
print("=" * 50)
