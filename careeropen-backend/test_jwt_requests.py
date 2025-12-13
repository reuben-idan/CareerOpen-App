import requests
import json

# Test JWT authentication
base_url = 'http://localhost:8000/api'
email = 'testuser@example.com'
password = 'testpass123'

print("Testing JWT authentication...")

# Test token obtain
print("\n1. Getting JWT token...")
try:
    response = requests.post(
        f"{base_url}/token/",
        json={"email": email, "password": password},
        headers={"Content-Type": "application/json"}
    )
    print(f"Status Code: {response.status_code}")
    print("Response:", json.dumps(response.json(), indent=2))
    
    if response.status_code == 200:
        access_token = response.json().get('access')
        refresh_token = response.json().get('refresh')
        
        # Test token refresh
        print("\n2. Testing token refresh...")
        refresh_response = requests.post(
            f"{base_url}/token/refresh/",
            json={"refresh": refresh_token},
            headers={"Content-Type": "application/json"}
        )
        print(f"Status Code: {refresh_response.status_code}")
        print("Response:", json.dumps(refresh_response.json(), indent=2))
        
        # Test protected endpoint
        print("\n3. Testing protected endpoint...")
        protected_response = requests.get(
            f"{base_url}/jobs/",
            headers={
                "Authorization": f"Bearer {access_token}",
                "Content-Type": "application/json"
            }
        )
        print(f"Status Code: {protected_response.status_code}")
        if protected_response.status_code == 200:
            print("Successfully accessed protected endpoint!")
            print("Response:", json.dumps(protected_response.json(), indent=2))
        else:
            print("Failed to access protected endpoint")
            print("Response:", protected_response.text)
        
except Exception as e:
    print(f"Error during JWT test: {str(e)}")
