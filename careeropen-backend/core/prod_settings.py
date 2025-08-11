"""
Production settings for CareerOpen backend.
These settings are used when DEPLOY_ENV=production
"""
import os
from .settings import *  # noqa

# Security settings
DEBUG = False
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_HSTS_SECONDS = 31536000  # 1 year
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

# Allowed hosts
ALLOWED_HOSTS = [
    'careeropen-api.onrender.com',
    'careeropen.com',
    'www.careeropen.com',
    'localhost',
    '127.0.0.1',
    '.onrender.com',  # Allow all render.com subdomains
]

# Extend ALLOWED_HOSTS from environment variable if set
import os
env_hosts = os.getenv('ALLOWED_HOSTS')
if env_hosts:
    ALLOWED_HOSTS.extend(host.strip() for host in env_hosts.split(','))

# Redis configuration for production
REDIS_URL = os.getenv('REDIS_URL', 'redis://redis:6379')
CACHES = {
    'default': {
        'BACKEND': 'django_redis.cache.RedisCache',
        'LOCATION': f'{REDIS_URL}/1',
        'OPTIONS': {
            'CLIENT_CLASS': 'django_redis.client.DefaultClient',
            'SOCKET_CONNECT_TIMEOUT': 5,  # seconds
            'SOCKET_TIMEOUT': 5,  # seconds
            'IGNORE_EXCEPTIONS': True,  # don't raise exceptions on Redis errors
            'PICKLE_VERSION': -1,  # use the latest protocol version
        },
        'KEY_PREFIX': 'careeropen',
    },
    'sessions': {
        'BACKEND': 'django_redis.cache.RedisCache',
        'LOCATION': f'{REDIS_URL}/2',
        'OPTIONS': {
            'CLIENT_CLASS': 'django_redis.client.DefaultClient',
            'SOCKET_CONNECT_TIMEOUT': 5,
            'SOCKET_TIMEOUT': 5,
            'IGNORE_EXCEPTIONS': True,
        },
        'KEY_PREFIX': 'careeropen_sessions',
    },
}

# Session configuration
SESSION_ENGINE = 'django.contrib.sessions.backends.cache'
SESSION_CACHE_ALIAS = 'sessions'

# Cache timeouts (in seconds)
CACHE_MIDDLEWARE_SECONDS = 60 * 15  # 15 minutes
CACHE_MIDDLEWARE_KEY_PREFIX = 'careeropen'
CACHE_MIDDLEWARE_ALIAS = 'default'

# Database
# Render will provide DATABASE_URL environment variable
import dj_database_url
DATABASES = {
    'default': dj_database_url.config(
        default=os.getenv('DATABASE_URL', 'postgresql://careeropen:password@localhost:5432/careeropen'),
        conn_max_age=600,
        conn_health_checks=True,
    )
}

# Static files (CSS, JavaScript, Images)
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
STATIC_URL = '/static/'

# Media files
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
MEDIA_URL = '/media/'

# Ensure the staticfiles directory exists
os.makedirs(STATIC_ROOT, exist_ok=True)
os.makedirs(MEDIA_ROOT, exist_ok=True)

# WhiteNoise configuration for static files
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

# Add WhiteNoise to middleware (should be after SecurityMiddleware and before other middleware)
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    # ... other middleware ...
]

# Email settings
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = os.getenv('EMAIL_HOST', 'smtp.sendgrid.net')
EMAIL_PORT = int(os.getenv('EMAIL_PORT', 587))
EMAIL_USE_TLS = True
EMAIL_HOST_USER = os.getenv('SENDGRID_USERNAME', '')
EMAIL_HOST_PASSWORD = os.getenv('SENDGRID_API_KEY', '')
DEFAULT_FROM_EMAIL = os.getenv('DEFAULT_FROM_EMAIL', 'noreply@careeropen.com')
SERVER_EMAIL = DEFAULT_FROM_EMAIL

# Logging
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
    },
    'handlers': {
        'console': {
            'level': 'WARNING',  # Changed from INFO to WARNING to reduce verbosity
            'class': 'logging.StreamHandler',
            'formatter': 'simple',
        },
        'mail_admins': {
            'level': 'ERROR',
            'class': 'django.utils.log.AdminEmailHandler',
            'include_html': True,
        },
    },
    'loggers': {
        'django': {
            'handlers': ['console', 'mail_admins'],
            'level': 'WARNING',  # Changed from INFO to WARNING to reduce verbosity
            'propagate': False,  # Changed to False to prevent duplicate logs
        },
        'jobs': {
            'handlers': ['console'],
            'level': 'WARNING',  # Changed from INFO to WARNING to reduce verbosity
            'propagate': False,  # Changed to False to prevent duplicate logs
        },
        'accounts': {
            'handlers': ['console'],
            'level': 'WARNING',  # Changed from INFO to WARNING to reduce verbosity
            'propagate': False,  # Changed to False to prevent duplicate logs
        },
        # Add a root logger to capture everything else at WARNING level
        '': {
            'handlers': ['console'],
            'level': 'WARNING',
        },
    },
}

# CORS settings
CORS_ALLOWED_ORIGINS = [
    'https://careeropen.com',
    'https://www.careeropen.com',
    'https://careeropen-api.onrender.com',
    'http://localhost:3000',  # For local development
    'http://127.0.0.1:3000'   # For local development
]

# CSRF trusted origins
CSRF_TRUSTED_ORIGINS = [
    'https://careeropen.com',
    'https://www.careeropen.com',
    'https://careeropen-api.onrender.com',
    'http://localhost:3000',  # For local development
    'http://127.0.0.1:3000'   # For local development
]

# Security headers
SECURE_CONTENT_TYPE_NOSNIFF = True
SECURE_BROWSER_XSS_FILTER = True
X_FRAME_OPTIONS = 'DENY'

# Cache control
CACHE_CONTROL_MAX_AGE = 60 * 60 * 24 * 7  # 1 week

# Redis monitoring settings
REDIS_MONITORING = {
    'ENABLED': True,
    'STATS_KEY_PREFIX': 'careeropen:stats',
    'STATS_INTERVAL': 60,  # seconds
    'ALERT_THRESHOLDS': {
        'memory_usage_percent': 80,  # Alert if Redis memory usage exceeds 80%
        'hit_rate': 0.9,  # Alert if cache hit rate falls below 90%
    },
}
