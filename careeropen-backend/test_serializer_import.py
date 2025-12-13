"""
Test file to verify SimpleRegistrationSerializer can be imported and used.
"""
import os
import sys
import django
from django.test import SimpleTestCase

# Add the project directory to the Python path
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
if BASE_DIR not in sys.path:
    sys.path.append(BASE_DIR)

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

class SerializerImportTest(SimpleTestCase):
    """Test that SimpleRegistrationSerializer can be imported and used."""
    
    def test_import_serializer(self):
        """Test that SimpleRegistrationSerializer can be imported."""
        try:
            from accounts.serializers import SimpleRegistrationSerializer
            self.assertTrue(SimpleRegistrationSerializer is not None)
            print("SUCCESS: Successfully imported SimpleRegistrationSerializer")
        except ImportError as e:
            self.fail(f"Failed to import SimpleRegistrationSerializer: {e}")

if __name__ == "__main__":
    import unittest
    unittest.main()
