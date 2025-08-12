"""
Pytest tests for the UserProfileView.
"""
import pytest
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model

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
        last_name='User'
    )

@pytest.fixture
def authenticated_client(api_client, test_user):
    """Fixture for authenticated API client."""
    api_client.force_authenticate(user=test_user)
    return api_client

class TestUserProfileView:
    """Test cases for UserProfileView."""
    
    def test_retrieve_profile_authenticated(self, authenticated_client, test_user):
        """Test retrieving profile with authenticated user."""
        # Use the full URL path with the correct API prefix
        url = '/api/v1/auth/me/'
        print(f"\nTesting URL: {url}")
        response = authenticated_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['email'] == test_user.email
        assert response.data['first_name'] == test_user.first_name
        assert response.data['last_name'] == test_user.last_name
        assert 'password' not in response.data  # Password should never be in response
    
    def test_retrieve_profile_unauthenticated(self, api_client):
        """Test retrieving profile without authentication."""
        url = '/api/v1/auth/me/'
        response = api_client.get(url)
        
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
    
    def test_update_profile(self, authenticated_client, test_user):
        """Test updating user profile."""
        url = '/api/v1/auth/me/'
        update_data = {
            'first_name': 'Updated',
            'last_name': 'Name',
            'email': 'updated@example.com',  # Email updates should be handled separately
        }
        
        response = authenticated_client.patch(url, data=update_data, format='json')
        
        assert response.status_code == status.HTTP_200_OK
        
        # Refresh the user from the database
        test_user.refresh_from_db()
        
        # Check that the name was updated
        assert test_user.first_name == 'Updated'
        assert test_user.last_name == 'Name'
        
        # Email should not be updated via this endpoint
        assert test_user.email == 'testuser@example.com'
        
        # Check response data
        assert response.data['first_name'] == 'Updated'
        assert response.data['last_name'] == 'Name'
    
    def test_partial_update_profile(self, authenticated_client, test_user):
        """Test partially updating user profile."""
        url = '/api/v1/auth/me/'
        update_data = {
            'first_name': 'Partial',
        }
        
        response = authenticated_client.patch(url, data=update_data, format='json')
        
        assert response.status_code == status.HTTP_200_OK
        
        # Refresh the user from the database
        test_user.refresh_from_db()
        
        # Check that only the first name was updated
        assert test_user.first_name == 'Partial'
        assert test_user.last_name == 'User'  # Should remain unchanged
    
    @pytest.mark.parametrize('field,value', [
        ('first_name', ''),  # Empty first name
        ('last_name', ''),   # Empty last name
        ('first_name', 'a' * 101),  # First name too long
        ('last_name', 'a' * 101),   # Last name too long
    ])
    def test_update_profile_invalid_data(self, authenticated_client, field, value):
        """Test updating profile with invalid data."""
        url = '/api/v1/auth/me/'
        update_data = {field: value}
        
        response = authenticated_client.patch(url, data=update_data, format='json')
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert field in response.data
    
    def test_update_profile_read_only_fields(self, authenticated_client, test_user):
        """Test that read-only fields cannot be updated."""
        url = '/api/v1/auth/me/'
        original_email = test_user.email
        
        # Try to update read-only fields
        update_data = {
            'email': 'hacked@example.com',
            'date_joined': '2020-01-01T00:00:00Z',
            'is_active': False,
            'is_staff': True,
            'is_superuser': True,
        }
        
        response = authenticated_client.patch(url, data=update_data, format='json')
        
        # Should still return 200 OK, but ignore the read-only fields
        assert response.status_code == status.HTTP_200_OK
        
        # Refresh the user from the database
        test_user.refresh_from_db()
        
        # Check that read-only fields were not updated
        assert test_user.email == original_email
        assert test_user.is_active is True
        assert test_user.is_staff is False
        assert test_user.is_superuser is False
    
    def test_update_profile_unauthorized(self, api_client, test_user):
        """Test updating profile without authentication."""
        url = '/api/v1/auth/me/'
        update_data = {
            'first_name': 'Unauthorized',
        }
        
        response = api_client.patch(url, data=update_data, format='json')
        
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
        
        # Verify no changes were made
        test_user.refresh_from_db()
        assert test_user.first_name == 'Test'
