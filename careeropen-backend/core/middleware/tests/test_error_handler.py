"""Tests for the error handler middleware."""
import json
import pytest
from django.test import RequestFactory
from django.http import JsonResponse
from rest_framework.exceptions import (
    ValidationError, AuthenticationFailed, PermissionDenied, NotAuthenticated,
    NotFound, MethodNotAllowed, NotAcceptable, Throttled, UnsupportedMediaType, ParseError
)
from rest_framework.views import APIView
from rest_framework.views import exception_handler as drf_exception_handler

from core.middleware.error_handler import (
    api_exception_handler,
    handle_exceptions,
    APIError,
    ValidationError as CustomValidationError
)

class TestErrorHandler:
    """Test cases for error handler middleware."""
    
    def setup_method(self, method):
        """Set up test environment."""
        self.factory = RequestFactory()
        self.context = {'request': self.factory.get('/test/')}
    
    def test_validation_error_handling(self):
        ""Test handling of DRF ValidationError."""
        error = ValidationError({'field': ['This field is required.']})
        response = api_exception_handler(error, self.context)
        
        assert response.status_code == 400
        assert response.data == {
            'error': 'Validation Error',
            'details': {'field': ['This field is required.']},
            'code': 'validation_error'
        }
    
    def test_authentication_failed_handling(self):
        ""Test handling of AuthenticationFailed."""
        error = AuthenticationFailed('Invalid credentials')
        response = api_exception_handler(error, self.context)
        
        assert response.status_code == 401
        assert response.data == {
            'error': 'Authentication Failed',
            'details': 'Invalid credentials',
            'code': 'authentication_failed'
        }
    
    def test_permission_denied_handling(self):
        ""Test handling of PermissionDenied."""
        error = PermissionDenied('Not allowed')
        response = api_exception_handler(error, self.context)
        
        assert response.status_code == 403
        assert response.data == {
            'error': 'Permission Denied',
            'details': 'Not allowed',
            'code': 'permission_denied'
        }
    
    def test_not_found_handling(self):
        ""Test handling of NotFound."""
        error = NotFound('Not found')
        response = api_exception_handler(error, self.context)
        
        assert response.status_code == 404
        assert response.data == {
            'error': 'Not Found',
            'details': 'Not found',
            'code': 'not_found'
        }
    
    def test_method_not_allowed_handling(self):
        ""Test handling of MethodNotAllowed."""
        error = MethodNotAllowed('POST')
        self.context['request'].method = 'POST'
        response = api_exception_handler(error, self.context)
        
        assert response.status_code == 405
        assert response.data == {
            'error': 'Method Not Allowed',
            'details': "Method 'POST' not allowed.",
            'code': 'method_not_allowed'
        }
    
    def test_throttled_handling(self):
        ""Test handling of Throttled exception."""
        error = Throttled()
        error.wait = 10
        response = api_exception_handler(error, self.context)
        
        assert response.status_code == 429
        assert response.data == {
            'error': 'Request was throttled',
            'details': 'Too many requests, please try again later.',
            'code': 'throttled',
            'wait': '10.0 seconds'
        }
    
    def test_custom_api_error_handling(self):
        ""Test handling of custom APIError."""
        error = APIError(
            detail='Custom error',
            code='custom_error',
            status_code=418,
            extra={'key': 'value'}
        )
        response = api_exception_handler(error, self.context)
        
        assert response.status_code == 418
        assert response.data == {
            'error': 'API Error',
            'details': 'Custom error',
            'code': 'custom_error',
            'key': 'value'
        }
    
    def test_unhandled_exception_handling(self):
        ""Test handling of unhandled exceptions."""
        error = ValueError('Unexpected error')
        response = api_exception_handler(error, self.context)
        
        assert response.status_code == 500
        assert response.data == {
            'error': 'Server Error',
            'details': 'An unexpected error occurred.',
            'code': 'server_error'
        }
    
    def test_handle_exceptions_decorator(self):
        ""Test the handle_exceptions decorator."""
        @handle_exceptions
        def view_that_raises(request):
            raise ValidationError('Test error')
        
        request = self.factory.get('/test/')
        response = view_that_raises(request)
        
        assert response.status_code == 400
        assert response.data == {
            'error': 'Validation Error',
            'details': {'non_field_errors': ['Test error']},
            'code': 'validation_error'
        }
    
    def test_handle_exceptions_with_json_response(self):
        ""Test that handle_exceptions doesn't modify JsonResponse."""
        @handle_exceptions
        def view_that_returns_json(request):
            return JsonResponse({'status': 'success'}, status=201)
        
        request = self.factory.get('/test/')
        response = view_that_returns_json(request)
        
        assert response.status_code == 201
        assert response.json() == {'status': 'success'}
    
    def test_custom_validation_error(self):
        ""Test custom ValidationError class."""
        error = CustomValidationError('Custom validation failed', code='custom_validation')
        response = api_exception_handler(error, self.context)
        
        assert response.status_code == 400
        assert response.data == {
            'error': 'Validation Error',
            'details': 'Custom validation failed',
            'code': 'custom_validation'
        }
    
    def test_error_handler_with_drf_view(self):
        ""Test error handling with DRF APIView."""
        class TestView(APIView):
            def get(self, request):
                raise ValueError('Test error')
        
        # Simulate DRF's exception handling
        view = TestView.as_view()
        request = self.factory.get('/test/')
        response = view(request)
        
        # DRF will use our custom exception handler
        response = drf_exception_handler(response, self.context)
        
        assert response.status_code == 500
        assert response.data == {
            'error': 'Server Error',
            'details': 'An unexpected error occurred.',
            'code': 'server_error'
        }
