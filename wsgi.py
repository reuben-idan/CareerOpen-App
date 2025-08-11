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

# Set the Django settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
print(f"DJANGO_SETTINGS_MODULE: {os.environ.get('DJANGO_SETTINGS_MODULE')}")

# This application object is used by any WSGI server configured to use this file.
print("Importing Django WSGI application...")
try:
    from django.core.wsgi import get_wsgi_application
    application = get_wsgi_application()
    print("WSGI application loaded successfully!")
except Exception as e:
    print(f"Error loading WSGI application: {str(e)}")
    raise

# For debugging in production
if os.environ.get('DEBUG', '').lower() == 'true':
    print(f"Python path: {sys.path}")
    print(f"Current working directory: {os.getcwd()}")
    print(f"DJANGO_SETTINGS_MODULE: {os.environ.get('DJANGO_SETTINGS_MODULE')}")
