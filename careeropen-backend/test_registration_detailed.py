"""
Detailed test of the registration view with comprehensive error handling.
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

class DetailedRegistrationTest(APITestCase):
    """Detailed test of the registration view."""
    
    def setUp(self):
        """Set up test data."""
        self.factory = APIRequestFactory()
        self.view = SimpleRegistrationView.as_view()
        self.url = '/api/accounts/register/simple/'
        
    def test_registration_view_detailed(self):
        """Test the registration view with detailed output."""
        print("\n=== Testing registration view with detailed output ===")
        
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
            print("\n1. Calling registration view...")
            response = self.view(request)
            
            # Print detailed response information
            print(f"\n2. Response status code: {response.status_code}")
            print(f"3. Response data: {response.data}")
            
            # Check if the response has the expected status code
            if response.status_code != status.HTTP_201_CREATED:
                print(f"\nERROR: Expected status code 201, got {response.status_code}")
                if hasattr(response, 'data') and 'errors' in response.data:
                    print(f"Validation errors: {response.data['errors']}")
                
            # Check if user was created in the database
            user_exists = User.objects.filter(email=test_email).exists()
            print(f"\n4. User created in database: {user_exists}")
            
            if user_exists:
                user = User.objects.get(email=test_email)
                print(f"5. User details - ID: {user.id}, Active: {user.is_active}")
            
            # Assert the expected status code
            self.assertEqual(response.status_code, status.HTTP_201_CREATED)
            self.assertIn('user', response.data)
            self.assertIn('tokens', response.data)
            
            print("\n6. Registration test passed successfully!")
            
        except Exception as e:
            print(f"\nERROR: Exception during test: {e}")
            import traceback
            traceback.print_exc()
            raise

if __name__ == "__main__":
    import unittest
    unittest.main()
