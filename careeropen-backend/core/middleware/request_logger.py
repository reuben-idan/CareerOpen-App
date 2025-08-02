"""
Request logging middleware for CareerOpen API.

This middleware logs all incoming requests and outgoing responses.
"""
import json
import logging
import time
from django.conf import settings
from django.utils.deprecation import MiddlewareMixin

logger = logging.getLogger('api')

class RequestResponseLoggingMiddleware(MiddlewareMixin):
    """Middleware to log all requests and responses."""
    
    def __init__(self, get_response=None):
        self.get_response = get_response
        self.start_time = None
    
    def process_request(self, request):
        """Process the request and log it."""
        # Skip logging for health check endpoints
        if request.path == '/health/':
            return None
        
        # Set the start time for the request
        self.start_time = time.time()
        
        # Log the request
        log_data = {
            'type': 'request',
            'method': request.method,
            'path': request.path,
            'query_params': dict(request.GET),
            'client_ip': self._get_client_ip(request),
            'user_agent': request.META.get('HTTP_USER_AGENT', ''),
            'user': str(request.user) if hasattr(request, 'user') and request.user.is_authenticated else 'anonymous',
        }
        
        # Log request body for non-GET requests
        if request.method not in ['GET', 'HEAD', 'OPTIONS']:
            content_type = request.content_type
            if content_type == 'application/json' and request.body:
                try:
                    log_data['body'] = json.loads(request.body)
                except json.JSONDecodeError:
                    log_data['body'] = request.body.decode('utf-8', errors='replace')
            elif content_type == 'application/x-www-form-urlencoded':
                log_data['form_data'] = dict(request.POST)
            elif content_type.startswith('multipart/form-data'):
                # Don't log file content
                log_data['files'] = list(request.FILES.keys())
        
        logger.info('API Request', extra=log_data)
        return None
    
    def process_response(self, request, response):
        """Process the response and log it."""
        # Skip logging for health check endpoints
        if request.path == '/health/':
            return response
        
        # Calculate response time
        response_time = 0
        if hasattr(self, 'start_time') and self.start_time:
            response_time = (time.time() - self.start_time) * 1000  # in milliseconds
        
        # Prepare response data
        response_data = {
            'type': 'response',
            'method': request.method,
            'path': request.path,
            'status_code': response.status_code,
            'response_time_ms': int(response_time),
            'client_ip': self._get_client_ip(request),
            'user': str(request.user) if hasattr(request, 'user') and request.user.is_authenticated else 'anonymous',
        }
        
        # Log error responses with more details
        if response.status_code >= 400:
            try:
                response_data['error'] = json.loads(response.content)
            except (json.JSONDecodeError, AttributeError):
                response_data['error'] = response.content.decode('utf-8', errors='replace')
        
        # Log the response
        logger.info('API Response', extra=response_data)
        
        # Add response time header
        response['X-Response-Time'] = f"{int(response_time)}ms"
        
        return response
    
    def _get_client_ip(self, request):
        """Get the client's IP address from the request."""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            return x_forwarded_for.split(',')[0]
        return request.META.get('REMOTE_ADDR')


class RequestIdMiddleware:
    """Middleware to add a unique request ID to each request."""
    
    def __init__(self, get_response):
        self.get_response = get_response
    
    def __call__(self, request):
        # Generate a unique request ID
        import uuid
        request.id = str(uuid.uuid4())
        
        # Add the request ID to the response headers
        response = self.get_response(request)
        response['X-Request-ID'] = request.id
        
        return response
