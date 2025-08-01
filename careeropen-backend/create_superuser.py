import os
import django

# Set up the Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

# Now we can import the User model
from django.contrib.auth import get_user_model

User = get_user_model()

# Create a superuser if it doesn't exist
if not User.objects.filter(email='admin@example.com').exists():
    User.objects.create_superuser(
        email='admin@example.com',
        first_name='Admin',
        last_name='User',
        password='admin123',
        is_employer=True
    )
    print("Superuser created successfully!")
else:
    print("Superuser already exists.")
