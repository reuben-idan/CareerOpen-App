"""
A minimal test to verify that imports work correctly.
"""
import sys
import os
import django
from django.conf import settings

# Add the project directory to the Python path
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
if BASE_DIR not in sys.path:
    sys.path.append(BASE_DIR)

# Configure Django settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

# Now try to import the serializer
from accounts.serializers import SimpleRegistrationSerializer

# Simple test case
class TestImports(django.test.TestCase):
    """Test that imports work correctly."""
    
    def test_import_serializer(self):
        """Test that SimpleRegistrationSerializer can be imported."""
        self.assertTrue(SimpleRegistrationSerializer is not None)
