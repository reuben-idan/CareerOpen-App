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
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient, APIRequestFactory
from django.contrib.auth import get_user_model
from accounts.views import UserLoginView

User = get_user_model()

def test_login_direct():
    """Test login functionality directly using the view."""
    print("\n=== Starting direct login test ===")
    
    try:
        # Create a test user
        user = User.objects.create_user(
            email='testuser@example.com',
            password='testpass123',
            first_name='Test',
            last_name='User',
            is_active=True
        )
        print("Created test user")
    except Exception as e:
        print(f"Error creating test user: {e}")
        return
    
    try:
        # Initialize the test client
        factory = APIRequestFactory()
        view = UserLoginView.as_view()
        
        # Prepare login data
        login_data = {
            'email': 'testuser@example.com',
            'password': 'testpass123'
        }
        
        print("Sending login request...")
        request = factory.post('/api/accounts/login/', data=login_data, format='json')
        response = view(request)
        
        # Check the response
        print(f"Status code: {response.status_code}")
        print(f"Response data: {response.data}")
        
        assert response.status_code == status.HTTP_200_OK
        assert 'access' in response.data
        assert 'refresh' in response.data
        assert 'user' in response.data
        
        print("Direct login test passed successfully!")
        
    except Exception as e:
        print(f"Error during login test: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_login_direct()
