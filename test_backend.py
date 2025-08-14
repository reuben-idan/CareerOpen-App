import requests
import sys

def test_backend():
    url = 'http://localhost:8000/api/health/'
    try:
        response = requests.get(url, timeout=5)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        return response.status_code == 200
    except requests.exceptions.RequestException as e:
        print(f"Error connecting to {url}: {e}")
        return False

if __name__ == "__main__":
    print("Testing backend connection...")
    if test_backend():
        print("✅ Backend is running and accessible")
        sys.exit(0)
    else:
        print("❌ Could not connect to backend")
        sys.exit(1)
