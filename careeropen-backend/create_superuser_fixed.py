import os
import django

# Set up the Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

# Now we can import the User model
from django.contrib.auth import get_user_model

User = get_user_model()

# Delete existing superuser if it exists
User.objects.filter(email='admin@example.com').delete()

# Create a new superuser
user = User.objects.create_superuser(
    email='admin@example.com',
    first_name='Admin',
    last_name='User',
    password='admin123',
    is_employer=True
)
print(f"Superuser created successfully! Email: {user.email}, Password: admin123")
