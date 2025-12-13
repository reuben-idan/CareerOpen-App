"""
Minimal working test to verify the test environment.
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
    """Minimal test case to verify the test environment."""
    
    def test_minimal(self):
        """A simple test that should always pass."""
        self.assertTrue(True)

if __name__ == "__main__":
    import unittest
    unittest.main()
