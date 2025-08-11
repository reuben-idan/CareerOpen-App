"""
Production WSGI entry point for CareerOpen.
This file ensures the correct Python path is set up before loading the WSGI application.
"""

import os
import sys
from pathlib import Path

# Add the project directory to the Python path
project_root = Path(__file__).resolve().parent
backend_dir = project_root / 'careeropen-backend'

# Add the project root and backend directory to Python path
for path in [str(project_root), str(backend_dir)]:
    if path not in sys.path:
        print(f"Adding to path: {path}")
        sys.path.insert(0, path)

# Set the Django settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

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
