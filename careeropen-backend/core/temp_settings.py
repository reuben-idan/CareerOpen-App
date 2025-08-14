from core.settings import *
import os

# Override database settings for development with SQLite
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
    }
}

# Use console email backend for development
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'

# Disable HTTPS for development
SECURE_SSL_REDIRECT = False
SESSION_COOKIE_SECURE = False
CSRF_COOKIE_SECURE = False

# Allow all hosts for development
ALLOWED_HOSTS = ['*']

# Enable CORS for development
CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOW_CREDENTIALS = True

# Enable debug mode
DEBUG = True

# Set the default settings module to use these settings
os.environ['DJANGO_SETTINGS_MODULE'] = 'core.temp_settings'
