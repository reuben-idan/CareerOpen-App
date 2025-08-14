"""
Simple test script to check login endpoint functionality.
"""
import requests
import json
import sys

def test_login():
    """Test the login endpoint with sample credentials."""
    url = 'http://localhost:8000/api/auth/login/'
    
    # Test credentials - update these with valid test user credentials
    test_data = {
        'email': 'test@example.com',  # Replace with actual test email
        'password': 'testpassword123'  # Replace with actual test password
    }
    
    print(f"Testing login endpoint: {url}")
    print(f"Using test email: {test_data['email']}")
    
    try:
        # Make the request
        print("\nSending POST request...")
        response = requests.post(url, json=test_data)
        
        # Print response details
        print(f"\nStatus Code: {response.status_code}")
        print("\nResponse Headers:")
        for key, value in response.headers.items():
            print(f"  {key}: {value}")
        
        # Try to parse JSON response
        try:
            response_json = response.json()
            print("\nResponse JSON:")
            print(json.dumps(response_json, indent=2))
        except ValueError:
            print("\nCould not parse JSON response. Raw response:")
            print(response.text[:500])  # Print first 500 chars if not JSON
        
        return response.status_code == 200
        
    except requests.exceptions.RequestException as e:
        print(f"\nRequest failed: {str(e)}")
        return False
    except Exception as e:
        print(f"\nUnexpected error: {str(e)}")
        return False

if __name__ == "__main__":
    print("Starting authentication test...\n")
    success = test_login()
    
    print("\n" + "="*50)
    if success:
        print("✅ Test completed successfully!")
    else:
        print("❌ Test failed. Check the output above for details.")
    print("="*50)
