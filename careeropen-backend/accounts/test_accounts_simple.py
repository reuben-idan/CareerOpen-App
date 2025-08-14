"""
A simple test file in the accounts directory.
This helps determine if the issue is specific to the tests subdirectory.
"""
from django.test import SimpleTestCase

class AccountsSimpleTest(SimpleTestCase):
    """Simple test for the accounts app."""
    
    def test_simple(self):
        """A simple test that should always pass."""
        self.assertTrue(True)
