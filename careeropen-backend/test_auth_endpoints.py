"""
Test script for authenticated endpoints and cache invalidation.
"""
import os
import json
import time
import sys
import django
import requests

# Set up Django environment
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

# Now import Django modules after setup
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken

def get_auth_headers(user):
    """Generate JWT token and return headers for authenticated requests."""
    refresh = RefreshToken.for_user(user)
    return {
        'Authorization': f'Bearer {refresh.access_token}',
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }

def test_authenticated_search():
    """Test authenticated job search endpoint."""
    print("\n=== Testing Authenticated Endpoints ===")
    
    # Get or create test user
    User = get_user_model()
    try:
        user = User.objects.get(email='test@example.com')
    except User.DoesNotExist:
        print("Creating test user...")
        user = User.objects.create_user(
            email='test@example.com',
            password='testpass123',
            first_name='Test',
            last_name='User',
            role='job_seeker'  # or 'employer' based on what you're testing
        )
    
    # Get auth headers
    headers = get_auth_headers(user)
    base_url = 'http://127.0.0.1:8000/api/jobs'
    
    # Test 1: Search with authentication
    print("\n[1/3] Testing authenticated job search...")
    response = requests.get(
        f"{base_url}/jobs/search/",
        params={'search': 'test'},
        headers=headers
    )
    
    print(f"Status Code: {response.status_code}")
    if response.status_code == 200:
        data = response.json()
        print(f"Found {len(data.get('results', []))} matching jobs")
        if data.get('results'):
            print("First matching job:")
            print(f"- {data['results'][0].get('title')} (ID: {data['results'][0].get('id')})")
    else:
        print(f"Error: {response.text}")
    
    return headers, base_url

def test_cache_invalidation(headers, base_url):
    """Test cache invalidation when updating a job."""
    print("\n[2/3] Testing cache invalidation...")
    
    # Get a job to update
    response = requests.get(
        f"{base_url}/jobs/",
        headers=headers
    )
    
    if response.status_code != 200 or not response.json().get('results'):
        print("No jobs found to test cache invalidation")
        return
    
    job = response.json()['results'][0]
    job_id = job['id']
    original_title = job['title']
    new_title = f"{original_title} UPDATED"
    
    print(f"Updating job {job_id} (original title: {original_title})")
    
    # Update the job
    update_response = requests.patch(
        f"{base_url}/jobs/{job_id}/",
        json={"title": new_title},
        headers=headers
    )
    
    if update_response.status_code == 200:
        print("Job updated successfully")
        
        # Verify the update
        updated_job = update_response.json()
        print(f"New title: {updated_job.get('title')}")
        
        # Check if the update is reflected in the list
        list_response = requests.get(
            f"{base_url}/jobs/",
            headers=headers
        )
        
        if list_response.status_code == 200:
            jobs = list_response.json().get('results', [])
            updated = any(job['id'] == job_id and job['title'] == new_title for job in jobs)
            print(f"Update reflected in job list: {'Yes' if updated else 'No'}")
        
    else:
        print(f"Failed to update job: {update_response.text}")
    
    # Clean up - revert the change
    requests.patch(
        f"{base_url}/jobs/{job_id}/",
        json={"title": original_title},
        headers=headers
    )

def test_cache_performance(headers, base_url):
    """Test cache performance by timing repeated requests."""
    print("\n[3/3] Testing cache performance...")
    
    # First request (may be cached or not)
    start_time = time.time()
    response = requests.get(
        f"{base_url}/jobs/",
        headers=headers
    )
    first_request_time = time.time() - start_time
    
    # Second request (should be from cache)
    start_time = time.time()
    response = requests.get(
        f"{base_url}/jobs/",
        headers=headers
    )
    second_request_time = time.time() - start_time
    
    print(f"First request: {first_request_time:.4f} seconds")
    print(f"Second request: {second_request_time:.4f} seconds")
    
    if first_request_time > 0 and second_request_time > 0:
        improvement = (first_request_time - second_request_time) / first_request_time * 100
        print(f"Performance improvement: {improvement:.1f}% faster with cache")

if __name__ == "__main__":
    # Set up Django environment
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
    import django
    django.setup()
    
    print("=== Starting Authentication and Cache Tests ===")
    
    try:
        # Run authenticated tests
        headers, base_url = test_authenticated_search()
        
        # Test cache invalidation
        test_cache_invalidation(headers, base_url)
        
        # Test cache performance
        test_cache_performance(headers, base_url)
        
    except Exception as e:
        print(f"\nError during tests: {str(e)}")
    
    print("\n=== Test Complete ===")
