"""
WSGI config for CareerOpen project.
This module contains the WSGI application used by Django's development server
and production WSGI servers.
"""

import os
import sys
from pathlib import Path

# Add the project directory to the Python path
project_root = Path(__file__).resolve().parent

# Add the project directory to Python path
if str(project_root) not in sys.path:
    print(f"Adding to path: {project_root}")
    sys.path.insert(0, str(project_root))

# Set environment variables for production on Render
if os.getenv('RENDER', '').lower() == 'true':
    os.environ.setdefault('DEPLOY_ENV', 'production')
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.prod_settings')
    print("Running on Render with production settings")
else:
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
    if not os.getenv('DEPLOY_ENV'):
        os.environ.setdefault('DEPLOY_ENV', 'development')

# This application object is used by any WSGI server configured to use this file.
from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()

# Debug information
print("=" * 50)
print("WSGI Configuration")
print("=" * 50)
print(f"Python Path: {sys.path}")
print(f"Current Working Directory: {os.getcwd()}")
print(f"DJANGO_SETTINGS_MODULE: {os.environ.get('DJANGO_SETTINGS_MODULE')}")
print("=" * 50)
