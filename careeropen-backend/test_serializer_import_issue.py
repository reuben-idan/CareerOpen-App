"""
Minimal test to reproduce the UserRegistrationSerializer import issue.
"""
import os
import sys
import django
from django.test import TestCase, override_settings

# Add the project directory to the Python path
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if BASE_DIR not in sys.path:
    sys.path.append(BASE_DIR)

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

class MinimalSerializerTest(TestCase):
    """Minimal test case to reproduce the import issue."""
    
    def test_import_serializer(self):
        """Test that UserRegistrationSerializer can be imported."""
        try:
            # Try to import the serializer
            from accounts.serializers import UserRegistrationSerializer
            print("SUCCESS: Successfully imported UserRegistrationSerializer")
            print(f"Serializer: {UserRegistrationSerializer}")
            
            # Print the module path
            import accounts.serializers
            print(f"Module path: {accounts.serializers.__file__}")
            
            # List the module's attributes
            print("\nModule attributes:")
            for attr in dir(accounts.serializers):
                if not attr.startswith('_'):
                    print(f"- {attr}")
            
            # Check if the serializer class exists in the module
            self.assertTrue(hasattr(accounts.serializers, 'UserRegistrationSerializer'),
                         "UserRegistrationSerializer not found in module")
            
            # Create an instance of the serializer
            serializer = UserRegistrationSerializer()
            self.assertIsNotNone(serializer)
            print("SUCCESS: Successfully created UserRegistrationSerializer instance")
            
        except Exception as e:
            print(f"\nERROR: {e.__class__.__name__}: {e}")
            import traceback
            traceback.print_exc()
            self.fail(f"Failed to import or use UserRegistrationSerializer: {e}")

if __name__ == "__main__":
    import unittest
    unittest.main()
