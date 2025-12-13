"""
A test file in the accounts directory (not in tests subdirectory).
This helps determine if the issue is specific to the tests directory.
"""
import os
import sys
import django
from django.test import SimpleTestCase

class AccountsTest(SimpleTestCase):
    """Simple test for the accounts app."""
    
    def test_accounts(self):
        """A simple test that should always pass."""
        self.assertTrue(True)
        
    def test_import_serializer(self):
        """Test that SimpleRegistrationSerializer can be imported."""
        try:
            from accounts.serializers import SimpleRegistrationSerializer
            self.assertTrue(SimpleRegistrationSerializer is not None)
        except ImportError as e:
            self.fail(f"Failed to import SimpleRegistrationSerializer: {e}")
