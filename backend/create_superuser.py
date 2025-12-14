#!/usr/bin/env python
"""Create a superuser for CareerOpen."""
import os
import django
from django.core.management import execute_from_command_line

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'careeropen.settings')
django.setup()

from authentication.models import User

def create_superuser():
    """Create a default superuser."""
    if not User.objects.filter(email='admin@careeropen.com').exists():
        User.objects.create_superuser(
            username='admin',
            email='admin@careeropen.com',
            password='admin123',
            first_name='Admin',
            last_name='User',
            role='admin'
        )
        print("✅ Superuser created: admin@careeropen.com / admin123")
    else:
        print("ℹ️ Superuser already exists")

if __name__ == '__main__':
    create_superuser()