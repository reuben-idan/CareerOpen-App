"""
WSGI config for CareerOpen project.
This module contains the WSGI application used by Django's development server
and production WSGI servers.
"""

import os
import sys
from pathlib import Path
import logging

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

# Ensure the logs directory exists
logs_dir = os.path.join(Path(__file__).resolve().parent, 'logs')
try:
    os.makedirs(logs_dir, exist_ok=True)
    print(f"Created logs directory at: {logs_dir}")
except Exception as e:
    print(f"Warning: Could not create logs directory at {logs_dir}: {e}")
    # Fall back to a directory we know exists
    logs_dir = '/tmp/careeropen/logs'
    os.makedirs(logs_dir, exist_ok=True)
    print(f"Using fallback logs directory: {logs_dir}")

# This application object is used by any WSGI server configured to use this file.
from django.core.wsgi import get_wsgi_application

# Configure logging to ensure we capture any startup errors
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

try:
    application = get_wsgi_application()
    logger.info("WSGI application initialized successfully")
except Exception as e:
    logger.exception("Error initializing WSGI application")
    raise

# Debug information
print("=" * 50)
print("WSGI Configuration")
print("=" * 50)
print(f"Python Path: {sys.path}")
print(f"Current Working Directory: {os.getcwd()}")
print(f"DJANGO_SETTINGS_MODULE: {os.environ.get('DJANGO_SETTINGS_MODULE')}")
print("=" * 50)
