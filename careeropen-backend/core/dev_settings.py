"""
Development settings for CareerOpen backend.
Supports both SQLite (default) and PostgreSQL for database.
Uses fakeredis for caching in local development.
"""
import os
import sys
from pathlib import Path
from dotenv import load_dotenv

# Import all settings from base settings first
from .settings import *

# Load environment variables from .env file
load_dotenv()

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent.parent

# Security settings - override base settings
DEBUG = True
ALLOWED_HOSTS = ['localhost', '127.0.0.1']

# Ensure ROOT_URLCONF is set
ROOT_URLCONF = 'core.urls'

# Database configuration
# Use PostgreSQL if DB_ENGINE is set to postgres, otherwise fall back to SQLite
if os.getenv('DB_ENGINE') == 'django.db.backends.postgresql':
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': os.getenv('DB_NAME', 'careeropen'),
            'USER': os.getenv('DB_USER', 'postgres'),
            'PASSWORD': os.getenv('DB_PASSWORD', ''),
            'HOST': os.getenv('DB_HOST', 'localhost'),
            'PORT': os.getenv('DB_PORT', '5432'),
        }
    }
else:
    # Fall back to SQLite
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'db.sqlite3'),
        }
    }

# Use fakeredis for development caching
CACHES = {
    'default': {
        'BACKEND': 'django_redis.cache.RedisCache',
        'LOCATION': 'redis://127.0.0.1:6379/1',
        'OPTIONS': {
            'CLIENT_CLASS': 'django_redis.client.DefaultClient',
            'SOCKET_CONNECT_TIMEOUT': 5,  # seconds
            'SOCKET_TIMEOUT': 5,  # seconds
            'IGNORE_EXCEPTIONS': True,
        },
        'KEY_PREFIX': 'careeropen_dev',
    },
    'sessions': {
        'BACKEND': 'django_redis.cache.RedisCache',
        'LOCATION': 'redis://127.0.0.1:6379/2',
        'OPTIONS': {
            'CLIENT_CLASS': 'django_redis.client.DefaultClient',
        },
        'KEY_PREFIX': 'careeropen_sessions_dev',
    },
}

# Use fakeredis for development
import fakeredis
import django_redis.pool

# Configure Redis connection
REDIS_URL = os.getenv('REDIS_URL', 'redis://localhost:6379/0')
CACHE_REDIS_DB = os.getenv('CACHE_REDIS_DB', '1')
SESSION_REDIS_DB = os.getenv('SESSION_REDIS_DB', '2')

# Patch the connection pool to use fakeredis in development
if os.getenv('USE_FAKEREDIS', 'True').lower() == 'true':
    class FakeConnectionFactory(django_redis.pool.ConnectionFactory):
        def get_connection(self, params):
            return fakeredis.FakeRedis(encoding='utf-8', decode_responses=True)
    
    django_redis.pool.ConnectionFactory = FakeConnectionFactory
    CACHES['default']['OPTIONS']['SERIALIZER'] = 'django_redis.serializers.json.JSONSerializer'

# Ensure logs directory exists with full path resolution
LOGS_DIR = os.path.abspath(os.path.join(BASE_DIR, 'logs'))
try:
    os.makedirs(LOGS_DIR, exist_ok=True)
    # Test if directory is writable
    test_log = os.path.join(LOGS_DIR, 'test_permissions.log')
    with open(test_log, 'w') as f:
        f.write('Test log entry')
    os.remove(test_log)
    print(f"Successfully wrote to logs directory: {LOGS_DIR}")
except Exception as e:
    print(f"Error creating or writing to logs directory {LOGS_DIR}: {str(e)}")
    # Fallback to a directory we know we can write to
    import tempfile
    LOGS_DIR = os.path.join(tempfile.gettempdir(), 'careeropen_logs')
    os.makedirs(LOGS_DIR, exist_ok=True)
    print(f"Using fallback logs directory: {LOGS_DIR}")

# Enable debug logging for development
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '{levelname} {asctime} {module} {process:d} {thread:d} {message}',
            'style': '{',
        },
        'simple': {
            'format': '{levelname} {message}',
            'style': '{',
        },
        'django.server': {
            '()': 'django.utils.log.ServerFormatter',
            'format': '[{server_time}] {message}',
            'style': '{',
        },
    },
    'filters': {
        'require_debug_true': {
            '()': 'django.utils.log.RequireDebugTrue',
        },
        'require_debug_false': {
            '()': 'django.utils.log.RequireDebugFalse',
        },
    },
    'handlers': {
        'console': {
            'level': 'DEBUG',
            'class': 'logging.StreamHandler',
            'formatter': 'verbose',
            'stream': sys.stdout,
        },
        'file': {
            'level': 'DEBUG',
            'class': 'logging.handlers.RotatingFileHandler',
            'filename': os.path.join(LOGS_DIR, 'django_debug.log'),
            'maxBytes': 1024 * 1024 * 5,  # 5 MB
            'backupCount': 5,
            'formatter': 'verbose',
        },
        'error_file': {
            'level': 'ERROR',
            'class': 'logging.handlers.RotatingFileHandler',
            'filename': os.path.join(LOGS_DIR, 'django_error.log'),
            'maxBytes': 1024 * 1024 * 5,  # 5 MB
            'backupCount': 5,
            'formatter': 'verbose',
        },
        'django.server': {
            'level': 'DEBUG',
            'class': 'logging.StreamHandler',
            'formatter': 'django.server',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['console', 'file'],
            'level': 'INFO',
            'propagate': True,
        },
        'django.server': {
            'handlers': ['django.server', 'console', 'file'],
            'level': 'DEBUG',
            'propagate': False,
        },
        'django.request': {
            'handlers': ['console', 'file', 'error_file'],
            'level': 'DEBUG',
            'propagate': False,
        },
        'django.db.backends': {
            'handlers': ['console', 'file'],
            'level': 'INFO',  # Set to DEBUG to see all database queries
            'propagate': False,
        },
        'accounts': {
            'handlers': ['console', 'file', 'error_file'],
            'level': 'DEBUG',
            'propagate': True,
        },
        'core': {
            'handlers': ['console', 'file', 'error_file'],
            'level': 'DEBUG',
            'propagate': True,
        },
        '': {  # Root logger
            'handlers': ['console', 'file'],
            'level': 'DEBUG',
            'propagate': True,
        },
    },
    'root': {
        'handlers': ['console', 'file'],
        'level': 'DEBUG',
    },
}
