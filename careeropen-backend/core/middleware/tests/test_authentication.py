"""Tests for the authentication middleware."""
import pytest
from django.test import RequestFactory
from django.contrib.auth import get_user_model
from django.http import JsonResponse
import jwt
from datetime import datetime, timedelta
from django.conf import settings
from unittest.mock import patch, MagicMock

from core.middleware.authentication import (
    jwt_required, 
    role_required, 
    get_authorization_header
)

User = get_user_model()

class TestAuthenticationMiddleware:
    """Test cases for authentication middleware."""
    
    @pytest.fixture
    def user(self):
        """Create a test user."""
        return User.objects.create_user(
            email='test@example.com',
            password='testpass123',
            first_name='Test',
            last_name='User',
            role='employer'
        )
    
    @pytest.fixture
    def valid_token(self, user):
        """Generate a valid JWT token for testing."""
        payload = {
            'user_id': str(user.id),
            'exp': datetime.utcnow() + timedelta(days=1),
            'iat': datetime.utcnow(),
        }
        return jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')
    
    @pytest.fixture
    def expired_token(self, user):
        """Generate an expired JWT token for testing."""
        payload = {
            'user_id': str(user.id),
            'exp': datetime.utcnow() - timedelta(days=1),  # Expired
            'iat': datetime.utcnow() - timedelta(days=2),
        }
        return jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')
    
    @pytest.fixture
    def invalid_token(self):
        """Generate an invalid JWT token for testing."""
        return 'invalid.token.here'
    
    def test_get_authorization_header_valid(self):
        ""Test extracting token from valid Authorization header."""
        factory = RequestFactory()
        request = factory.get('/test/', HTTP_AUTHORIZATION='Bearer valid.token.here')
        assert get_authorization_header(request) == 'valid.token.here'
    
    def test_get_authorization_header_missing(self):
        ""Test handling of missing Authorization header."""
        factory = RequestFactory()
        request = factory.get('/test/')
        assert get_authorization_header(request) is None
    
    def test_get_authorization_header_invalid_format(self):
        ""Test handling of invalid Authorization header format."""
        factory = RequestFactory()
        # Missing 'Bearer' prefix
        request1 = factory.get('/test/', HTTP_AUTHORIZATION='invalid')
        # More than two parts
        request2 = factory.get('/test/', HTTP_AUTHORIZATION='Bearer token extra')
        
        assert get_authorization_header(request1) is None
        assert get_authorization_header(request2) is None
    
    def test_jwt_required_valid_token(self, user, valid_token):
        ""Test JWT required decorator with a valid token."""
        @jwt_required
        def test_view(request):
            return JsonResponse({'status': 'success'})
        
        factory = RequestFactory()
        request = factory.get('/test/', HTTP_AUTHORIZATION=f'Bearer {valid_token}')
        response = test_view(request)
        
        assert response.status_code == 200
        assert response.json() == {'status': 'success'}
        assert hasattr(request, 'user')
        assert request.user == user
    
    def test_jwt_required_missing_token(self):
        ""Test JWT required decorator with missing token."""
        @jwt_required
        def test_view(request):
            return JsonResponse({'status': 'success'})
        
        factory = RequestFactory()
        request = factory.get('/test/')
        response = test_view(request)
        
        assert response.status_code == 401
        assert response.json() == {'error': 'Authentication credentials were not provided.'}
    
    def test_jwt_required_expired_token(self, expired_token):
        ""Test JWT required decorator with an expired token."""
        @jwt_required
        def test_view(request):
            return JsonResponse({'status': 'success'})
        
        factory = RequestFactory()
        request = factory.get('/test/', HTTP_AUTHORIZATION=f'Bearer {expired_token}')
        response = test_view(request)
        
        assert response.status_code == 401
        assert response.json() == {'error': 'Token has expired.'}
    
    def test_jwt_required_invalid_token(self, invalid_token):
        ""Test JWT required decorator with an invalid token."""
        @jwt_required
        def test_view(request):
            return JsonResponse({'status': 'success'})
        
        factory = RequestFactory()
        request = factory.get('/test/', HTTP_AUTHORIZATION=f'Bearer {invalid_token}')
        response = test_view(request)
        
        assert response.status_code == 401
        assert 'Invalid token' in response.json()['error']
    
    def test_role_required_success(self, user, valid_token):
        ""Test role_required decorator with user having required role."""
        @jwt_required
        @role_required('employer')
        def test_view(request):
            return JsonResponse({'status': 'success'})
        
        factory = RequestFactory()
        request = factory.get('/test/', HTTP_AUTHORIZATION=f'Bearer {valid_token}')
        request.user = user  # Simulate authentication
        response = test_view(request)
        
        assert response.status_code == 200
        assert response.json() == {'status': 'success'}
    
    def test_role_required_forbidden(self, user, valid_token):
        ""Test role_required decorator with user missing required role."""
        @jwt_required
        @role_required('admin')
        def test_view(request):
            return JsonResponse({'status': 'success'})
        
        factory = RequestFactory()
        request = factory.get('/test/', HTTP_AUTHORIZATION=f'Bearer {valid_token}')
        request.user = user  # user.role is 'employer', not 'admin'
        response = test_view(request)
        
        assert response.status_code == 403
        assert response.json() == {'error': 'You do not have permission to perform this action.'}
    
    def test_role_required_unauthenticated(self):
        ""Test role_required decorator with unauthenticated user."""
        @jwt_required
        @role_required('admin')
        def test_view(request):
            return JsonResponse({'status': 'success'})
        
        factory = RequestFactory()
        request = factory.get('/test/')
        response = test_view(request)
        
        assert response.status_code == 401
        assert response.json() == {'error': 'Authentication credentials were not provided.'}
    
    @patch('core.middleware.authentication.jwt.decode')
    def test_jwt_required_invalid_user(self, mock_decode, valid_token):
        ""Test JWT with valid token but non-existent user."""
        # Mock jwt.decode to return a user_id that doesn't exist
        mock_decode.return_value = {'user_id': '00000000-0000-0000-0000-000000000000'}
        
        @jwt_required
        def test_view(request):
            return JsonResponse({'status': 'success'})
        
        factory = RequestFactory()
        request = factory.get('/test/', HTTP_AUTHORIZATION=f'Bearer {valid_token}')
        response = test_view(request)
        
        assert response.status_code == 401
        assert 'User not found' in response.json()['error']
    
    @patch('core.middleware.authentication.jwt.decode')
    def test_jwt_required_malformed_payload(self, mock_decode, valid_token):
        ""Test JWT with malformed payload (missing user_id)."""
        mock_decode.return_value = {}  # Missing user_id
        
        @jwt_required
        def test_view(request):
            return JsonResponse({'status': 'success'})
        
        factory = RequestFactory()
        request = factory.get('/test/', HTTP_AUTHORIZATION=f'Bearer {valid_token}')
        response = test_view(request)
        
        assert response.status_code == 401
        assert 'Invalid token payload' in response.json()['details']
