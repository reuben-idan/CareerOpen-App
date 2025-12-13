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
SECURE_REFERRER_POLICY = 'same-origin'
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
X_FRAME_OPTIONS = 'DENY'

# Increase security for production
CSRF_COOKIE_HTTPONLY = True
SESSION_COOKIE_HTTPONLY = True
SESSION_COOKIE_AGE = 1209600  # 2 weeks in seconds
SESSION_SAVE_EVERY_REQUEST = True

# Allowed hosts
ALLOWED_HOSTS = [
    'careeropen-api.onrender.com',
    'careeropen.com',
    'www.careeropen.com',
    'localhost',
    '127.0.0.1',
    '.onrender.com',  # Allow all render.com subdomains
]

# For Render.com specific settings
RENDER = os.getenv('RENDER', 'false').lower() == 'true'
if RENDER:
    # Ensure we're using the correct host
    RENDER_EXTERNAL_HOSTNAME = os.environ.get('RENDER_EXTERNAL_HOSTNAME')
    if RENDER_EXTERNAL_HOSTNAME and RENDER_EXTERNAL_HOSTNAME not in ALLOWED_HOSTS:
        ALLOWED_HOSTS.append(RENDER_EXTERNAL_HOSTNAME)

# Extend ALLOWED_HOSTS from environment variable if set
env_hosts = os.getenv('ALLOWED_HOSTS')
if env_hosts:
    for host in env_hosts.split(','):
        host = host.strip()
        if host and host not in ALLOWED_HOSTS:
            ALLOWED_HOSTS.append(host)

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

# Database configuration
# Use dj_database_url to parse the DATABASE_URL environment variable
import dj_database_url

def get_database_config():
    db_config = dj_database_url.config(
        default=os.getenv('DATABASE_URL', 'postgresql://careeropen:password@localhost:5432/careeropen'),
        conn_max_age=600,
        conn_health_checks=True,
    )
    
    # Add SSL requirement for production
    if 'OPTIONS' not in db_config:
        db_config['OPTIONS'] = {}
    
    # For Render's managed PostgreSQL
    if os.getenv('RENDER', '').lower() == 'true':
        db_config['OPTIONS'].update({
            'sslmode': 'require',
            'connect_timeout': 10,
            'keepalives': 1,
            'keepalives_idle': 30,
            'keepalives_interval': 10,
            'keepalives_count': 5,
        })
    
    return db_config

DATABASES = {
    'default': get_database_config()
}

# Template configuration
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, 'templates')],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

# Application definition with all required Django built-in apps and our custom apps
INSTALLED_APPS = [
    # Django defaults
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    
    # Third-party apps
    'rest_framework',
    'rest_framework_simplejwt',
    'corsheaders',
    'drf_spectacular',
    'drf_spectacular_sidecar',  # Required for production static files
    'django_prometheus',
    'django_redis',
    'django_filters',
    'storages',
    'whitenoise.runserver_nostatic',
    
    # Local apps
    'accounts.apps.AccountsConfig',
    'jobs.apps.JobsConfig',
    'network.apps.NetworkConfig',
    'core.apps.CoreConfig',
]

# Connection pooling for production
DATABASE_POOL_ARGS = {
    'max_overflow': 10,
    'pool_size': 5,
    'recycle': 300,
}

# Static files (CSS, JavaScript, Images)
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
STATIC_URL = '/static/'

# Additional locations of static files
STATICFILES_DIRS = [
    os.path.join(BASE_DIR, 'static'),
]

# Ensure the staticfiles directory exists
os.makedirs(STATIC_ROOT, exist_ok=True)

# Media files
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
MEDIA_URL = '/media/'
os.makedirs(MEDIA_ROOT, exist_ok=True)

# WhiteNoise configuration for static files
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

# Add compression and caching for static files
WHITENOISE_MAX_AGE = 31536000  # 1 year
WHITENOISE_USE_FINDERS = True
WHITENOISE_MANIFEST_STRICT = False
WHITENOISE_ALLOW_ALL_ORIGINS = False

