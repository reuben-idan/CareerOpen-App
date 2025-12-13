import os
import sys
from pathlib import Path

def start_server():
    # Set the default Django settings module
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.temp_settings')
    
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed?"
        ) from exc
    
    # Run database migrations
    print("Running database migrations...")
    execute_from_command_line(["manage.py", "migrate"])
    
    # Create superuser if none exists
    from django.contrib.auth import get_user_model
    User = get_user_model()
    if not User.objects.filter(is_superuser=True).exists():
        print("Creating superuser...")
        User.objects.create_superuser('admin', 'admin@example.com', 'admin')
    
    # Start the development server
    print("Starting development server at http://127.0.0.1:8000/")
    print("Quit the server with CTRL-BREAK.")
    execute_from_command_line(["manage.py", "runserver", "--noreload"])

if __name__ == "__main__":
    start_server()
