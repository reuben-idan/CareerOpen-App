"""Pytest configuration for the CareerOpen project."""
import os
import sys
import django
from pathlib import Path

# Add the project root to the Python path
PROJECT_ROOT = Path(__file__).parent.parent
sys.path.insert(0, str(PROJECT_ROOT))

# Set the Django settings module
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "careeropen-backend.core.settings")

def pytest_configure():
    """Configure Django settings for pytest."""
    # Import Django settings
    django.setup()
    
    # Configure test settings
    from django.conf import settings
    
    # Configure test database
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': ':memory:',
        }
    }
    
    # Update settings for tests
    settings.DATABASES = DATABASES
    settings.PASSWORD_HASHERS = [
        'django.contrib.auth.hashers.MD5PasswordHasher',
    ]
    settings.EMAIL_BACKEND = 'django.core.mail.backends.locmem.EmailBackend'
    settings.DEBUG = False
    
    # Disable logging during tests
    import logging
    logging.disable(logging.CRITICAL)

def pytest_unconfigure():
    """Clean up after tests."""
    pass
