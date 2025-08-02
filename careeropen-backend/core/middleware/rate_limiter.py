"""
Rate limiting middleware for CareerOpen API.

This middleware implements rate limiting using Redis to prevent abuse.
"""
import time
import json
from functools import wraps
from django.conf import settings
from django.core.cache import cache
from django.http import JsonResponse
from rest_framework import status

def get_client_ip(request):
    """Get the client's IP address from the request."""
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip

def rate_limit(key_func, limit=100, window=60, scope=None):
    """
    Decorator to rate limit API endpoints.
    
    Args:
        key_func: Function that takes a request and returns a key for rate limiting.
        limit: Maximum number of requests allowed in the time window.
        window: Time window in seconds.
        scope: Optional scope for the rate limit (e.g., 'global', 'user', 'ip').
    """
    def decorator(view_func):
        @wraps(view_func)
        def wrapped_view(request, *args, **kwargs):
            # Skip rate limiting in debug mode
            if settings.DEBUG and not getattr(settings, 'ENABLE_RATE_LIMITING', False):
                return view_func(request, *args, **kwargs)
            
            # Get the rate limit key
            key = key_func(request)
            if not key:
                return view_func(request, *args, **kwargs)
                
            # Add scope to the key if provided
            if scope:
                key = f"rate_limit:{scope}:{key}"
            else:
                key = f"rate_limit:{key}"
            
            # Get the current count and reset time from cache
            current = cache.get_many([key, f"{key}_reset"])
            now = int(time.time())
            
            # Initialize rate limit data if it doesn't exist
            if key not in current:
                cache.set_many({
                    key: 1,
                    f"{key}_reset": now + window
                }, timeout=window + 10)  # Add some buffer time
                return view_func(request, *args, **kwargs)
            
            # Check if we need to reset the counter
            reset_time = current.get(f"{key}_reset", now + window)
            if now > reset_time:
                cache.set_many({
                    key: 1,
                    f"{key}_reset": now + window
                }, timeout=window + 10)
                return view_func(request, *args, **kwargs)
            
            # Check if the rate limit has been exceeded
            count = current.get(key, 0)
            if count >= limit:
                return JsonResponse(
                    {
                        'error': 'Rate limit exceeded',
                        'limit': limit,
                        'remaining': 0,
                        'reset': reset_time
                    },
                    status=status.HTTP_429_TOO_MANY_REQUESTS,
                    headers={
                        'X-RateLimit-Limit': str(limit),
                        'X-RateLimit-Remaining': '0',
                        'X-RateLimit-Reset': str(reset_time),
                        'Retry-After': str(reset_time - now)
                    }
                )
            
            # Increment the counter
            cache.incr(key)
            
            # Set response headers
            response = view_func(request, *args, **kwargs)
            response['X-RateLimit-Limit'] = str(limit)
            response['X-RateLimit-Remaining'] = str(limit - count - 1)
            response['X-RateLimit-Reset'] = str(reset_time)
            
            return response
        
        return wrapped_view
    return decorator

def rate_limit_by_ip(limit=100, window=60):
    """Rate limit by client IP address."""
    def get_key(request):
        return f"ip:{get_client_ip(request)}"
    return rate_limit(get_key, limit, window, 'ip')

def rate_limit_by_user(limit=200, window=60):
    """Rate limit by authenticated user."""
    def get_key(request):
        if not hasattr(request, 'user') or not request.user.is_authenticated:
            return None
        return f"user:{request.user.id}"
    return rate_limit(get_key, limit, window, 'user')

def rate_limit_by_endpoint(limit=50, window=60):
    """Rate limit by API endpoint."""
    def get_key(request):
        return f"endpoint:{request.method}:{request.path}"
    return rate_limit(get_key, limit, window, 'endpoint')
