"""
WSGI config for CareerOpen project.

This module contains the WSGI application used by Django's development server
and production WSGI servers. It exposes a module-level variable named ``application``.
"""

import os
import sys
from pathlib import Path

# Add debug output
print("=" * 50)
print("Starting WSGI Application")
print("=" * 50)
print(f"Python Path: {sys.path}")
print(f"Current Working Directory: {os.getcwd()}")

# Add the project directory to the Python path
project_root = Path(__file__).resolve().parent

# Add the project root to Python path
if str(project_root) not in sys.path:
    print(f"Adding to path: {project_root}")
    sys.path.insert(0, str(project_root))

# Set the Django settings module with production as default
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
os.environ.setdefault('DEPLOY_ENV', 'production')  # Force production environment

print(f"DJANGO_SETTINGS_MODULE: {os.environ.get('DJANGO_SETTINGS_MODULE')}")
print(f"DEPLOY_ENV: {os.environ.get('DEPLOY_ENV')}")

# This application object is used by any WSGI server configured to use this file.
print("Importing Django WSGI application...")
try:
    from django.core.wsgi import get_wsgi_application
    
    # Ensure settings are properly loaded
    from django.conf import settings
    print(f"Using settings: {settings.SETTINGS_MODULE}")
    print(f"DEBUG: {settings.DEBUG}")
    print(f"ALLOWED_HOSTS: {getattr(settings, 'ALLOWED_HOSTS', [])}")
    
    application = get_wsgi_application()
    print("WSGI application loaded successfully!")
except Exception as e:
    print(f"Error loading WSGI application: {str(e)}")
    raise
