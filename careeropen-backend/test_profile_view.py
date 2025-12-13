import os
import sys
import django
from pathlib import Path

# Set up Django environment
BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.append(str(BASE_DIR))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

try:
    django.setup()
    print("Django setup complete")
except Exception as e:
    print(f"Error setting up Django: {e}")
    sys.exit(1)

# Import models and views after Django is set up
from django.test import RequestFactory, TestCase
from rest_framework.test import force_authenticate, APIRequestFactory, APIClient
from rest_framework import status

# Import models and views after Django is set up
try:
    from accounts.models import User, UserProfile
    from accounts.views import UserProfileView
    print("Successfully imported models and views")
except ImportError as e:
    print(f"Error importing models or views: {e}")
    sys.exit(1)

def test_profile_view():
    print("Starting profile view test...")
    
    try:
        # Create a test user if it doesn't exist
        try:
            user = User.objects.get(email='test@example.com')
            print(f"Found existing test user: {user.email} (ID: {user.id})")
        except User.DoesNotExist:
            print("Creating test user...")
            user = User.objects.create_user(
                email='test@example.com',
                password='testpass123',
                first_name='Test',
                last_name='User',
                is_active=True
            )
            print(f"Created test user: {user.email} (ID: {user.id})")
        
        # Check if user has a profile
        try:
            profile = UserProfile.objects.get(user=user)
            print(f"Found existing profile for user: {profile}")
        except UserProfile.DoesNotExist:
            print("Creating profile for test user...")
            profile = UserProfile.objects.create(user=user)
            print(f"Created profile: {profile}")
        
        # Test 1: Directly call the view
        print("\n=== Testing with direct view call ===")
        factory = APIRequestFactory()
        request = factory.get('/api/auth/me/')
        force_authenticate(request, user=user)
        
        print("\nCreating view instance...")
        view = UserProfileView.as_view()
        
        print("Calling view...")
        try:
            response = view(request)
            print(f"Response status code: {response.status_code}")
            if hasattr(response, 'data'):
                print(f"Response data: {response.data}")
            else:
                print("No data in response")
                print(f"Response type: {type(response)}")
                print(f"Response dir: {dir(response)}")
        except Exception as e:
            print(f"Error calling UserProfileView: {str(e)}")
            import traceback
            traceback.print_exc()
        
        # Test 2: Use APIClient
        print("\n=== Testing with APIClient ===")
        client = APIClient()
        client.force_authenticate(user=user)
        
        try:
            print("Sending GET request to /api/auth/me/")
            response = client.get('/api/auth/me/')
            print(f"Response status code: {response.status_code}")
            print(f"Response data: {response.data}")
            
            # Print response headers
            print("\nResponse headers:")
            for header, value in response.items():
                print(f"{header}: {value}")
                
        except Exception as e:
            print(f"Error with APIClient: {str(e)}")
            import traceback
            traceback.print_exc()
        
        # Test 3: Make a raw HTTP request
        print("\n=== Testing with raw HTTP request ===")
        from django.test.client import Client
        from django.urls import reverse
        
        client = Client()
        client.force_login(user)
        
        try:
            print("Sending GET request to /api/auth/me/")
            response = client.get('/api/auth/me/', HTTP_ACCEPT='application/json')
            print(f"Response status code: {response.status_code}")
            print(f"Response content: {response.content.decode()}")
            # Use getattr to safely access _headers attribute
            if hasattr(response, '_headers'):
                print(f"Response headers: {response._headers}")
            else:
                print("Response headers: (not available)")
                print(f"Available attributes: {dir(response)}")
        except Exception as e:
            print(f"Error with raw HTTP request: {str(e)}")
            import traceback
            traceback.print_exc()
            
    except Exception as e:
        print(f"Unexpected error in test_profile_view: {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_profile_view()
