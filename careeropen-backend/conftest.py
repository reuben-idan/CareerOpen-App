"""
Pytest configuration for the CareerOpen project.
"""
import os
import sys
from pathlib import Path

# Add the project root to the Python path
project_root = str(Path(__file__).parent)
if project_root not in sys.path:
    sys.path.insert(0, project_root)

# Set the Django settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.test_settings')

# Initialize Django
import django
django.setup()

def pytest_configure():
    """Configure pytest with Django settings."""
    from django.conf import settings
    
    # Configure test settings
    settings.DEBUG = False
    settings.TEMPLATE_DEBUG = False
    
    # Use in-memory SQLite database for faster tests
    settings.DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': ':memory:',
        }
    }
    
    # Disable password hashing for faster tests
    settings.PASSWORD_HASHERS = [
        'django.contrib.auth.hashers.MD5PasswordHasher',
    ]
    
    # Disable logging during testing
    import logging
    logging.disable(logging.CRITICAL)
