import requests
import time

# Base URL for the API
BASE_URL = 'http://localhost:8000/api/'

def test_endpoint_caching(endpoint, name):
    print(f"\nTesting {name} endpoint: {endpoint}")
    print("-" * 60)
    
    # First request (should be a cache miss)
    start_time = time.time()
    response = requests.get(f"{BASE_URL}{endpoint}")
    first_request_time = (time.time() - start_time) * 1000  # Convert to milliseconds
    print(f"First request: {first_request_time:.2f}ms - Status: {response.status_code}")
    
    # Second request (should be a cache hit if caching is working)
    start_time = time.time()
    response = requests.get(f"{BASE_URL}{endpoint}")
    second_request_time = (time.time() - start_time) * 1000  # Convert to milliseconds
    print(f"Second request: {second_request_time:.2f}ms - Status: {response.status_code}")
    
    # Check if caching is working (second request should be faster)
    if second_request_time < first_request_time * 0.8:  # 80% of first request time
        print("✅ Caching appears to be working (second request was faster)")
    else:
        print("⚠️  Caching may not be working as expected")
    
    # Check for cache headers
    if 'X-Cache' in response.headers:
        print(f"Cache header: {response.headers['X-Cache']}")
    else:
        print("No X-Cache header found in response")
    
    print()

if __name__ == "__main__":
    # Test different endpoints
    endpoints = [
        ('categories/', 'Categories List'),
        ('jobs/', 'Jobs List'),
        ('companies/', 'Companies List'),
    ]
    
    print("Testing API Endpoint Caching")
    print("=" * 60)
    
    for endpoint, name in endpoints:
        test_endpoint_caching(endpoint, name)
