"""
A simple smoke test to verify the test environment is working.
This test is placed in the root directory to avoid test discovery issues.
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

class SmokeTest(SimpleTestCase):
    """Simple test to verify the test environment works."""
    
    def test_smoke(self):
        """A simple test that should always pass."""
        self.assertTrue(True)

if __name__ == "__main__":
    import unittest
    unittest.main()
