"""
Minimal test to verify Django test runner functionality.
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

class MinimalTest(SimpleTestCase):
    """Minimal test case to verify test runner functionality."""
    
    def test_minimal(self):
        """A simple test that should always pass."""
        self.assertTrue(True)
