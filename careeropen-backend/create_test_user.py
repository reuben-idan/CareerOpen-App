import os
import django

# Set up the Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

# Now we can import the User model
from django.contrib.auth import get_user_model

User = get_user_model()

# Create a test job seeker user if it doesn't exist
if not User.objects.filter(email='jobseeker@example.com').exists():
    user = User.objects.create_user(
        email='jobseeker@example.com',
        first_name='Job',
        last_name='Seeker',
        password='testpass123',
        is_employer=False
    )
    print(f"Job seeker created successfully! Email: {user.email}, Password: testpass123")
else:
    print("Job seeker already exists.")
