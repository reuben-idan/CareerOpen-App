"""
Test file for UserProfileView functionality.
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

User = get_user_model()

# Override database settings to use SQLite in-memory database for testing
TEST_SETTINGS = {
    'DATABASES': {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': ':memory:',
        }
    },
    'PASSWORD_HASHERS': [
        'django.contrib.auth.hashers.MD5PasswordHasher',
    ],
    'ROOT_URLCONF': 'core.urls',
}

@override_settings(**TEST_SETTINGS)
class UserProfileViewTest(TestCase):
    """Test cases for UserProfileView."""
    
    def setUp(self):
        """Set up test data."""
        # Create test user with unique email for each test
        self.email = f'test_{self._testMethodName}@example.com'
        self.user = User.objects.create_user(
            email=self.email,
            password='testpass123',
            first_name='Test',
            last_name='User'
        )
        
        # Set up test client
        self.client = APIClient()
        
        # Get JWT token for the test user
        refresh = RefreshToken.for_user(self.user)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {refresh.access_token}')
    
    def test_get_user_profile(self):
        """Test retrieving the authenticated user's profile."""
        url = reverse('user-profile')
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['email'], self.email)
        self.assertEqual(response.data['first_name'], 'Test')
        self.assertEqual(response.data['last_name'], 'User')
        print("SUCCESS: Successfully retrieved user profile")

if __name__ == "__main__":
    import unittest
    unittest.main()
