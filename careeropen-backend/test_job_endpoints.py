"""
Test script to verify job-related API endpoints.
"""
import requests
import json

def test_job_endpoints():
    """Test job listing and detail endpoints."""
    base_url = 'http://127.0.0.1:8000/api/jobs'
    
    # Test job listing
    print("\n[1/2] Testing job listing endpoint...")
    response = requests.get(
        f"{base_url}/jobs/",
        headers={'Accept': 'application/json'}
    )
    
    print(f"Status Code: {response.status_code}")
    try:
        data = response.json()
        print(f"Found {len(data.get('results', []))} jobs")
        print("First few jobs:")
        for job in data.get('results', [])[:3]:  # Show first 3 jobs if available
            print(f"- ID: {job.get('id')}, Title: {job.get('title')}")
            
            # Test job detail for each job
            print(f"  Testing detail endpoint for job {job.get('id')}...")
            detail_response = requests.get(
                f"{base_url}/jobs/{job.get('id')}/",
                headers={'Accept': 'application/json'}
            )
            print(f"  Detail status: {detail_response.status_code}")
            
    except json.JSONDecodeError:
        print("Response Text:")
        print(response.text)
    
    # Test job search
    print("\n[2/2] Testing job search endpoint...")
    response = requests.get(
        f"{base_url}/search/",
        params={'search': 'test'},
        headers={'Accept': 'application/json'}
    )
    
    print(f"Status Code: {response.status_code}")
    try:
        data = response.json()
        print(f"Found {len(data.get('results', []))} matching jobs")
    except json.JSONDecodeError:
        print("Response Text:")
        print(response.text)

if __name__ == "__main__":
    test_job_endpoints()
