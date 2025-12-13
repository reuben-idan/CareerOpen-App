"""
Script to create test users for the CareerOpen API.
Run this script with: python manage.py shell < create_test_users.py
"""
import os
import sys
from django.contrib.auth import get_user_model

def create_test_users():
    User = get_user_model()
    
    # Test employer user
    employer, created = User.objects.get_or_create(
        email='employer@example.com',
        defaults={
            'first_name': 'Test',
            'last_name': 'Employer',
            'role': 'employer',
            'is_active': True
        }
    )
    if created:
        employer.set_password('testpass123')
        employer.save()
        print("✅ Created test employer user")
    else:
        print("ℹ️ Test employer user already exists")
    
    # Test job seeker user
    job_seeker, created = User.objects.get_or_create(
        email='jobseeker@example.com',
        defaults={
            'first_name': 'Test',
            'last_name': 'JobSeeker',
            'role': 'job_seeker',
            'is_active': True
        }
    )
    if created:
        job_seeker.set_password('testpass123')
        job_seeker.save()
        print("✅ Created test job seeker user")
    else:
        print("ℹ️ Test job seeker user already exists")
    
    # Test admin user
    admin, created = User.objects.get_or_create(
        email='admin@example.com',
        defaults={
            'first_name': 'Admin',
            'last_name': 'User',
            'role': 'admin',
            'is_staff': True,
            'is_superuser': True,
            'is_active': True
        }
    )
    if created:
        admin.set_password('adminpass123')
        admin.save()
        print("✅ Created admin user")
    else:
        print("ℹ️ Admin user already exists")

if __name__ == "__main__":
    # This allows the script to be run directly with `python create_test_users.py`
    # but also supports being imported in the Django shell
    if 'django.core.management' in sys.modules:
        # Running in Django shell
        create_test_users()
    else:
        # Run as a standalone script
        import django
        import os
        
        os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
        django.setup()
        create_test_users()
