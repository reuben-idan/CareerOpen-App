import os
import django
from django.contrib.auth import get_user_model

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

def create_test_user():
    User = get_user_model()
    
    # Check if test user already exists
    test_email = 'test_applicant@example.com'
    if User.objects.filter(email=test_email).exists():
        print(f"Test user {test_email} already exists.")
        return User.objects.get(email=test_email)
    
    # Create a new test user
    user = User.objects.create_user(
        email=test_email,
        first_name='Test',
        last_name='Applicant',
        password='testpass123',
        is_active=True
    )
    
    print(f"Created test user: {user.email}")
    return user

if __name__ == "__main__":
    user = create_test_user()
    print(f"User ID: {user.id}")
    print(f"Email: {user.email}")
    print(f"Password: testpass123")
