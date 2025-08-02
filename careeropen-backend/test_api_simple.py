"""
Simple API test script for CareerOpen backend.
"""
import requests
import json

def print_json_response(response, title):
    """Print JSON response in a readable format."""
    print(f"\n=== {title} ===")
    print(f"Status: {response.status_code}")
    try:
        print(json.dumps(response.json(), indent=2))
    except:
        print(response.text)

def test_endpoints():
    """Test the main API endpoints."""
    base_url = 'http://127.0.0.1:8000/api'
    
    # 1. Test public job listings
    print("\n[1/5] Testing public job listings...")
    response = requests.get(f"{base_url}/jobs/")
    print_json_response(response, "Job Listings")
    
    # 2. Test authentication
    print("\n[2/5] Testing authentication...")
    auth_data = {
        'email': 'jobseeker@example.com',
        'password': 'testpass123'
    }
    response = requests.post(f"{base_url}/token/", json=auth_data)
    print_json_response(response, "Authentication")
    
    if response.status_code != 200:
        print("Authentication failed. Cannot proceed with protected endpoints.")
        return
    
    access_token = response.json().get('access')
    headers = {
        'Authorization': f'Bearer {access_token}'
    }
    
    # 3. Test protected endpoints
    print("\n[3/5] Testing protected endpoints...")
    
    # Get user profile
    response = requests.get(f"{base_url}/auth/me/", headers=headers)
    print_json_response(response, "User Profile")
    
    # Get job applications
    response = requests.get(f"{base_url}/applications/", headers=headers)
    print_json_response(response, "Job Applications")
    
    # 4. Test job search
    print("\n[4/5] Testing job search...")
    response = requests.get(
        f"{base_url}/jobs/search/",
        params={'search': 'developer'},
        headers=headers
    )
    print_json_response(response, "Job Search")
    
    # 5. Test caching
    print("\n[5/5] Testing caching...")
    import time
    
    # First request
    start_time = time.time()
    response1 = requests.get(f"{base_url}/jobs/")
    time1 = (time.time() - start_time) * 1000
    
    # Second request
    start_time = time.time()
    response2 = requests.get(f"{base_url}/jobs/")
    time2 = (time.time() - start_time) * 1000
    
    print(f"First request: {time1:.2f}ms")
    print(f"Second request: {time2:.2f}ms")
    
    if time2 < time1 * 0.8:  # Second request should be at least 20% faster
        print("Caching appears to be working (second request was faster)")
    else:
        print("Caching might not be working as expected")
    
    if response1.text == response2.text:
        print("Cached responses match")
    else:
        print("Cached responses don't match")

if __name__ == "__main__":
    print("=== Starting API Tests ===")
    test_endpoints()
    print("\n=== Test Complete ===")
