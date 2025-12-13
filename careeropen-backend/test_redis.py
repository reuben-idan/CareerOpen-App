import os
import django

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

# Now import Django cache
from django.core.cache import cache

# Test Redis connection
try:
    cache.set('test_key', 'test_value', timeout=30)
    result = cache.get('test_key')
    print(f"Redis connection successful! Test value: {result}")
except Exception as e:
    print(f"Error connecting to Redis: {e}")
