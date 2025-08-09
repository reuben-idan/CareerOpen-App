"""
Development settings for CareerOpen backend.
Uses SQLite for database and fakeredis for caching in local development.
"""

# Use SQLite for development
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': 'db.sqlite3',
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

# Patch the connection pool to use fakeredis
class FakeConnectionFactory(django_redis.pool.ConnectionFactory):
    def get_connection(self, params):
        return fakeredis.FakeRedis()

django_redis.pool.ConnectionFactory = FakeConnectionFactory

# Enable debug logging for development
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['console'],
            'level': 'INFO',
        },
        '': {
            'handlers': ['console'],
            'level': 'DEBUG',
        },
    },
}
