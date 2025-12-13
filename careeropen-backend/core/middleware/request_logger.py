"""
Request logging middleware for CareerOpen API.

This middleware logs all incoming requests and outgoing responses.
Compatible with both synchronous and asynchronous requests in Django 5+.
"""
import json
import logging
import time
import inspect
import asyncio
from functools import partial
from django.conf import settings
from django.http import HttpResponse, JsonResponse

logger = logging.getLogger('api')

def is_coroutine_function(func):
    """Check if a function is a coroutine function."""
    return inspect.iscoroutinefunction(func)

class RequestResponseLoggingMiddleware:
    """
    Middleware to log all requests and responses.
    
    This middleware is compatible with both synchronous and asynchronous requests in Django 5+.
    """
    
    def __init__(self, get_response):
        self.get_response = get_response
        # Explicitly mark as async capable
        self._async_capable = True
        self._is_coroutine = is_coroutine_function(get_response)
        self.start_time = None
    
    def __call__(self, request):
        # Handle synchronous request
        if not self._is_coroutine:
            try:
                response = self.sync_process_request_response(request)
                # Ensure we don't return a coroutine from sync view
                if asyncio.iscoroutine(response):
                    raise RuntimeError("Synchronous view returned a coroutine")
                return response
            except Exception as e:
                logger.error(f"Error in sync_process_request_response: {str(e)}", exc_info=True)
                return JsonResponse(
                    {'error': 'Internal server error', 'details': str(e)},
                    status=500
                )
        
        # Handle asynchronous request
        return self.async_process_request_response(request)
    
    async def __acall__(self, request):
        # Handle asynchronous request (Django 5+)
        try:
            return await self.async_process_request_response(request)
        except Exception as e:
            logger.error(f"Error in async_process_request_response: {str(e)}", exc_info=True)
            return JsonResponse(
                {'error': 'Internal server error', 'details': str(e)},
                status=500
            )
    
    def sync_process_request_response(self, request):
        """Process the request and response synchronously."""
        # Skip logging for health check endpoints
        if request.path == '/health/' or request.path.startswith('/static/') or request.path.startswith('/media/'):
            response = self.get_response(request)
            # Ensure we return a proper response object
            if asyncio.iscoroutine(response):
                raise RuntimeError("Synchronous view returned a coroutine")
            return response
        
        # Set the start time for the request
        self.start_time = time.time()
        request_id = self._add_request_id(request)
        
        try:
            # Log the request
            self._log_request(request, request_id)
            
            # Process the response
            response = self.get_response(request)
            
            # Ensure we have a proper response object
            if asyncio.iscoroutine(response):
                raise RuntimeError("Synchronous view returned a coroutine")
            
            # Log the response
            self._log_response(request, response, request_id)
            
            return response
            
        except Exception as e:
            logger.error(f"Error processing request: {str(e)}", exc_info=True)
            return JsonResponse(
                {'error': 'Internal server error', 'details': str(e)},
                status=500
            )
    
    async def async_process_request_response(self, request):
        """Process the request and response asynchronously."""
        # Skip logging for health check and static/media files
        if request.path == '/health/' or request.path.startswith('/static/') or request.path.startswith('/media/'):
            response = self.get_response(request)
            # Ensure we await if it's a coroutine
            if asyncio.iscoroutine(response):
                response = await response
            return response
        
        # Set the start time for the request
        self.start_time = time.time()
        request_id = self._add_request_id(request)
        
        try:
            # Log the request
            self._log_request(request, request_id)
            
            # Process the response
            response = self.get_response(request)
            
            # If the response is a coroutine, await it
            if asyncio.iscoroutine(response):
                response = await response
            
            # Ensure we have a proper response object
            if asyncio.iscoroutine(response):
                raise RuntimeError("Async view returned a coroutine that wasn't awaited")
            
            # Log the response
            self._log_response(request, response, request_id)
            
            return response
            
        except Exception as e:
            logger.error(f"Error processing async request: {str(e)}", exc_info=True)
            return JsonResponse(
                {'error': 'Internal server error', 'details': str(e)},
                status=500
            )
    
    def _add_request_id(self, request):
        """Add a unique request ID to the request object and return it."""
        import uuid
        request_id = str(uuid.uuid4())
        request.request_id = request_id
        return request_id
        
    def _get_client_ip(self, request):
        """Get the client IP address from the request."""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip
    
    def _log_request(self, request, request_id):
        """Log the incoming request with request ID."""
        try:
            log_data = {
                'type': 'request',
                'request_id': request_id,
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
            
            # Handle form data if present
            if request.method in ['POST', 'PUT', 'PATCH']:
                content_type = request.content_type or ''
                if 'application/x-www-form-urlencoded' in content_type:
                    log_data['form_data'] = dict(request.POST)
                elif 'multipart/form-data' in content_type:
                    # Don't log file content, just the field names
                    log_data['files'] = list(request.FILES.keys())
            
            logger.info("Incoming request", extra=log_data)
            
        except Exception as e:
            logger.error(f"Error logging request: {str(e)}", exc_info=True)
    
    def _log_response(self, request, response, request_id):
        """Log the outgoing response with request ID."""
        try:
            # Calculate response time
            response_time = time.time() - self.start_time
            
            # Get response content type
            content_type = getattr(response, 'content_type', '').lower()
            
            # Prepare response data
            response_data = {
                'type': 'response',
                'request_id': request_id,
                'method': request.method,
                'path': request.path,
                'status_code': response.status_code,
                'response_time': f"{response_time:.4f}s",
                'content_type': content_type,
                'user': str(request.user) if hasattr(request, 'user') and request.user.is_authenticated else 'anonymous',
            }
            
            # Log response body for error responses
            if hasattr(response, 'content') and response.content:
                try:
                    if 'application/json' in content_type and hasattr(response, 'data'):
                        response_data['response_data'] = response.data
                    elif content_type.startswith('text/'):
                        response_data['response_data'] = response.content.decode('utf-8', errors='replace')
                except Exception as e:
                    logger.debug(f"Could not decode response content: {str(e)}")
            
            # Log at appropriate level based on status code
            if 500 <= response.status_code < 600:
                logger.error("Server error response", extra=response_data)
            elif 400 <= response.status_code < 500:
                logger.warning("Client error response", extra=response_data)
            else:
                logger.info("Outgoing response", extra=response_data)
                
        except Exception as e:
            logger.error(f"Error logging response: {str(e)}", exc_info=True)
            response_data = {
                'type': 'response_error',
                'request_id': request_id,
                'error': f'Error parsing response content: {str(e)}',
                'path': request.path,
                'method': request.method
            }
            logger.error("Failed to log response", extra=response_data)
        
        # Add response time header if possible
        if hasattr(response, 'headers') and not response.headers.get('X-Response-Time'):
            response.headers['X-Response-Time'] = f"{response_time*1000:.2f}ms"
        
        return response
    
    def _get_client_ip(self, request):
        """Get the client's IP address from the request."""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            return x_forwarded_for.split(',')[0]
        return request.META.get('REMOTE_ADDR')


class RequestIdMiddleware:
    """
    Middleware to add a unique request ID to each request.
    
    This middleware is compatible with both synchronous and asynchronous requests in Django 5+.
    """
    
    def __init__(self, get_response):
        self.get_response = get_response
        self._async_capable = True
        self._is_coroutine = getattr(get_response, '_is_coroutine', None) is not None
    
    def __call__(self, request):
        # Handle synchronous request
        if not self._is_coroutine:
            return self.sync_process_request(request)
        
        # Handle asynchronous request
        return self.async_process_request(request)
    
    async def __acall__(self, request):
        # Handle asynchronous request (Django 5+)
        return await self.async_process_request(request)
    
    def sync_process_request(self, request):
        """Process the request and add a unique request ID synchronously."""
        self._add_request_id(request)
        response = self.get_response(request)
        return self._add_response_header(response, request.id)
    
    async def async_process_request(self, request):
        """Process the request and add a unique request ID asynchronously."""
        self._add_request_id(request)
        response = await self.get_response(request)
        return self._add_response_header(response, request.id)
    
    def _add_request_id(self, request):
        """Add a unique request ID to the request object."""
        import uuid
        request.id = str(uuid.uuid4())
    
    def _add_response_header(self, response, request_id):
        """Add the request ID to the response headers if possible."""
        if hasattr(response, '__setitem__'):
            response['X-Request-ID'] = request_id
        return response
