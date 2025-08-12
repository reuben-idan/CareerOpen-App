"""
Minimal test file for SimpleRegistrationSerializer import.
"""
import os
import sys
import inspect
import django
from django.test import SimpleTestCase

# Add the project directory to the Python path
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if BASE_DIR not in sys.path:
    sys.path.append(BASE_DIR)

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

class MinimalSerializerTest(SimpleTestCase):
    """Minimal test cases for SimpleRegistrationSerializer."""
    
    def test_import_serializer(self):
        """Test that SimpleRegistrationSerializer can be imported and inspected."""
        try:
            # Import the accounts app to check its path
            import accounts
            print(f"Accounts module path: {accounts.__file__}")
            
            # Check if serializers.py exists in the accounts app
            serializers_path = os.path.join(os.path.dirname(accounts.__file__), 'serializers.py')
            print(f"Looking for serializers at: {serializers_path}")
            print(f"File exists: {os.path.exists(serializers_path)}")
            
            # List all files in the accounts directory for debugging
            accounts_dir = os.path.dirname(accounts.__file__)
            print("\nFiles in accounts directory:")
            for f in os.listdir(accounts_dir):
                print(f"- {f}")
            
            # Try to import the serializer
            from accounts.serializers import SimpleRegistrationSerializer
            self.assertTrue(SimpleRegistrationSerializer is not None)
            print("\nSUCCESS: Successfully imported SimpleRegistrationSerializer")
            
            # Print information about the serializer class
            print(f"\nSerializer class: {SimpleRegistrationSerializer}")
            print(f"Module: {SimpleRegistrationSerializer.__module__}")
            print(f"File: {inspect.getfile(SimpleRegistrationSerializer)}")
            
            # Print the serializer's Meta class for debugging
            if hasattr(SimpleRegistrationSerializer, 'Meta'):
                print("\nSerializer Meta:")
                for k, v in SimpleRegistrationSerializer.Meta.__dict__.items():
                    if not k.startswith('_'):
                        print(f"- {k}: {v}")
            else:
                print("\nWARNING: Serializer has no Meta class")
            
            # Print the serializer's fields
            print("\nSerializer fields:")
            try:
                serializer = SimpleRegistrationSerializer()
                for field_name, field in serializer.get_fields().items():
                    print(f"- {field_name}: {field.__class__.__name__}")
            except Exception as e:
                print(f"Error getting serializer fields: {e}")
            
        except ImportError as e:
            print(f"\nERROR: Failed to import SimpleRegistrationSerializer: {e}")
            # Print the full traceback for debugging
            import traceback
            traceback.print_exc()
            self.fail(f"Failed to import SimpleRegistrationSerializer: {e}")
        except Exception as e:
            print(f"\nERROR: Unexpected error: {e}")
            import traceback
            traceback.print_exc()
            self.fail(f"Unexpected error: {e}")

if __name__ == "__main__":
    import unittest
    unittest.main()
