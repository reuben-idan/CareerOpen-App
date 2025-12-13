"""
Improved test script for CareerOpen API endpoints.
Verifies authentication, endpoints, and caching.
"""
import requests
import time
import json

# Base URL for the API
BASE_URL = 'http://127.0.0.1:8000/api'

def print_response(response, message):
    """Print response details in a readable format."""
    print(f"\n{message}")
    print(f"Status: {response.status_code}")
    try:
        print("Response:", json.dumps(response.json(), indent=2))
    except:
        print("Response:", response.text)

def test_public_endpoints():
    """Test public endpoints that don't require authentication."""
    print("\n=== Testing Public Endpoints ===")
    
    # Test job listings
    response = requests.get(f"{BASE_URL}/jobs/")
    print_response(response, "Public job listings:")
    
    # Test category listings
    response = requests.get(f"{BASE_URL}/categories/")
    print_response(response, "Category listings:")
    
    # Test company listings
    response = requests.get(f"{BASE_URL}/companies/")
    print_response(response, "Company listings:")

def test_authentication():
    """Test user authentication."""
    print("\n=== Testing Authentication ===")
    
    # Test login with invalid credentials
    response = requests.post(
        f"{BASE_URL}/token/",
        json={"email": "nonexistent@example.com", "password": "wrongpass"}
    )
    print_response(response, "Login with invalid credentials:")
    
    # Test login with valid credentials
    test_users = [
        ("jobseeker@example.com", "testpass123"),
        ("employer@example.com", "testpass123"),
        ("admin@example.com", "adminpass123")
    ]
    
    tokens = {}
    for email, password in test_users:
        response = requests.post(
            f"{BASE_URL}/token/",
            json={"email": email, "password": password}
        )
        if response.status_code == 200:
            tokens[email] = response.json().get('access')
            print(f"✅ Successfully logged in as {email}")
        else:
            print(f"❌ Failed to log in as {email}")
    
    return tokens

def test_caching():
    """Test if caching is working."""
    print("\n=== Testing Caching ===")
    
    # First request
    start_time = time.time()
    response1 = requests.get(f"{BASE_URL}/jobs/")
    time1 = (time.time() - start_time) * 1000
    print(f"First request: {time1:.2f}ms")
    
    # Second request (should be faster if cached)
    start_time = time.time()
    response2 = requests.get(f"{BASE_URL}/jobs/")
    time2 = (time.time() - start_time) * 1000
    print(f"Second request: {time2:.2f}ms")
    
    # Compare response times and content
    if time2 < time1 * 0.8:  # Second request should be at least 20% faster
        print("Caching appears to be working (second request was faster)")
    else:
        print("Caching might not be working as expected")
    
    # Verify responses are the same
    if response1.text == response2.text:
        print("Cached responses match")
    else:
        print("Cached responses don't match")

def test_protected_endpoints(tokens):
    """Test endpoints that require authentication."""
    print("\n=== Testing Protected Endpoints ===")
    
    for email, token in tokens.items():
        print(f"\nTesting as {email}:")
        headers = {"Authorization": f"Bearer {token}"}
        
        # Test getting user profile
        response = requests.get(
            f"{BASE_URL}/auth/me/",
            headers=headers
        )
        print_response(response, "User profile:")
        
        # Test getting job applications (for job seekers)
        response = requests.get(
            f"{BASE_URL}/applications/",
            headers=headers
        )
        print_response(response, "Job applications:")

def main():
    """Run all tests."""
    print("=== Starting API Tests ===")
    
    # Test public endpoints
    test_public_endpoints()
    
    # Test authentication
    print("\n=== Testing Authentication ===")
    tokens = test_authentication()
    
    if tokens:
        # Test protected endpoints
        test_protected_endpoints(tokens)
    
    # Test caching
    test_caching()
    
    print("\n=== Test Complete ===")

if __name__ == "__main__":
    main()
