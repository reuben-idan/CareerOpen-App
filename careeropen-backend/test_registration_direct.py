"""
Direct test of the registration view with detailed error handling.
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
from rest_framework.test import APIRequestFactory, APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model
from accounts.views import SimpleRegistrationView

User = get_user_model()

class DirectRegistrationTest(APITestCase):
    """Direct test of the registration view."""
    
    def setUp(self):
        """Set up test data."""
        self.factory = APIRequestFactory()
        self.view = SimpleRegistrationView.as_view()
        self.url = '/api/accounts/register/simple/'
        
    def test_registration_view_direct(self):
        """Test the registration view directly."""
        print("\n=== Testing registration view directly ===")
        
        # Test data
        test_email = f"test_{os.urandom(4).hex()}@example.com"
        data = {
            'email': test_email,
            'password': 'testpass123',
            'password2': 'testpass123',
            'first_name': 'Test',
            'last_name': 'User',
            'is_employer': False
        }
        
        # Create a POST request
        request = self.factory.post(self.url, data, format='json')
        
        try:
            print("Calling registration view directly...")
            response = self.view(request)
            print(f"Response status code: {response.status_code}")
            print(f"Response data: {response.data}")
            
            self.assertEqual(response.status_code, status.HTTP_201_CREATED)
            self.assertIn('user', response.data)
            self.assertIn('tokens', response.data)
            
            # Verify user was created
            user = User.objects.filter(email=test_email).first()
            self.assertIsNotNone(user, "User was not created in the database")
            
            print("Registration test passed successfully!")
            
        except Exception as e:
            print(f"Error calling view: {e}")
            import traceback
            traceback.print_exc()
            raise

if __name__ == "__main__":
    import unittest
    unittest.main()
