"""
Minimal test for UserProfileView with clean setup.
"""
import os
import sys
import django
from django.test import TestCase
from django.contrib.auth import get_user_model
from django.urls import reverse

# Add the project directory to the Python path
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
if BASE_DIR not in sys.path:
    sys.path.append(BASE_DIR)

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from rest_framework.test import APIClient
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken

class UserProfileViewMinimalTest(TestCase):
    """Minimal test cases for UserProfileView."""
    
    def setUp(self):
        """Set up test data."""
        self.User = get_user_model()
        self.client = APIClient()
        
        # Create a test user
        self.user = self.User.objects.create_user(
            email='test_profile@example.com',
            password='testpass123',
            first_name='Test',
            last_name='User',
            is_employer=False
        )
        
        # Create a JWT token for the test user
        refresh = RefreshToken.for_user(self.user)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {refresh.access_token}')
    
    def test_get_user_profile(self):
        ""Test retrieving the authenticated user's profile."""
        url = reverse('user-profile')
        response = self.client.get(url)
        
        # Check that the response is 200 OK
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Check the response data
        self.assertEqual(response.data['email'], 'test_profile@example.com')
        self.assertEqual(response.data['first_name'], 'Test')
        self.assertEqual(response.data['last_name'], 'User')
        self.assertFalse(response.data['is_employer'])
        
        print("SUCCESS: Successfully retrieved user profile")

if __name__ == "__main__":
    import unittest
    unittest.main()
