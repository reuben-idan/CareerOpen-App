import os
import django
from django.conf import settings

def setup_test_user():
    # Configure Django to use SQLite for this script
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
    
    # Create or update test user
    email = 'test@example.com'
    password = 'testpass123'
    
    try:
        user, created = User.objects.get_or_create(
            email=email,
            defaults={
                'first_name': 'Test',
                'last_name': 'User',
                'is_employer': False,
                'is_active': True
            }
        )
        
        if created or not user.check_password(password):
            user.set_password(password)
            user.save()
            print(f"User created/updated successfully! Email: {email}, Password: {password}")
        else:
            print(f"User already exists with the correct password. Email: {email}")
            
    except Exception as e:
        print(f"Error creating/updating user: {str(e)}")

if __name__ == "__main__":
    setup_test_user()