# For Render.com, use S3 for media files if AWS credentials are provided
if os.getenv('AWS_ACCESS_KEY_ID'):
    DEFAULT_FILE_STORAGE = 'storages.backends.s3boto3.S3Boto3Storage'
    AWS_ACCESS_KEY_ID = os.getenv('AWS_ACCESS_KEY_ID')
    AWS_SECRET_ACCESS_KEY = os.getenv('AWS_SECRET_ACCESS_KEY')
    AWS_STORAGE_BUCKET_NAME = os.getenv('AWS_STORAGE_BUCKET_NAME')
    AWS_S3_REGION_NAME = os.getenv('AWS_S3_REGION_NAME', 'us-east-1')
    AWS_DEFAULT_ACL = 'public-read'
    AWS_S3_OBJECT_PARAMETERS = {
        'CacheControl': 'max-age=86400',
    }
    AWS_S3_CUSTOM_DOMAIN = f'{AWS_STORAGE_BUCKET_NAME}.s3.amazonaws.com'
    MEDIA_URL = f'https://{AWS_S3_CUSTOM_DOMAIN}/media/'

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

# Logging configuration for production
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
        'json': {
            '()': 'pythonjsonlogger.jsonlogger.JsonFormatter',
            'format': '%(asctime)s %(created)f %(exc_info)s %(filename)s %(funcName)s %(levelname)s %(levelno)s %(lineno)d %(module)s %(message)s %(pathname)s %(process)s %(processName)s %(relativeCreated)d %(thread)s %(threadName)s',
        },
    },
    'handlers': {
        'console': {
            'level': 'INFO',
            'class': 'logging.StreamHandler',
            'formatter': 'json' if os.getenv('RENDER') else 'simple',
        },
        'mail_admins': {
            'level': 'ERROR',
            'class': 'django.utils.log.AdminEmailHandler',
            'include_html': True,
            'formatter': 'verbose',
        },
        'file': {
            'level': 'WARNING',
            'class': 'logging.handlers.RotatingFileHandler',
            'filename': os.path.join(BASE_DIR, 'logs/django.log'),
            'maxBytes': 1024 * 1024 * 5,  # 5 MB
            'backupCount': 5,
            'formatter': 'verbose',
            'delay': True,  # Don't create the file until it's actually needed
        },
    },
    'loggers': {
        'django': {
            'handlers': ['console', 'file', 'mail_admins'],
            'level': 'INFO',
            'propagate': False,
        },
        'jobs': {
            'handlers': ['console', 'file'],
            'level': 'INFO',
            'propagate': False,
        },
        'django.db.backends': {
            'level': 'ERROR',
            'handlers': ['console', 'file'],
            'propagate': False,
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

# DRF Spectacular Settings
SPECTACULAR_SETTINGS = {
    'TITLE': 'CareerOpen API',
    'DESCRIPTION': 'API documentation for CareerOpen',
    'VERSION': '1.0.0',
    'SERVE_INCLUDE_SCHEMA': False,
    'SCHEMA_PATH_PREFIX': r'/api/v[0-9]',
    'COMPONENT_SPLIT_REQUEST': True,
    # Disable example processing
    'ENUM_NAME_OVERRIDES': {},
    'POSTPROCESSING_HOOKS': [],
    'PREPROCESSING_HOOKS': [],
    'SERVE_PUBLIC': True,
    # Disable authentication for schema endpoints
    'SERVE_AUTHENTICATION': None,
    'SERVE_PERMISSIONS': None,
    # Disable schema validation
    'ENFORCE_NON_BLANK_FIELDS': False,
    'COMPONENT_NO_READ_ONLY_REQUIRED': True,
    # Disable response examples
    'ENUM_ADD_EXPLICIT_BLANK_NULL_CHOICE': False,
    'GENERIC_ADDITIONAL_PROPERTIES': 'dict',
    # Disable schema validation
    'SCHEMA_COERCE_PATH_PK_SUFFIX': True,
    # Disable response splitting
    'COMPONENT_SPLIT_RESPONSE': False,
    # Disable path prefix trimming
    'SCHEMA_PATH_PREFIX_TRIM': False,
}

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
