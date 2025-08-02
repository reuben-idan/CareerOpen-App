import os
import subprocess
import sys

def main():
    # Set up environment variables
    os.environ['SECRET_KEY'] = 'test-secret-key-for-development-only'
    os.environ['DEBUG'] = 'True'
    os.environ['ALLOWED_HOSTS'] = 'localhost,127.0.0.1'
    os.environ['CORS_ALLOWED_ORIGINS'] = 'http://localhost:3000,http://127.0.0.1:3000'
    
    # Start the development server
    print("Starting Django development server...")
    print("Press Ctrl+C to stop the server")
    print("\nYou can test the API endpoints at:")
    print("http://localhost:8000/api/categories/")
    print("http://localhost:8000/api/jobs/")
    print("http://localhost:8000/api/companies/")
    
    try:
        subprocess.run([sys.executable, 'manage.py', 'runserver'], check=True)
    except KeyboardInterrupt:
        print("\nServer stopped by user")
    except Exception as e:
        print(f"Error starting server: {e}")

if __name__ == "__main__":
    main()
