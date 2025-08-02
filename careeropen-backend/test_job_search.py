"""
Test script to verify the job search endpoint.
"""
import requests
import json

def test_job_search():
    """Test the job search endpoint."""
    base_url = 'http://127.0.0.1:8000/api/jobs'
    
    print("Testing job search endpoint...")
    response = requests.get(
        f"{base_url}/search/",
        params={'search': 'developer'},
        headers={'Accept': 'application/json'}
    )
    
    print(f"Status Code: {response.status_code}")
    try:
        print("Response JSON:")
        print(json.dumps(response.json(), indent=2))
    except json.JSONDecodeError:
        print("Response Text:")
        print(response.text)
    
    # Also test with a known job ID to verify the endpoint is working
    print("\nTesting job detail endpoint...")
    response = requests.get(
        f"{base_url}/1/",  # Assuming there's at least one job with ID 1
        headers={'Accept': 'application/json'}
    )
    
    print(f"Status Code: {response.status_code}")
    try:
        print("Response JSON:")
        print(json.dumps(response.json(), indent=2))
    except json.JSONDecodeError:
        print("Response Text:")
        print(response.text)

if __name__ == "__main__":
    test_job_search()
