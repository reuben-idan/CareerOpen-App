"""
Minimal test file to verify Django database setup.
"""
import os
import sys
import django
from django.test import TestCase
from django.contrib.auth import get_user_model

# Add the project directory to the Python path
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if BASE_DIR not in sys.path:
    sys.path.append(BASE_DIR)

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

class DatabaseTest(TestCase):
    """Test cases for database operations."""
    
    def test_database_connection(self):
        """Test that we can connect to the database."""
        from django.db import connection
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
            result = cursor.fetchone()
            self.assertEqual(result, (1,))
        print("SUCCESS: Successfully connected to the database")
    
    def test_user_model(self):
        """Test that we can create and retrieve a user."""
        User = get_user_model()
        
        # Create a test user
        user = User.objects.create_user(
            email='test_database@example.com',
            password='testpass123',
            first_name='Database',
            last_name='Test'
        )
        
        # Retrieve the user from the database
        retrieved_user = User.objects.get(email='test_database@example.com')
        
        # Verify the user data
        self.assertEqual(retrieved_user.email, 'test_database@example.com')
        self.assertEqual(retrieved_user.first_name, 'Database')
        self.assertEqual(retrieved_user.last_name, 'Test')
        
        print("SUCCESS: Successfully created and retrieved a user from the database")

if __name__ == "__main__":
    import unittest
    unittest.main()
