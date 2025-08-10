import requests
import sys

def test_health_endpoint():
    url = "http://localhost:8000/api/health/"
    print(f"Testing health endpoint at {url}...")
    
    try:
        response = requests.get(url, timeout=5)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
        return response.status_code == 200
    except requests.exceptions.RequestException as e:
        print(f"Error: {e}")
        return False

if __name__ == "__main__":
    if test_health_endpoint():
        print("✅ Health check passed!")
        sys.exit(0)
    else:
        print("❌ Health check failed!")
        sys.exit(1)
