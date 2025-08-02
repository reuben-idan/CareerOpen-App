from .settings import *

# Use in-memory SQLite database for testing
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': ':memory:',
    }
}

# Disable password hashing for faster tests
PASSWORD_HASHERS = [
    'django.contrib.auth.hashers.MD5PasswordHasher',
]

# Disable caching for tests
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.dummy.DummyCache',
    }
}

# Disable logging during testing
import logging
logging.disable(logging.CRITICAL)

# Use faster password hasher for testing
PASSWORD_HASHERS = [
    'django.contrib.auth.hashers.MD5PasswordHasher',
]

# Disable throttling during testing
REST_FRAMEWORK['DEFAULT_THROTTLE_RATES'] = {
    'anon': None,
    'user': None,
}

# Use console email backend for testing
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'

# Disable file storage for tests
DEFAULT_FILE_STORAGE = 'inmemorystorage.InMemoryStorage'

# Use a simpler secret key for testing
SECRET_KEY = 'test-secret-key-for-testing-only'
