"""
Development settings for CareerOpen backend.
Uses fakeredis for local development.
"""

# Use fakeredis for development
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
