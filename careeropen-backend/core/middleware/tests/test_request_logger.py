"""Tests for the request logger middleware."""
import json
import logging
from unittest.mock import patch, MagicMock

import pytest
from django.test import RequestFactory, TestCase
from django.http import JsonResponse, HttpResponse

from core.middleware.request_logger import (
    RequestResponseLoggingMiddleware,
    RequestIdMiddleware
)

class TestRequestResponseLoggingMiddleware(TestCase):
    """Test cases for RequestResponseLoggingMiddleware."""
    
    def setUp(self):
        """Set up test environment."""
        self.factory = RequestFactory()
        self.middleware = RequestResponseLoggingMiddleware(get_response=self.get_response)
        self.logger = logging.getLogger('api')
        self.logger.handlers = [logging.NullHandler()]  # Disable logging during tests
    
    def get_response(self, request):
        """A simple view that returns a response."""
        return JsonResponse({'status': 'success'})
    
    @patch('core.middleware.request_logger.logger')
    def test_process_request_logs_request(self, mock_logger):
        ""Test that requests are logged correctly."""
        request = self.factory.get('/test/', {'param': 'value'})
        request.user = self.create_test_user()
        
        self.middleware.process_request(request)
        
        # Call process_response to complete the request
        response = self.middleware.process_response(request, self.get_response(request))
        
        # Check that the request was logged
        args, kwargs = mock_logger.info.call_args_list[0]
        assert args[0] == 'API Request'
        assert 'method' in kwargs['extra']
        assert 'path' in kwargs['extra']
        assert 'query_params' in kwargs['extra']
        assert 'client_ip' in kwargs['extra']
        assert 'user_agent' in kwargs['extra']
        assert 'user' in kwargs['extra']
    
    @patch('core.middleware.request_logger.logger')
    def test_process_response_logs_response(self, mock_logger):
        ""Test that responses are logged correctly."""
        request = self.factory.get('/test/')
        request.user = self.create_test_user()
        
        # Set start time for the request
        request.start_time = 0
        
        response = self.middleware.process_response(request, self.get_response(request))
        
        # Check that the response was logged
        args, kwargs = mock_logger.info.call_args_list[0]
        assert args[0] == 'API Response'
        assert 'method' in kwargs['extra']
        assert 'path' in kwargs['extra']
        assert 'status_code' in kwargs['extra']
        assert 'response_time_ms' in kwargs['extra']
        assert 'client_ip' in kwargs['extra']
        assert 'user' in kwargs['extra']
    
    @patch('core.middleware.request_logger.logger')
    def test_process_request_skips_health_check(self, mock_logger):
        ""Test that health check requests are not logged."""
        request = self.factory.get('/health/')
        
        response = self.middleware.process_request(request)
        
        # Should return None and not log anything
        assert response is None
        mock_logger.info.assert_not_called()
    
    @patch('core.middleware.request_logger.logger')
    def test_process_request_logs_request_body(self, mock_logger):
        ""Test that request body is logged for non-GET requests."""
        data = {'key': 'value'}
        request = self.factory.post(
            '/test/', 
            data=json.dumps(data), 
            content_type='application/json'
        )
        request.user = self.create_test_user()
        
        self.middleware.process_request(request)
        self.middleware.process_response(request, self.get_response(request))
        
        # Check that the request body was logged
        args, kwargs = mock_logger.info.call_args_list[0]
        assert 'body' in kwargs['extra']
        assert kwargs['extra']['body'] == data
    
    @patch('core.middleware.request_logger.logger')
    def test_process_response_logs_error_responses(self, mock_logger):
        ""Test that error responses are logged with error details."""
        request = self.factory.get('/test/')
        request.user = self.create_test_user()
        
        # Set start time for the request
        request.start_time = 0
        
        # Create an error response
        error_response = JsonResponse(
            {'error': 'Not found'}, 
            status=404
        )
        
        response = self.middleware.process_response(request, error_response)
        
        # Check that the error was logged
        args, kwargs = mock_logger.info.call_args_list[0]
        assert 'error' in kwargs['extra']
        assert kwargs['extra']['status_code'] == 404
    
    def test_response_time_header_added(self):
        ""Test that X-Response-Time header is added to the response."""
        request = self.factory.get('/test/')
        request.user = self.create_test_user()
        
        # Set start time for the request
        request.start_time = 0
        
        response = self.middleware.process_response(request, self.get_response(request))
        
        # Check that the X-Response-Time header was added
        assert 'X-Response-Time' in response
        assert response['X-Response-Time'].endswith('ms')
    
    def create_test_user(self):
        ""Create a test user."""
        from django.contrib.auth import get_user_model
        User = get_user_model()
        return User.objects.create_user(
            email='test@example.com',
            password='testpass123',
            first_name='Test',
            last_name='User'
        )


class TestRequestIdMiddleware(TestCase):
    ""Test cases for RequestIdMiddleware."""
    
    def setUp(self):
        ""Set up test environment."""
        self.factory = RequestFactory()
        self.middleware = RequestIdMiddleware(get_response=self.get_response)
    
    def get_response(self, request):
        ""A simple view that returns a response."""
        return JsonResponse({'status': 'success'})
    
    def test_request_id_added_to_request(self):
        ""Test that a request ID is added to the request object."""
        request = self.factory.get('/test/')
        
        # Before middleware
        assert not hasattr(request, 'id')
        
        # After middleware
        response = self.middleware(request)
        
        # Check that request.id was set
        assert hasattr(request, 'id')
        assert isinstance(request.id, str)
        assert len(request.id) == 36  # UUID length
    
    def test_request_id_added_to_response_headers(self):
        ""Test that the request ID is added to the response headers."""
        request = self.factory.get('/test/')
        
        response = self.middleware(request)
        
        # Check that X-Request-ID header was added
        assert 'X-Request-ID' in response
        assert response['X-Request-ID'] == request.id
    
    def test_different_request_ids(self):
        ""Test that different requests get different request IDs."""
        request1 = self.factory.get('/test/')
        request2 = self.factory.get('/test/')
        
        response1 = self.middleware(request1)
        response2 = self.middleware(request2)
        
        # Check that different requests get different IDs
        assert request1.id != request2.id
        assert response1['X-Request-ID'] == request1.id
        assert response2['X-Request-ID'] == request2.id
