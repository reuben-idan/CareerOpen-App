import sys
import requests
from pathlib import Path

def check_backend():
    """Check if the backend is running and accessible."""
    print("🔍 Checking backend status...")
    
    # Check if manage.py exists
    manage_py = Path('careeropen-backend/manage.py')
    if not manage_py.exists():
        print("❌ Error: Could not find manage.py in careeropen-backend/")
        print("   Please run this script from the project root directory")
        return False
    
    # Check if port 8000 is in use
    try:
        import socket
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            if s.connect_ex(('127.0.0.1', 8000)) == 0:
                print("✅ Port 8000 is in use")
                
                # Try to access the health endpoint
                try:
                    response = requests.get('http://localhost:8000/api/health/', timeout=5)
                    print(f"✅ Backend is running and accessible (Status: {response.status_code})")
                    print(f"   Response: {response.text}")
                    return True
                except requests.RequestException as e:
                    print(f"❌ Could not connect to backend: {e}")
                    print("   The port is in use but not responding to HTTP requests")
                    return False
            else:
                print("❌ Port 8000 is not in use - backend is not running")
                return False
    except Exception as e:
        print(f"⚠️  Error checking port status: {e}")
        return False

if __name__ == "__main__":
    if not check_backend():
        print("\n🚀 Attempting to start backend...")
        try:
            import subprocess
            # Start the backend in a new process
            subprocess.Popen(
                [sys.executable, 'careeropen-backend/manage.py', 'runserver', '0.0.0.0:8000'],
                creationflags=subprocess.CREATE_NEW_CONSOLE
            )
            print("✅ Backend server starting in a new console window...")
            print("   Please check the new window for any startup errors")
            print("   You can then try accessing: http://localhost:8000/api/health/")
        except Exception as e:
            print(f"❌ Failed to start backend: {e}")
            print("\nPlease try starting the backend manually with:")
            print("   cd careeropen-backend")
            print("   python manage.py runserver 0.0.0.0:8000")
