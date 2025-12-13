"""
A smoke test to verify the test environment is working.
"""
from django.test import SimpleTestCase

class SmokeTest(SimpleTestCase):
    """Simple test to verify the test environment works."""
    
    def test_smoke(self):
        """A simple test that should always pass."""
        self.assertTrue(True)
