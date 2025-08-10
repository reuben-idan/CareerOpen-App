import requests
import json
import sys

def test_login():
    # Test data - update these with valid credentials if needed
    test_cases = [
        {
            "name": "Valid Login",
            "url": "http://localhost:8000/api/auth/login/",
            "data": {
                "email": "test@example.com",
                "password": "testpass123"
            },
            "expected_status": 200
        },
        {
            "name": "Invalid Credentials",
            "url": "http://localhost:8000/api/auth/login/",
            "data": {
                "email": "wrong@example.com",
                "password": "wrongpassword"
            },
            "expected_status": 400
        },
        {
            "name": "Missing Password",
            "url": "http://localhost:8000/api/auth/login/",
            "data": {
                "email": "test@example.com"
            },
            "expected_status": 400
        }
    ]
    
    headers = {
        "Content-Type": "application/json",
        "Accept": "application/json"
    }
    
    for test in test_cases:
        print(f"\n{'='*50}")
        print(f"TEST: {test['name']}")
        print(f"URL: {test['url']}")
        print("-" * 50)
        
        try:
            print(f"Sending POST request to {test['url']}")
            print(f"Request data: {json.dumps(test['data'], indent=2)}")
            
            response = requests.post(
                test['url'], 
                json=test['data'], 
                headers=headers, 
                timeout=10
            )
            
            print(f"\nResponse Status Code: {response.status_code}")
            print("Response Headers:")
            for key, value in response.headers.items():
                print(f"  {key}: {value}")
                
            try:
                response_json = response.json()
                print("\nResponse Body (JSON):")
                print(json.dumps(response_json, indent=2))
            except ValueError:
                print("\nResponse Body (raw):")
                print(response.text)
            
            if response.status_code == test['expected_status']:
                print("\n✅ Test PASSED")
            else:
                print(f"\n❌ Test FAILED - Expected status {test['expected_status']} but got {response.status_code}")
                
        except requests.exceptions.RequestException as e:
            print(f"\n❌ Request failed: {str(e)}")
            if hasattr(e, 'response') and e.response is not None:
                print(f"Response status code: {e.response.status_code}")
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
