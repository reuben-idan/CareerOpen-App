"""
A working test file to verify test discovery in the accounts/tests directory.
"""
import os
import sys
import django
from django.test import SimpleTestCase

# Add the project root to the Python path
project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
if project_root not in sys.path:
    sys.path.insert(0, project_root)

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

class WorkingTest(SimpleTestCase):
    """A simple test case to verify test discovery in accounts/tests."""
    
    def test_minimal(self):
        """A simple test that should always pass."""
        self.assertTrue(True)
    
    def test_import_serializers(self):
        """Test that we can import the serializers module."""
        try:
            from accounts.serializers import SimpleRegistrationSerializer, UserRegistrationSerializer
            self.assertTrue(SimpleRegistrationSerializer is not None)
            self.assertTrue(UserRegistrationSerializer is not None)
            print("\nSUCCESS: Successfully imported serializers in accounts/tests")
        except ImportError as e:
            self.fail(f"Failed to import serializers: {e}")

if __name__ == "__main__":
    import unittest
    unittest.main()
