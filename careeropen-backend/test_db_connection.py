"""
Test database connection and model access.
"""
import os
import sys
import django
from pathlib import Path

# Add the project root to the Python path
project_root = Path(__file__).resolve().parent
sys.path.insert(0, str(project_root))

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

try:
    django.setup()
    print("Django setup complete")
except Exception as e:
    print(f"Error setting up Django: {e}")
    sys.exit(1)

# Now import Django and DRF components
from django.db import connection
from django.contrib.auth import get_user_model

User = get_user_model()

def test_database_connection():
    """Test database connection and basic model access."""
    print("\n=== Testing Database Connection ===")
    
    # Test database connection
    with connection.cursor() as cursor:
        cursor.execute("SELECT 1")
        result = cursor.fetchone()
        print(f"Database connection test: {result}")
    
    # Test User model
    user_count = User.objects.count()
    print(f"Number of users in database: {user_count}")
    
    # Try to create a test user
    test_email = "test_user@example.com"
    try:
        if not User.objects.filter(email=test_email).exists():
            user = User.objects.create_user(
                email=test_email,
                password="testpass123",
                first_name="Test",
                last_name="User"
            )
            print(f"Created test user with ID: {user.id}")
        else:
            print("Test user already exists")
            user = User.objects.get(email=test_email)
            print(f"Test user ID: {user.id}")
        
        print("\nDatabase test completed successfully!")
        return True
    except Exception as e:
        print(f"\nERROR: Database test failed: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    test_database_connection()
