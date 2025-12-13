"""
Error handling middleware for CareerOpen API.

This middleware provides consistent error responses and handles exceptions.
"""
import json
import logging
from functools import wraps
from django.http import JsonResponse
from rest_framework import status
from rest_framework.exceptions import (
    APIException, ValidationError, AuthenticationFailed, PermissionDenied,
    NotAuthenticated, NotFound, MethodNotAllowed, NotAcceptable,
    Throttled, UnsupportedMediaType, ParseError
)

logger = logging.getLogger(__name__)

class APIError(APIException):
    """Base class for API errors."""
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = 'An error occurred.'
    default_code = 'error'

    def __init__(self, detail=None, code=None, status_code=None, **kwargs):
        if status_code is not None:
            self.status_code = status_code
        if detail is not None:
            self.detail = detail
        elif hasattr(self, 'default_detail'):
            self.detail = {'error': self.default_detail}
        if code is not None:
            self.code = code
        elif hasattr(self, 'default_code'):
            self.code = self.default_code
        self.extra = kwargs

    def __str__(self):
        return str(self.detail)

class ValidationError(ValidationError):
    """Raised when validation fails."""
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = 'Invalid input.'
    default_code = 'invalid'

class AuthenticationFailed(AuthenticationFailed):
    """Raised when authentication fails."""
    status_code = status.HTTP_401_UNAUTHORIZED
    default_detail = 'Incorrect authentication credentials.'
    default_code = 'authentication_failed'

class PermissionDenied(PermissionDenied):
    """Raised when a user doesn't have permission to perform an action."""
    status_code = status.HTTP_403_FORBIDDEN
    default_detail = 'You do not have permission to perform this action.'
    default_code = 'permission_denied'

def api_exception_handler(exception, context):
    """
    Custom exception handler for DRF.
    
    Returns consistent error responses for all API exceptions.
    """
    # Log the exception
    logger.error(f"API Error: {str(exception)}", exc_info=True)
    
    # Handle different types of exceptions
    if isinstance(exception, ValidationError):
        return JsonResponse(
            {
                'error': 'Validation Error',
                'details': exception.detail,
                'code': getattr(exception, 'code', 'validation_error')
            },
            status=status.HTTP_400_BAD_REQUEST
        )
    elif isinstance(exception, AuthenticationFailed):
        return JsonResponse(
            {
                'error': 'Authentication Failed',
                'details': str(exception.detail),
                'code': 'authentication_failed'
            },
            status=status.HTTP_401_UNAUTHORIZED
        )
    elif isinstance(exception, NotAuthenticated):
        return JsonResponse(
            {
                'error': 'Not Authenticated',
                'details': 'Authentication credentials were not provided.',
                'code': 'not_authenticated'
            },
            status=status.HTTP_401_UNAUTHORIZED
        )
    elif isinstance(exception, PermissionDenied):
        return JsonResponse(
            {
                'error': 'Permission Denied',
                'details': str(exception.detail),
                'code': 'permission_denied'
            },
            status=status.HTTP_403_FORBIDDEN
        )
    elif isinstance(exception, NotFound):
        return JsonResponse(
            {
                'error': 'Not Found',
                'details': str(exception.detail),
                'code': 'not_found'
            },
            status=status.HTTP_404_NOT_FOUND
        )
    elif isinstance(exception, MethodNotAllowed):
        return JsonResponse(
            {
                'error': 'Method Not Allowed',
                'details': f"Method '{exception.request.method}' not allowed.",
                'code': 'method_not_allowed'
            },
            status=status.HTTP_405_METHOD_NOT_ALLOWED
        )
    elif isinstance(exception, Throttled):
        return JsonResponse(
            {
                'error': 'Request was throttled',
                'details': 'Too many requests, please try again later.',
                'code': 'throttled',
                'wait': f"{exception.wait} seconds"
            },
            status=status.HTTP_429_TOO_MANY_REQUESTS
        )
    elif isinstance(exception, APIError):
        response_data = {
            'error': 'API Error',
            'details': str(exception.detail),
            'code': getattr(exception, 'code', 'api_error')
        }
        if hasattr(exception, 'extra') and exception.extra:
            response_data.update(exception.extra)
        return JsonResponse(response_data, status=exception.status_code)
    
    # Default error response
    return JsonResponse(
        {
            'error': 'Server Error',
            'details': 'An unexpected error occurred.',
            'code': 'server_error'
        },
        status=status.HTTP_500_INTERNAL_SERVER_ERROR
    )

def handle_exceptions(view_func):
    """
    Decorator to handle exceptions in API views.
    
    This decorator wraps a view function and ensures that all exceptions
    are caught and returned in a consistent format.
    """
    @wraps(view_func)
    def wrapped_view(request, *args, **kwargs):
        try:
            return view_func(request, *args, **kwargs)
        except Exception as e:
            return api_exception_handler(e, {'request': request})
    return wrapped_view
