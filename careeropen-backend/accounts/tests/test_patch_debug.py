"""
Debugging test for PATCH requests to UserProfileView.
"""
import pytest
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model

User = get_user_model()

def test_debug_patch_request(db):
    """Test PATCH request to UserProfileView with debug output."""
    # Create a test user
    user = User.objects.create_user(
        email='testuser@example.com',
        password='testpass123',
        first_name='Test',
        last_name='User'
    )
    
    # Create an API client and authenticate
    client = APIClient()
    client.force_authenticate(user=user)
    
    # Make a PATCH request to the correct API path
    url = '/api/v1/auth/me/'
    update_data = {'first_name': 'Updated'}
    
    print("\n=== Sending PATCH request ===")
    print(f"URL: {url}")
    print(f"Data: {update_data}")
    
    response = client.patch(url, data=update_data, format='json')
    
    print("\n=== Response ===")
    print(f"Status code: {response.status_code}")
    print(f"Response content: {response.content}")
    print(f"Response headers: {response.headers}")
    
    # Basic assertion to see if the request was successful
    assert response.status_code == status.HTTP_200_OK
