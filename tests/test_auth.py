"""Test authentication flow for the CareerOpen API."""
import pytest
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APIClient

# Get the User model
User = get_user_model()

# Test configuration
TEST_EMAIL = "testuser@example.com"
TEST_PASSWORD = "TestPass123!"

@pytest.fixture
def api_client():
    """Fixture for creating an API client."""
    return APIClient()

@pytest.fixture
def test_user():
    """Fixture for creating a test user."""
    user = User.objects.create_user(
        email=TEST_EMAIL,
        password=TEST_PASSWORD,
        first_name="Test",
        last_name="User",
        is_employer=False
    )
    user.is_active = True
    user.save()
    return user

@pytest.mark.django_db
def test_user_registration(api_client):
    """Test user registration with valid data."""
    # Clean up any existing test user
    User.objects.filter(email=TEST_EMAIL).delete()
    
    url = '/api/v1/auth/register/'
    data = {
        "email": TEST_EMAIL,
        "password": TEST_PASSWORD,
        "password2": TEST_PASSWORD,
        "first_name": "Test",
        "last_name": "User",
        "is_employer": False
    }
    
    response = api_client.post(url, data, format='json')
    assert response.status_code == status.HTTP_201_CREATED
    
    # Verify user was created
    user = User.objects.get(email=TEST_EMAIL)
    assert user.email == TEST_EMAIL
    assert user.check_password(TEST_PASSWORD)
