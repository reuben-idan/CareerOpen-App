"""Test script to verify Django environment and settings."""
import os
import sys
import django

# Add the current directory to the Python path
sys.path.insert(0, os.path.abspath('.'))

# Set the DJANGO_SETTINGS_MODULE environment variable
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'careeropen.settings')

# Setup Django
try:
    django.setup()
    print("Django setup completed successfully!")
    
    # Test basic Django functionality
    from django.conf import settings
    print(f"Django settings module: {settings.SETTINGS_MODULE}")
    print(f"Installed apps: {settings.INSTALLED_APPS}")
    
    # Test database connection
    from django.db import connection
    connection.ensure_connection()
    print("Database connection successful!")
    
    # Test authentication model
    from django.contrib.auth import get_user_model
    User = get_user_model()
    print(f"User model: {User.__name__}")
    
except Exception as e:
    print(f"Error setting up Django: {e}")
    import traceback
    traceback.print_exc()
