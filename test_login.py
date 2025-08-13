import requests
import json
import sys

def test_login():
    # Test data - update these with valid credentials if needed
    test_cases = [
        {
            "name": "Valid Login",
            "url": "http://localhost:8000/api/v1/token/",
            "data": {
                "username": "testuser",  # Note: JWT uses 'username' instead of 'email'
                "password": "testpass123"
            },
            "expected_status": 200
        },
        {
            "name": "Invalid Credentials",
            "url": "http://localhost:8000/api/v1/token/",
            "data": {
                "username": "wronguser",
                "password": "wrongpassword"
            },
            "expected_status": 401  # Unauthorized for invalid credentials
        },
        {
            "name": "Missing Password",
            "url": "http://localhost:8000/api/v1/token/",
            "data": {
                "username": "testuser"
            },
            "expected_status": 400  # Bad request for missing required field
        }
    ]
    
    headers = {
        "Content-Type": "application/json",
        "Accept": "application/json"
    }
    
    for test in test_cases:
        print(f"\n{'='*80}")
        print(f"TEST: {test['name']}")
        print(f"URL: {test['url']}")
        print("-" * 80)
        
        try:
            print("\n=== REQUEST ===")
            print(f"URL: {test['url']}")
            print("Method: POST")
            print("Headers:", json.dumps(headers, indent=2))
            print("Body:", json.dumps(test['data'], indent=2))
            
            # Make the request
            print("\n=== SENDING REQUEST ===")
            response = requests.post(
                test['url'], 
                json=test['data'], 
                headers=headers, 
                timeout=10
            )
            
            print("\n=== RESPONSE ===")
            print(f"Status Code: {response.status_code}")
            print("Headers:")
            for key, value in response.headers.items():
                print(f"  {key}: {value}")
            
            # Try to parse JSON response
            try:
                response_json = response.json()
                print("\nResponse Body (JSON):")
                print(json.dumps(response_json, indent=2))
            except ValueError:
                print("\nResponse Body (raw):")
                print(response.text)
            
            # Check if the response status code matches the expected status
            if response.status_code == test['expected_status']:
                print("\n✅ Test PASSED")
                
                # If this is a successful login, save the access and refresh tokens
                if response.status_code == 200 and 'access' in response_json:
                    print("\n🔑 Login successful! Tokens received:")
                    print(f"Access Token: {response_json.get('access', 'N/A')}")
                    print(f"Refresh Token: {response_json.get('refresh', 'N/A')}")
            else:
                print(f"\n❌ Test FAILED - Expected status {test['expected_status']} but got {response.status_code}")
                
                # Provide more context for common error statuses
                if response.status_code == 400:
                    print("  - Bad Request: The server could not understand the request.")
                elif response.status_code == 401:
                    print("  - Unauthorized: Authentication failed or not provided.")
                elif response.status_code == 403:
                    print("  - Forbidden: You don't have permission to access this resource.")
                elif response.status_code == 404:
                    print("  - Not Found: The requested resource was not found.")
                elif response.status_code == 500:
                    print("  - Server Error: The server encountered an internal error.")
                
        except requests.exceptions.RequestException as e:
            print(f"\n❌ Request failed: {str(e)}")
            if hasattr(e, 'response') and e.response is not None:
                print(f"Response status code: {e.response.status_code}")
                print("Response headers:", json.dumps(dict(e.response.headers), indent=2))
                print("Response content:")
                try:
                    print(json.dumps(e.response.json(), indent=2))
                except ValueError:
                    print(e.response.text)
            continue
        except Exception as e:
            print(f"\n❌ Unexpected error: {str(e)}")
            import traceback
            traceback.print_exc()

if __name__ == "__main__":
    print("Starting login tests...")
    test_login()
    print("\nTests completed.")
