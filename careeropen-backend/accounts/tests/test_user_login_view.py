"""
Pytest tests for the UserLoginView.
"""
import pytest
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()

@pytest.fixture
def api_client():
    """Fixture for API client."""
    return APIClient()

@pytest.fixture
def test_user():
    """Fixture for test user."""
    return User.objects.create_user(
        email='testuser@example.com',
        password='testpass123',
        first_name='Test',
        last_name='User',
        is_active=True
    )

class TestUserLoginView:
    """Test cases for UserLoginView."""
    
    def test_login_success(self, api_client, test_user):
        """Test successful user login with correct credentials."""
        url = reverse('user-login')
        login_data = {
            'email': 'testuser@example.com',
            'password': 'testpass123'
        }
        
        response = api_client.post(url, data=login_data, format='json')
        
        assert response.status_code == status.HTTP_200_OK
        assert 'access' in response.data
        assert 'refresh' in response.data
        assert 'user' in response.data
        assert response.data['user']['email'] == 'testuser@example.com'
        assert 'password' not in response.data['user']
    
    def test_login_invalid_credentials(self, api_client, test_user):
        """Test login with invalid credentials."""
        url = reverse('user-login')
        login_data = {
            'email': 'testuser@example.com',
            'password': 'wrongpassword'
        }
        
        response = api_client.post(url, data=login_data, format='json')
        
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
        assert 'detail' in response.data
        assert 'No active account found' in str(response.data['detail'])
    
    def test_login_inactive_user(self, api_client, test_user):
        """Test login with an inactive user account."""
        # Deactivate the test user
        test_user.is_active = False
        test_user.save()
        
        url = reverse('user-login')
        login_data = {
            'email': 'testuser@example.com',
            'password': 'testpass123'
        }
        
        response = api_client.post(url, data=login_data, format='json')
        
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
        assert 'detail' in response.data
        assert 'No active account found' in str(response.data['detail'])
        
        # Reactivate the user for other tests
        test_user.is_active = True
        test_user.save()
    
    def test_login_missing_credentials(self, api_client):
        """Test login with missing credentials."""
        url = reverse('user-login')
        
        # Missing password
        response = api_client.post(url, data={'email': 'test@example.com'}, format='json')
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'password' in response.data
        
        # Missing email
        response = api_client.post(url, data={'password': 'testpass123'}, format='json')
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'email' in response.data
        
        # Empty data
        response = api_client.post(url, data={}, format='json')
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'email' in response.data
        assert 'password' in response.data
