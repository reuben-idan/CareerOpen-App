"""
Test SimpleRegistrationSerializer validation in the root directory.
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

class SimpleRegistrationSerializerValidationTest(TestCase):
    """Test cases for SimpleRegistrationSerializer validation."""
    
    def test_serializer_validation(self):
        """Test SimpleRegistrationSerializer validation with valid data."""
        try:
            from accounts.serializers import SimpleRegistrationSerializer
            
            # Valid test data
            test_data = {
                'email': 'test_validation@example.com',
                'password': 'TestPass123!',  # Strong password
                'first_name': 'Test',
                'last_name': 'User',
                'is_employer': False
            }
            
            # Create and validate the serializer
            serializer = SimpleRegistrationSerializer(data=test_data)
            is_valid = serializer.is_valid()
            
            # If not valid, print validation errors
            if not is_valid:
                print("\nValidation Errors:")
                for field, errors in serializer.errors.items():
                    print(f"- {field}: {errors}")
                
            self.assertTrue(is_valid, "Serializer should be valid with correct data")
            
            # If valid, test user creation
            if is_valid:
                user = serializer.save()
                self.assertEqual(user.email, 'test_validation@example.com')
                self.assertEqual(user.first_name, 'Test')
                self.assertEqual(user.last_name, 'User')
                self.assertFalse(user.is_employer)
                print("SUCCESS: Successfully created a user with valid data")
            
        except Exception as e:
            print(f"\nERROR: {e.__class__.__name__}: {e}")
            import traceback
            traceback.print_exc()
            self.fail(f"Test failed: {e}")

if __name__ == "__main__":
    import unittest
    unittest.main()
