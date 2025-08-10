#!/usr/bin/env python3
"""
Test script to debug the login endpoint.
This script sends a POST request to the login endpoint and prints detailed information.
"""
import os
import sys
import json
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configuration
BASE_URL = "http://localhost:8000/api"
LOGIN_URL = f"{BASE_URL}/auth/login/"

# Test credentials
TEST_EMAIL = os.getenv('TEST_EMAIL', 'test@example.com')
TEST_PASSWORD = os.getenv('TEST_PASSWORD', 'testpass123')

def test_login():
    print("=== Testing Login Endpoint ===")
    print(f"URL: {LOGIN_URL}")
    print(f"Email: {TEST_EMAIL}")
    
    try:
        # Prepare the request data
        data = {
            'email': TEST_EMAIL,
            'password': TEST_PASSWORD
        }
        
        # Set headers
        headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
        
        print("\nSending login request...")
        response = requests.post(
            LOGIN_URL,
            json=data,
            headers=headers,
            timeout=10
        )
        
        # Print response details
        print(f"\nResponse Status Code: {response.status_code}")
        print("Response Headers:")
        for key, value in response.headers.items():
            print(f"  {key}: {value}")
            
        # Try to parse JSON response
        try:
            json_response = response.json()
            print("\nResponse JSON:")
            print(json.dumps(json_response, indent=2))
        except ValueError:
            print("\nResponse Content (not JSON):")
            print(response.text)
            
        # Check for error details in response
        if response.status_code >= 400:
            print("\n=== ERROR DETAILS ===")
            print(f"Status: {response.status_code}")
            if response.headers.get('Content-Type', '').startswith('application/json'):
                error_data = response.json()
                if 'detail' in error_data:
                    print(f"Error: {error_data['detail']}")
                if 'error' in error_data:
                    print(f"Error details: {error_data['error']}")
            else:
                print(f"Response: {response.text[:500]}")
        
        return response.status_code == 200
        
    except requests.exceptions.RequestException as e:
        print(f"\n=== REQUEST FAILED ===")
        print(f"Error: {str(e)}")
        if hasattr(e, 'response') and e.response is not None:
            print(f"Status Code: {e.response.status_code}")
            print(f"Response: {e.response.text}")
        return False

def main():
    print("Starting login test...")
    success = test_login()
    
    if success:
        print("\n=== LOGIN TEST SUCCEEDED ===")
    else:
        print("\n=== LOGIN TEST FAILED ===")
        print("Check the logs for more details.")
        
    # Wait for user input before exiting
    input("\nPress Enter to exit...")

if __name__ == "__main__":
    main()
