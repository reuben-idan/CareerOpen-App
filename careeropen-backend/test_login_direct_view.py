"""
Direct test of the login view with detailed error handling.
"""
import os
import sys
import django
from pathlib import Path

# Add the project root to the Python path
project_root = Path(__file__).resolve().parent
sys.path.insert(0, str(project_root))

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

try:
    django.setup()
    print("Django setup complete")
except Exception as e:
    print(f"Error setting up Django: {e}")
    sys.exit(1)

# Now import Django and DRF components
from django.urls import reverse, resolve
from rest_framework import status
from rest_framework.test import APIRequestFactory, APITestCase
from django.contrib.auth import get_user_model
from accounts.views import UserLoginView

User = get_user_model()

class DirectLoginTest(APITestCase):
    """Direct test of the login view."""
    
    def setUp(self):
        """Set up test data."""
        self.factory = APIRequestFactory()
        self.user = User.objects.create_user(
            email='testuser@example.com',
            password='testpass123',
            first_name='Test',
            last_name='User',
            is_active=True
        )
        
    def test_login_view_direct(self):
        """Test the login view directly."""
        print("\n=== Testing login view directly ===")
        
        # Get the URL for the login view
        url = reverse('user-login')
        print(f"Login URL: {url}")
        
        # Resolve the view
        view_func, _, _ = resolve(url)
        print(f"View function: {view_func.__name__}")
        
        # Create a request
        data = {
            'email': 'testuser@example.com',
            'password': 'testpass123'
        }
        
        # Create a POST request
        request = self.factory.post(url, data, format='json')
        
        # Call the view directly
        try:
            print("Calling view directly...")
            response = view_func(request)
            print(f"Response status code: {response.status_code}")
            print(f"Response data: {response.data}")
            
            self.assertEqual(response.status_code, status.HTTP_200_OK)
            self.assertIn('access', response.data)
            self.assertIn('refresh', response.data)
            self.assertIn('user', response.data)
            
            print("Login test passed successfully!")
            
        except Exception as e:
            print(f"Error calling view: {e}")
            import traceback
            traceback.print_exc()
            raise

if __name__ == "__main__":
    import unittest
    unittest.main()
