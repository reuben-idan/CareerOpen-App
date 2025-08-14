"""
Simple test file to verify test runner setup.
"""
from django.test import TestCase


class SimpleTest(TestCase):
    """Simple test case to verify test runner setup."""
    
    def test_addition(self):
        """Test that 1 + 1 equals 2."""
        self.assertEqual(1 + 1, 2)
