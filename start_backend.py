import os
import sys
import subprocess
from pathlib import Path

def setup_environment():
    """Set up environment variables for Django."""
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
    os.environ['SECRET_KEY'] = 'django-insecure-test-key-1234567890'
    os.environ['DEBUG'] = 'True'
    os.environ['ALLOWED_HOSTS'] = 'localhost,127.0.0.1'
    os.environ['DEPLOY_ENV'] = 'development'

def start_django_server():
    """Start the Django development server."""
    # Change to the backend directory
    backend_dir = Path(__file__).parent / 'careeropen-backend'
    os.chdir(backend_dir)
    
    # Install required packages
    print("Installing required packages...")
    subprocess.check_call([sys.executable, '-m', 'pip', 'install', '-r', 'requirements.txt'])
    
    # Run migrations
    print("\nRunning migrations...")
    subprocess.check_call([sys.executable, 'manage.py', 'migrate'])
    
    # Create a superuser if it doesn't exist
    print("\nEnsuring test user exists...")
    create_user_script = """
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
import django
django.setup()
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(email='test@example.com').exists():
    user = User.objects.create_user(
        email='test@example.com',
        first_name='Test',
        last_name='User',
        password='testpass123',
        is_employer=False,
        is_active=True
    )
    print(f"Created test user: {user.email}")
else:
    print("Test user already exists.")
    """
    subprocess.check_call([sys.executable, '-c', create_user_script])
    
    # Start the development server
    print("\nStarting Django development server...")
    print("\nYou can access the admin at: http://127.0.0.1:8000/admin/")
    print("Test user: test@example.com / testpass123\n")
    subprocess.check_call([sys.executable, 'manage.py', 'runserver'])

if __name__ == "__main__":
    setup_environment()
    start_django_server()
