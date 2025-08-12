"""
Minimal test file for UserProfileView functionality.
"""
import os
import sys
import django
from django.test import TestCase, override_settings
from django.contrib.auth import get_user_model
from django.urls import reverse

# Add the project directory to the Python path
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if BASE_DIR not in sys.path:
    sys.path.append(BASE_DIR)

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from rest_framework.test import APIClient
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken

class MinimalUserProfileTest(TestCase):
    """Minimal test case for user profile functionality."""
    
    def setUp(self):
        """Set up test data."""
        self.User = get_user_model()
        self.client = APIClient()
    
    def test_minimal(self):
        """A simple test that should always pass."""
        self.assertTrue(True)
    
    def test_user_creation(self):
        """Test that we can create a user."""
        user = self.User.objects.create_user(
            email='test_user_creation@example.com',
            password='testpass123',
            first_name='Test',
            last_name='User'
        )
        self.assertEqual(user.email, 'test_user_creation@example.com')
        self.assertEqual(user.first_name, 'Test')
        self.assertEqual(user.last_name, 'User')
        print("SUCCESS: Successfully created test user")
    
    def test_user_profile_endpoint(self):
        """Test the user profile endpoint with authentication."""
        # Create a test user
        user = self.User.objects.create_user(
            email='test_profile@example.com',
            password='testpass123',
            first_name='Profile',
            last_name='Test'
        )
        
        # Get JWT token for the test user
        refresh = RefreshToken.for_user(user)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {refresh.access_token}')
        
        # Make a GET request to the user profile endpoint
        url = reverse('user-profile')
        response = self.client.get(url)
        
        # Check that the response is 200 OK
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Check the response data
        self.assertEqual(response.data['email'], 'test_profile@example.com')
        self.assertEqual(response.data['first_name'], 'Profile')
        self.assertEqual(response.data['last_name'], 'Test')
        print("SUCCESS: Successfully retrieved user profile")

if __name__ == "__main__":
    import unittest
    unittest.main()
