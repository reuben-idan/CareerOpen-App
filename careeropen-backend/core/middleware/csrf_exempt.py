"""
Custom CSRF middleware that bypasses CSRF checks for specific paths.
"""
from django.conf import settings
from django.middleware.csrf import CsrfViewMiddleware
from django.utils.deprecation import MiddlewareMixin

class CsrfExemptMiddleware(MiddlewareMixin):
    """
    Middleware that adds a CSRF exemption for specific paths.
    This should be placed before CsrfViewMiddleware in MIDDLEWARE.
    """
    def process_view(self, request, callback, callback_args, callback_kwargs):
        # List of paths to exclude from CSRF protection
        csrf_exempt_paths = [
            '/api/auth/token/',  # JWT token endpoint
            '/api/token/',       # Alternative JWT token endpoint
        ]
        
        # Check if the current path should be exempt from CSRF
        if any(request.path.startswith(path) for path in csrf_exempt_paths):
            setattr(request, '_dont_enforce_csrf_checks', True)
        
        return None
