import os
import django
from django.core.management import execute_from_command_line

def test_server():
    # Set the default Django settings module for the 'django-admin' utility.
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
    
    # Setup Django
    django.setup()
    
    # Try to import some models to test the database connection
    try:
        from django.contrib.auth import get_user_model
        User = get_user_model()
        print("Successfully imported User model")
        print(f"Total users: {User.objects.count()}")
    except Exception as e:
        print(f"Error accessing database: {e}")
    
    # Start the development server
    print("\nStarting development server...")
    execute_from_command_line(["manage.py", "runserver", "0.0.0.0:8000", "--noreload"])

if __name__ == "__main__":
    test_server()
