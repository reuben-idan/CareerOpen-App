"""
Test SimpleRegistrationSerializer in the root directory.
"""
import os
import sys
import django
from django.test import TestCase

# Add the project directory to the Python path
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if BASE_DIR not in sys.path:
    sys.path.append(BASE_DIR)

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

class SimpleRegistrationSerializerTest(TestCase):
    """Test cases for SimpleRegistrationSerializer."""
    
    def test_import_serializer(self):
        """Test that SimpleRegistrationSerializer can be imported and used."""
        try:
            # Try to import the serializer
            from accounts.serializers import SimpleRegistrationSerializer
            print("SUCCESS: Successfully imported SimpleRegistrationSerializer")
            print(f"Serializer: {SimpleRegistrationSerializer}")
            
            # Create test data
            test_data = {
                'email': 'test@example.com',
                'password': 'testpass123',
                'first_name': 'Test',
                'last_name': 'User',
                'is_employer': False
            }
            
            # Test serializer validation
            serializer = SimpleRegistrationSerializer(data=test_data)
            self.assertTrue(serializer.is_valid(), 
                          f"Serializer should be valid but got errors: {serializer.errors}")
            
            # Test user creation
            user = serializer.save()
            self.assertEqual(user.email, 'test@example.com')
            self.assertEqual(user.first_name, 'Test')
            self.assertEqual(user.last_name, 'User')
            self.assertFalse(user.is_employer)
            
            print("SUCCESS: Successfully created a user using SimpleRegistrationSerializer")
            
        except Exception as e:
            print(f"\nERROR: {e.__class__.__name__}: {e}")
            import traceback
            traceback.print_exc()
            self.fail(f"Failed to import or use SimpleRegistrationSerializer: {e}")

if __name__ == "__main__":
    import unittest
    unittest.main()
