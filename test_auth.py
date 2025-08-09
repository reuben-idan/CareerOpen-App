import requests
import json

# Test login endpoint
login_url = "http://localhost:8000/api/token/"
login_data = {
    "email": "test@example.com",
    "password": "testpass123"
}

try:
    print("Testing login...")
    response = requests.post(login_url, json=login_data)
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 200:
        print("Login successful!")
        tokens = response.json()
        print("Access Token:", tokens.get('access'))
        print("Refresh Token:", tokens.get('refresh'))
        
        # Test protected endpoint
        print("\nTesting protected endpoint...")
        headers = {
            "Authorization": f"Bearer {tokens['access']}",
            "Content-Type": "application/json"
        }
        profile_response = requests.get("http://localhost:8000/api/users/me/", headers=headers)
        print(f"Profile Status Code: {profile_response.status_code}")
        print("User Profile:", json.dumps(profile_response.json(), indent=2))
    else:
        print("Login failed!")
        print("Response:", response.text)

except Exception as e:
    print(f"Error: {str(e)}")
