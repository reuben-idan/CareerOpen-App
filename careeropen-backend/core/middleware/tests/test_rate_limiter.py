"""Tests for the rate limiter middleware."""
import time
import pytest
from django.test import RequestFactory
from django.core.cache import cache
from django.http import JsonResponse
from unittest.mock import patch

from core.middleware.rate_limiter import (
    rate_limit,
    rate_limit_by_ip,
    rate_limit_by_user,
    rate_limit_by_endpoint,
    get_client_ip
)

class TestRateLimiter:
    """Test cases for rate limiter middleware."""
    
    def setup_method(self, method):
        """Clear cache before each test."""
        cache.clear()
    
    def test_get_client_ip_direct(self):
        ""Test getting client IP from REMOTE_ADDR."""
        factory = RequestFactory()
        request = factory.get('/test/')
        request.META['REMOTE_ADDR'] = '192.168.1.1'
        assert get_client_ip(request) == '192.168.1.1'
    
    def test_get_client_ip_proxy(self):
        ""Test getting client IP from X-Forwarded-For header."""
        factory = RequestFactory()
        request = factory.get('/test/', HTTP_X_FORWARDED_FOR='192.168.1.2, 10.0.0.1')
        assert get_client_ip(request) == '192.168.1.2'
    
    def test_rate_limit_single_request(self):
        ""Test a single request within rate limit."""
        def get_key(request):
            return "test_key"
        
        @rate_limit(get_key, limit=5, window=60)
        def test_view(request):
            return JsonResponse({'status': 'success'})
        
        factory = RequestFactory()
        request = factory.get('/test/')
        response = test_view(request)
        
        assert response.status_code == 200
        assert 'X-RateLimit-Limit' in response
        assert 'X-RateLimit-Remaining' in response
        assert 'X-RateLimit-Reset' in response
        assert response['X-RateLimit-Remaining'] == '4'  # 5-1=4 remaining
    
    def test_rate_limit_exceeded(self):
        ""Test exceeding the rate limit."""
        def get_key(request):
            return "test_key"
        
        @rate_limit(get_key, limit=2, window=60)
        def test_view(request):
            return JsonResponse({'status': 'success'})
        
        factory = RequestFactory()
        request = factory.get('/test/')
        
        # First two requests should succeed
        response1 = test_view(request)
        response2 = test_view(request)
        
        # Third request should be rate limited
        response3 = test_view(request)
        
        assert response1.status_code == 200
        assert response2.status_code == 200
        assert response3.status_code == 429  # Too Many Requests
        assert 'Retry-After' in response3
    
    def test_rate_limit_by_ip(self):
        ""Test rate limiting by IP address."""
        @rate_limit_by_ip(limit=3, window=60)
        def test_view(request):
            return JsonResponse({'status': 'success'})
        
        factory = RequestFactory()
        
        # First IP - 3 requests
        request1 = factory.get('/test/')
        request1.META['REMOTE_ADDR'] = '192.168.1.1'
        
        # Second IP - 1 request
        request2 = factory.get('/test/')
        request2.META['REMOTE_ADDR'] = '192.168.1.2'
        
        # First IP - 2 requests (1 remaining)
        response1 = test_view(request1)
        response2 = test_view(request1)
        
        # Second IP - should work fine
        response3 = test_view(request2)
        
        # First IP - 3rd request (should still work)
        response4 = test_view(request1)
        
        # First IP - 4th request (should be rate limited)
        response5 = test_view(request1)
        
        # Second IP - still has 2 more requests before being limited
        response6 = test_view(request2)
        
        assert response1.status_code == 200
        assert response2.status_code == 200
        assert response3.status_code == 200
        assert response4.status_code == 200
        assert response5.status_code == 429
        assert response6.status_code == 200
    
    def test_rate_limit_by_user(self):
        ""Test rate limiting by authenticated user."""
        @rate_limit_by_user(limit=2, window=60)
        def test_view(request):
            return JsonResponse({'status': 'success'})
        
        factory = RequestFactory()
        
        # Create a mock user object with id
        class MockUser:
            def __init__(self, id):
                self.id = id
                self.is_authenticated = True
        
        # First user
        request1 = factory.get('/test/')
        request1.user = MockUser(1)
        
        # Second user
        request2 = factory.get('/test/')
        request2.user = MockUser(2)
        
        # First user - 2 requests
        response1 = test_view(request1)
        response2 = test_view(request1)
        
        # Second user - 1 request
        response3 = test_view(request2)
        
        # First user - 3rd request (should be rate limited)
        response4 = test_view(request1)
        
        # Second user - 2nd request (should work)
        response5 = test_view(request2)
        
        # Second user - 3rd request (should be rate limited)
        response6 = test_view(request2)
        
        assert response1.status_code == 200
        assert response2.status_code == 200
        assert response3.status_code == 200
        assert response4.status_code == 429
        assert response5.status_code == 200
        assert response6.status_code == 429
    
    def test_rate_limit_by_endpoint(self):
        ""Test rate limiting by endpoint."""
        @rate_limit_by_endpoint(limit=2, window=60)
        def test_view(request):
            return JsonResponse({'status': 'success'})
        
        factory = RequestFactory()
        
        # Same endpoint, different methods
        get_request = factory.get('/test/')
        post_request = factory.post('/test/')
        
        # Different endpoint
        other_request = factory.get('/other/')
        
        # First two requests to /test/ should work
        response1 = test_view(get_request)
        response2 = test_view(post_request)
        
        # Third request to /test/ should be rate limited
        response3 = test_view(get_request)
        
        # Request to /other/ should work
        @rate_limit_by_endpoint(limit=2, window=60)
        def other_view(request):
            return JsonResponse({'status': 'other'})
        
        response4 = other_view(other_request)
        
        assert response1.status_code == 200
        assert response2.status_code == 200
        assert response3.status_code == 429
        assert response4.status_code == 200
    
    def test_rate_limit_window_expiry(self):
        ""Test that rate limit window expires correctly."""
        def get_key(request):
            return "test_key"
        
        @rate_limit(get_key, limit=1, window=1)  # 1 request per second
        def test_view(request):
            return JsonResponse({'status': 'success'})
        
        factory = RequestFactory()
        request = factory.get('/test/')
        
        # First request should work
        response1 = test_view(request)
        
        # Second request immediately after should be rate limited
        response2 = test_view(request)
        
        # Wait for the window to expire
        time.sleep(1.1)
        
        # Third request after window expires should work
        response3 = test_view(request)
        
        assert response1.status_code == 200
        assert response2.status_code == 429
        assert response3.status_code == 200
    
    @patch('django.conf.settings.DEBUG', True)
    @patch('core.middleware.rate_limiter.settings.ENABLE_RATE_LIMITING', False)
    def test_rate_limit_bypass_in_debug_mode(self):
        ""Test that rate limiting is bypassed in debug mode."""
        def get_key(request):
            return "test_key"
        
        @rate_limit(get_key, limit=1, window=60)
        def test_view(request):
            return JsonResponse({'status': 'success'})
        
        factory = RequestFactory()
        request = factory.get('/test/')
        
        # Multiple requests should work in debug mode with ENABLE_RATE_LIMITING=False
        response1 = test_view(request)
        response2 = test_view(request)
        response3 = test_view(request)
        
        assert response1.status_code == 200
        assert response2.status_code == 200
        assert response3.status_code == 200
        
        # Rate limit headers should not be set
        assert 'X-RateLimit-Limit' not in response1
        assert 'X-RateLimit-Remaining' not in response1
        assert 'X-RateLimit-Reset' not in response1
