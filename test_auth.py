import requests
import json
import sys
import os

# Configuration
BASE_URL = "http://localhost:8000/api/"
LOGIN_URL = f"{BASE_URL}auth/login/"
PROFILE_URL = f"{BASE_URL}users/me/"

# Test user credentials
TEST_USER = {
    "email": "test@example.com",
    "password": "testpass123"
}

def print_section(title):
    print(f"\n{'='*50}")
    print(f" {title}".upper())
    print(f"{'='*50}")

def test_health_check():
    """Test if the backend is running and healthy."""
    print_section("Testing Health Check")
    try:
        response = requests.get(f"{BASE_URL}health/")
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        return response.status_code == 200
    except Exception as e:
        print(f"Error connecting to backend: {e}")
        return False

def test_login():
    """Test user login and get access token."""
    print_section("Testing Login")
    try:
        print(f"URL: {LOGIN_URL}")
        print(f"Payload: {json.dumps(TEST_USER, indent=2)}")
        
        response = requests.post(LOGIN_URL, json=TEST_USER)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            print("✅ Login successful!")
            tokens = response.json()
            print(f"Access Token: {tokens.get('access', 'Not provided')}")
            print(f"Refresh Token: {tokens.get('refresh', 'Not provided')}")
            return tokens.get('access')
        else:
            print("❌ Login failed!")
            print(f"Response: {response.text}")
            return None
    except Exception as e:
        print(f"❌ Error during login: {e}")
        return None

def test_protected_endpoint(access_token):
    """Test accessing a protected endpoint with the access token."""
    if not access_token:
        print("Skipping protected endpoint test - no access token")
        return
        
    print_section("Testing Protected Endpoint")
    try:
        headers = {
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json"
        }
        print(f"URL: {PROFILE_URL}")
        print(f"Headers: {json.dumps(headers, indent=2)}")
        
        response = requests.get(PROFILE_URL, headers=headers)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            print("✅ Successfully accessed protected endpoint!")
            print("User Profile:")
            print(json.dumps(response.json(), indent=2))
        else:
            print("❌ Failed to access protected endpoint")
            print(f"Response: {response.text}")
    except Exception as e:
        print(f"❌ Error accessing protected endpoint: {e}")

def main():
    print("🔒 Starting Authentication Tests 🔒")
    
    # First check if backend is running
    if not test_health_check():
        print("\n❌ Backend is not running or not healthy. Please start the backend server first.")
        print("   Run: python manage.py runserver 0.0.0.0:8000")
        sys.exit(1)
    
    # Test login
    access_token = test_login()
    
    # If login was successful, test protected endpoint
    if access_token:
        test_protected_endpoint(access_token)
    
    print("\n✅ Authentication tests completed!")

if __name__ == "__main__":
    main()
