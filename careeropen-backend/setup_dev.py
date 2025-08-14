import os
import django
from django.conf import settings

# Set up the Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

def setup_database():
    """Set up the SQLite database and create a test user."""
    # Configure Django to use SQLite
    settings.DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': 'db.sqlite3',
        }
    }
    
    # Initialize Django
    django.setup()
    
    # Now we can import models
    from django.contrib.auth import get_user_model
    User = get_user_model()
    
    # Create migrations
    from django.core.management import call_command
    print("Creating database tables...")
    call_command('migrate', '--noinput')
    
    # Create a test user
    if not User.objects.filter(email='test@example.com').exists():
        print("Creating test user...")
        User.objects.create_user(
            email='test@example.com',
            first_name='Test',
            last_name='User',
            password='testpass123',
            is_employer=False
        )
        print("Test user created successfully!")
        print("Email: test@example.com")
        print("Password: testpass123")
    else:
        print("Test user already exists.")

if __name__ == "__main__":
    setup_database()
