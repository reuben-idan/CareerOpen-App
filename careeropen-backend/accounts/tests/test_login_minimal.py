"""
Minimal test for login functionality.
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
        last_name='User',
        is_active=True
    )

def test_login_success(api_client, test_user):
    """Test successful user login."""
    print("Starting test_login_success")
    
    # Verify the test user was created
    assert User.objects.filter(email='testuser@example.com').exists()
    print("Test user exists in database")
    
    # Prepare login data
    url = reverse('user-login')
    login_data = {
        'email': 'testuser@example.com',
        'password': 'testpass123'
    }
    
    # Make the request
    print("Sending login request...")
    response = api_client.post(url, data=login_data, format='json')
    
    # Check the response
    print(f"Response status code: {response.status_code}")
    print(f"Response data: {response.data}")
    
    assert response.status_code == status.HTTP_200_OK
    assert 'access' in response.data
    assert 'refresh' in response.data
    assert 'user' in response.data
    assert response.data['user']['email'] == 'testuser@example.com'
    assert 'password' not in response.data['user']
    
    print("Login test passed successfully")
