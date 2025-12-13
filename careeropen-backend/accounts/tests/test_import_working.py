"""
Test file to verify imports in the accounts/tests directory.
"""
import os
import sys
import django
from django.test import SimpleTestCase

# Add the project root to the Python path
project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
if project_root not in sys.path:
    sys.path.insert(0, project_root)

# Print Python path for debugging
print("\nPython Path:")
for i, path in enumerate(sys.path, 1):
    print(f"{i}. {path}")

# Set up Django
print("\nSetting up Django...")
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
try:
    django.setup()
    print("SUCCESS: Django setup completed")
except Exception as e:
    print(f"ERROR: Failed to set up Django: {e}")
    raise

class ImportTest(SimpleTestCase):
    """Test case to verify imports in accounts/tests."""
    
    def test_import_serializers(self):
        """Test that we can import the serializers."""
        try:
            from accounts.serializers import SimpleRegistrationSerializer, UserRegistrationSerializer
            print("\nSUCCESS: Successfully imported serializers:")
            print(f"- UserRegistrationSerializer: {UserRegistrationSerializer}")
            print(f"- SimpleRegistrationSerializer: {SimpleRegistrationSerializer}")
            self.assertTrue(True, "Successfully imported serializers")
        except ImportError as e:
            self.fail(f"Failed to import serializers: {e}")
    
    def test_minimal_assertion(self):
        """A simple test that should always pass."""
        self.assertEqual(1 + 1, 2)

if __name__ == "__main__":
    import unittest
    unittest.main()
