"""
Minimal test case that doesn't require database access.
"""
import os
import sys
import django
from django.test import SimpleTestCase

# Add the project root to the Python path
project_root = os.path.abspath(os.path.dirname(__file__))
if project_root not in sys.path:
    sys.path.insert(0, project_root)

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

class NoDbTest(SimpleTestCase):
    """Test case that doesn't require database access."""
    
    def test_import_serializers(self):
        """Test that we can import the serializers module."""
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
