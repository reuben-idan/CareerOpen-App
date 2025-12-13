"""
Simple test script to verify API endpoints, caching, and permissions.
"""
import requests
import time

BASE_URL = 'http://127.0.0.1:8000/api'

def print_response(response, message):
    """Print response details."""
    print(f"\n{message}")
    print(f"Status: {response.status_code}")
    try:
        print("Response:", response.json())
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
    print_response(response, "Public category listings:")
    
    # Test company listings
    response = requests.get(f"{BASE_URL}/companies/")
    print_response(response, "Public company listings:")

def test_authentication():
    """Test user authentication."""
    print("\n=== Testing Authentication ===")
    
    # Test login with invalid credentials
    response = requests.post(
        f"{BASE_URL}/token/",
        json={"email": "nonexistent@example.com", "password": "wrongpass"}
    )
    print_response(response, "Login with invalid credentials:")
    
    # Test login with valid employer credentials
    response = requests.post(
        f"{BASE_URL}/token/",
        json={"email": "employer@example.com", "password": "testpass123"}
    )
    print_response(response, "Login with employer credentials:")
    employer_token = response.json().get('access') if response.status_code == 200 else None
    
    # Test login with valid job seeker credentials
    response = requests.post(
        f"{BASE_URL}/token/",
        json={"email": "jobseeker@example.com", "password": "testpass123"}
    )
    print_response(response, "Login with job seeker credentials:")
    jobseeker_token = response.json().get('access') if response.status_code == 200 else None
    
    return employer_token, jobseeker_token

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
        print("✅ Caching appears to be working (second request was faster)")
    else:
        print("⚠️ Caching might not be working as expected")
    
    # Verify responses are the same
    if response1.text == response2.text:
        print("✅ Cached responses match")
    else:
        print("❌ Cached responses don't match")

def main():
    """Run all tests."""
    print("=== Starting API Tests ===")
    
    # Test public endpoints
    test_public_endpoints()
    
    # Test authentication
    employer_token, jobseeker_token = test_authentication()
    
    # Test caching
    test_caching()
    
    print("\n=== Test Complete ===")

if __name__ == "__main__":
    main()
