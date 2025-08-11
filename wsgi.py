"""
WSGI config for CareerOpen project.

This module contains the WSGI application used by Django's development server.
It exposes a module-level variable named ``application``. For more information
on this file, see:
https://docs.djangoproject.com/en/5.2/howto/deployment/wsgi/
"""

import os
import sys

# Add the project directory to the Python path
project_root = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, project_root)

# Add the backend directory to the Python path
backend_path = os.path.join(project_root, 'careeropen-backend')
if backend_path not in sys.path:
    sys.path.insert(0, backend_path)

# Set the environment variables
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

# This application object is used by any WSGI server configured to use this file.
from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()
