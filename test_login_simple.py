import requests
import json

# Test login endpoint
login_url = "http://localhost:8000/api/auth/login/"

# Test user credentials
test_user = {
    "email": "test@example.com",
    "password": "testpassword123"
}

try:
    print(f"Sending login request to {login_url}")
    response = requests.post(login_url, json=test_user)
    
    print(f"Status Code: {response.status_code}")
    print("Response Headers:")
    for header, value in response.headers.items():
        print(f"  {header}: {value}")
    
    try:
        response_data = response.json()
        print("Response Data:")
        print(json.dumps(response_data, indent=2))
    except ValueError:
        print("Response Content (not JSON):")
        print(response.text)
    
except requests.exceptions.RequestException as e:
    print(f"Request failed: {e}")
    if hasattr(e, 'response') and e.response is not None:
        print(f"Status Code: {e.response.status_code}")
        print(f"Response: {e.response.text}")

except Exception as e:
    print(f"An unexpected error occurred: {e}")
    import traceback
    traceback.print_exc()
