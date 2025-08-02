"""
Test script to verify job-related API endpoints with correct URL structure.
"""
import requests
import json

def test_job_endpoints():
    """Test job listing and detail endpoints with correct URL structure."""
    base_url = 'http://127.0.0.1:8000/api/jobs'
    
    # Test job listing
    print("\n[1/3] Testing job listing endpoint...")
    response = requests.get(
        f"{base_url}/jobs/",
        headers={'Accept': 'application/json'}
    )
    
    print(f"Status Code: {response.status_code}")
    try:
        data = response.json()
        print(f"Found {len(data.get('results', []))} jobs")
        if data.get('results'):
            print("First job:")
            job = data['results'][0]
            print(f"- ID: {job.get('id')}, Title: {job.get('title')}")
            
            # Test job detail for the first job
            print(f"\n[2/3] Testing job detail endpoint...")
            detail_response = requests.get(
                f"{base_url}/jobs/{job.get('id')}/",
                headers={'Accept': 'application/json'}
            )
            print(f"Detail status: {detail_response.status_code}")
            if detail_response.status_code == 200:
                print("Job detail retrieved successfully!")
                print(f"Title: {detail_response.json().get('title')}")
    except json.JSONDecodeError:
        print("Response Text:")
        print(response.text)
    
    # Test job search (using the correct URL from the view)
    print("\n[3/3] Testing job search endpoint...")
    search_url = f"{base_url}/jobs/search/"
    print(f"Using search URL: {search_url}")
    response = requests.get(
        search_url,
        params={'search': 'test'},
        headers={'Accept': 'application/json'}
    )
    
    print(f"Status Code: {response.status_code}")
    try:
        data = response.json()
        print(f"Found {len(data.get('results', []))} matching jobs")
        if data.get('results'):
            print("Matching jobs:")
            for job in data['results'][:3]:  # Show up to 3 matching jobs
                print(f"- {job.get('title')} (ID: {job.get('id')})")
    except json.JSONDecodeError:
        print("Response Text:")
        print(response.text)

if __name__ == "__main__":
    print("=== Testing Job Endpoints ===")
    test_job_endpoints()
    print("\n=== Test Complete ===")
