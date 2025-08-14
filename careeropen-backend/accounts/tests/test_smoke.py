"""
A simple smoke test to verify the test environment is working.
"""
from django.test import TestCase

class SmokeTest(TestCase):
    """Basic smoke test to verify the test environment."""
    
    def test_smoke(self):
        """Test that the test environment is working."""
        self.assertTrue(True)
