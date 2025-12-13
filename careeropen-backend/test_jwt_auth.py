import os
import django
from django.conf import settings

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

# Override database settings for test
os.environ['DB_ENGINE'] = 'postgres'
os.environ['DB_NAME'] = 'careeropen'
os.environ['DB_USER'] = 'postgres'
os.environ['DB_PASSWORD'] = 'postgres'
os.environ['DB_HOST'] = 'localhost'
os.environ['DB_PORT'] = '5432'

# Initialize Django
django.setup()

from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
import requests

# Create test user if it doesn't exist
User = get_user_model()
email = 'testuser@example.com'
password = 'testpass123'

if not User.objects.filter(email=email).exists():
    user = User.objects.create_user(
        email=email,
        first_name='Test',
        last_name='User',
        password=password,
        is_employer=False
    )
    print(f"Created test user: {email} / {password}")
else:
    user = User.objects.get(email=email)
    print(f"Using existing test user: {email}")

# Test JWT authentication
base_url = 'http://localhost:8000/api'

# Test token obtain
print("\nTesting JWT token obtain:")
try:
    response = requests.post(
        f"{base_url}/token/",
        json={"email": email, "password": password}
    )
    print(f"Status Code: {response.status_code}")
    print("Response:", response.json())
    
    if response.status_code == 200:
        access_token = response.json().get('access')
        refresh_token = response.json().get('refresh')
        
        # Test token refresh
        print("\nTesting token refresh:")
        refresh_response = requests.post(
            f"{base_url}/token/refresh/",
            json={"refresh": refresh_token}
        )
        print(f"Status Code: {refresh_response.status_code}")
        print("Response:", refresh_response.json())
        
        # Test protected endpoint
        print("\nTesting protected endpoint:")
        protected_response = requests.get(
            f"{base_url}/jobs/",
            headers={"Authorization": f"Bearer {access_token}"}
        )
        print(f"Status Code: {protected_response.status_code}")
        print("Response:", protected_response.json())
        
except Exception as e:
    print(f"Error during JWT test: {str(e)}")
