from pathlib import Path
import os

# Import base settings
from core.settings import *

# Override settings for testing
DEBUG = True
SECRET_KEY = 'test-secret-key-for-testing-only'

# Use in-memory cache for testing
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
        'LOCATION': 'unique-snowflake',
    },
    'sessions': {
        'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
        'LOCATION': 'unique-snowflake-sessions',
    }
}

# Disable password validation for testing
AUTH_PASSWORD_VALIDATORS = []

# Use SQLite in-memory database for testing
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': ':memory:',
    }
}

# Disable CORS for testing
CORS_ALLOW_ALL_ORIGINS = True
