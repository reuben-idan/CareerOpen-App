"""
Standalone test for login functionality.
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
django.setup()

# Now import Django and DRF components
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model

User = get_user_model()

def test_login():
    """Test login functionality."""
    print("\n=== Starting login test ===")
    
    # Create a test user
    user = User.objects.create_user(
        email='testuser@example.com',
        password='testpass123',
        first_name='Test',
        last_name='User',
        is_active=True
    )
    print("Created test user")
    
    # Initialize the test client
    client = APIClient()
    
    # Test login
    url = reverse('user-login')
    login_data = {
        'email': 'testuser@example.com',
        'password': 'testpass123'
    }
    
    print("Sending login request...")
    response = client.post(url, data=login_data, format='json')
    
    # Check the response
    print(f"Status code: {response.status_code}")
    print(f"Response data: {response.data}")
    
    assert response.status_code == status.HTTP_200_OK
    assert 'access' in response.data
    assert 'refresh' in response.data
    assert 'user' in response.data
    assert response.data['user']['email'] == 'testuser@example.com'
    assert 'password' not in response.data['user']
    
    print("Login test passed successfully!")

if __name__ == "__main__":
    test_login()
