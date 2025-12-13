"""
Test file for SimpleRegistrationSerializer functionality.
"""
import os
import sys
import django
from django.test import SimpleTestCase

# Add the project directory to the Python path
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if BASE_DIR not in sys.path:
    sys.path.append(BASE_DIR)

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

class SimpleSerializerTest(SimpleTestCase):
    """Test cases for SimpleRegistrationSerializer."""
    
    def test_import_serializer(self):
        """Test that SimpleRegistrationSerializer can be imported."""
        try:
            from accounts.serializers import SimpleRegistrationSerializer
            self.assertTrue(SimpleRegistrationSerializer is not None)
            print("SUCCESS: Successfully imported SimpleRegistrationSerializer")
        except ImportError as e:
            self.fail(f"Failed to import SimpleRegistrationSerializer: {e}")
    
    def test_serializer_validation(self):
        """Test that SimpleRegistrationSerializer validates data correctly."""
        try:
            from accounts.serializers import SimpleRegistrationSerializer
            
            # Test valid data
            valid_data = {
                'email': 'test@example.com',
                'password1': 'testpass123',
                'password2': 'testpass123',
                'first_name': 'Test',
                'last_name': 'User'
            }
            
            serializer = SimpleRegistrationSerializer(data=valid_data)
            self.assertTrue(serializer.is_valid(), 
                          f"Serializer should be valid but got errors: {serializer.errors}")
            
            # Test invalid data (passwords don't match)
            invalid_data = valid_data.copy()
            invalid_data['password2'] = 'differentpass'
            
            serializer = SimpleRegistrationSerializer(data=invalid_data)
            self.assertFalse(serializer.is_valid())
            self.assertIn('non_field_errors', serializer.errors)
            
            print("SUCCESS: Successfully validated SimpleRegistrationSerializer")
            
        except ImportError as e:
            self.fail(f"Failed to import SimpleRegistrationSerializer: {e}")
        except Exception as e:
            self.fail(f"Error testing SimpleRegistrationSerializer: {e}")

if __name__ == "__main__":
    import unittest
    unittest.main()
