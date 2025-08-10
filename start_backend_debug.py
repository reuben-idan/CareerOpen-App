import os
import sys
import subprocess
from pathlib import Path

def start_backend():
    print("🚀 Starting Django backend with debug settings...")
    
    # Set environment variables
    env = os.environ.copy()
    env['PYTHONPATH'] = str(Path.cwd() / 'careeropen-backend')
    env['DJANGO_SETTINGS_MODULE'] = 'core.settings'
    env['DEPLOY_ENV'] = 'development'
    env['DEBUG'] = 'True'
    env['ALLOWED_HOSTS'] = 'localhost,127.0.0.1,0.0.0.0'
    
    try:
        # Start the server with auto-reload
        cmd = [
            'python', 'manage.py', 'runserver',
            '--noreload',  # Disable auto-reload for cleaner output
            '--nothreading',  # Disable threading for better error visibility
            '--verbosity', '2'  # More verbose output
        ]
        
        print("\n🔧 Environment:")
        for key in ['PYTHONPATH', 'DJANGO_SETTINGS_MODULE', 'DEPLOY_ENV', 'DEBUG']:
            print(f"  {key}: {env.get(key)}")
            
        print("\n⚡ Starting server...")
        subprocess.run(cmd, cwd='careeropen-backend', env=env, check=True)
        
    except subprocess.CalledProcessError as e:
        print(f"\n❌ Error starting server: {e}")
        print("\n🔍 Common solutions:")
        print("1. Make sure all dependencies are installed: pip install -r requirements.txt")
        print("2. Check for database migrations: python manage.py migrate")
        print("3. Verify no other process is using port 8000")
        print("4. Check for syntax errors in your Django code")
        return False
    except Exception as e:
        print(f"\n❌ Unexpected error: {e}")
        return False
    
    return True

if __name__ == "__main__":
    print("🔍 Checking Python version...")
    print(f"Python {sys.version}")
    
    # Check if we're in the right directory
    if not (Path.cwd() / 'careeropen-backend' / 'manage.py').exists():
        print("❌ Error: Please run this script from the project root directory")
        print("   Expected to find: careeropen-backend/manage.py")
        sys.exit(1)
        
    print("✅ Found manage.py")
    start_backend()
