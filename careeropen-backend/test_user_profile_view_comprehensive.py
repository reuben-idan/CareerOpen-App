"""
Comprehensive test file for UserProfileView functionality.
"""
import os
import sys
import json
import django
from django.test import TestCase
from django.contrib.auth import get_user_model
from django.urls import reverse

# Add the project directory to the Python path
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if BASE_DIR not in sys.path:
    sys.path.append(BASE_DIR)

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from rest_framework.test import APIClient, APITestCase
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken

class UserProfileViewComprehensiveTest(APITestCase):
    """Comprehensive test cases for UserProfileView."""
    
    @classmethod
    def setUpTestData(cls):
        """Set up test data for the whole TestCase."""
        cls.User = get_user_model()
        
        # Create a test user
        cls.test_user = cls.User.objects.create_user(
            email='test_profile@example.com',
            password='testpass123',
            first_name='Profile',
            last_name='Test',
            is_employer=False
        )
        
        # Create a test employer user
        cls.employer_user = cls.User.objects.create_user(
            email='employer@example.com',
            password='employerpass123',
            first_name='Employer',
            last_name='User',
            is_employer=True
        )
    
    def setUp(self):
        """Set up test data for each test method."""
        self.client = APIClient()
        
        # Get JWT token for the test user
        refresh = RefreshToken.for_user(self.test_user)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {refresh.access_token}')
    
    def test_get_user_profile(self):
        """Test retrieving the authenticated user's profile."""
        url = reverse('user-profile')
        response = self.client.get(url)
        
        # Check that the response is 200 OK
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Check the response data
        self.assertEqual(response.data['email'], 'test_profile@example.com')
        self.assertEqual(response.data['first_name'], 'Profile')
        self.assertEqual(response.data['last_name'], 'Test')
        self.assertFalse(response.data['is_employer'])
        
        print("SUCCESS: Successfully retrieved user profile")
    
    def test_update_user_profile(self):
        """Test updating the authenticated user's profile."""
        url = reverse('user-profile')
        update_data = {
            'first_name': 'Updated',
            'last_name': 'Name',
            'phone_number': '1234567890',
            'bio': 'This is a test bio',
            'location': 'Test Location',
            'skills': 'Python, Django, Testing'
        }
        
        response = self.client.patch(
            url, 
            data=json.dumps(update_data),
            content_type='application/json'
        )
        
        # Check that the response is 200 OK
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Refresh the user object from the database
        self.test_user.refresh_from_db()
        
        # Check that the user's profile was updated
        self.assertEqual(self.test_user.first_name, 'Updated')
        self.assertEqual(self.test_user.last_name, 'Name')
        self.assertEqual(self.test_user.profile.phone_number, '1234567890')
        self.assertEqual(self.test_user.profile.bio, 'This is a test bio')
        self.assertEqual(self.test_user.profile.location, 'Test Location')
        self.assertEqual(self.test_user.profile.skills, 'Python, Django, Testing')
        
        print("SUCCESS: Successfully updated user profile")
    
    def test_get_profile_unauthenticated(self):
        ""Test that unauthenticated users cannot access the profile endpoint."""
        # Clear authentication
        self.client.credentials()
        
        url = reverse('user-profile')
        response = self.client.get(url)
        
        # Check that the response is 401 Unauthorized
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        
        print("SUCCESS: Unauthenticated access to profile endpoint is restricted")

if __name__ == "__main__":
    import unittest
    unittest.main()
