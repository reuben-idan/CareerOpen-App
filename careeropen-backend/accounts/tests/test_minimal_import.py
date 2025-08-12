"""
Minimal test to check import behavior in accounts/tests.
"""
import os
import sys
import django
from django.test import SimpleTestCase

class MinimalImportTest(SimpleTestCase):
    """Minimal test case to check import behavior."""
    
    def test_import_accounts_serializers(self):
        """Test that we can import from accounts.serializers."""
        try:
            # Try to import the serializers module
            import accounts.serializers
            print("SUCCESS: Successfully imported accounts.serializers")
            print(f"Module path: {accounts.serializers.__file__}")
            
            # List the module's attributes
            print("\nModule attributes:")
            for attr in dir(accounts.serializers):
                if not attr.startswith('_'):
                    print(f"- {attr}")
            
            # Check if the module has the expected attributes
            self.assertTrue(hasattr(accounts.serializers, 'UserRegistrationSerializer'),
                         "UserRegistrationSerializer not found in module")
            self.assertTrue(hasattr(accounts.serializers, 'SimpleRegistrationSerializer'),
                         "SimpleRegistrationSerializer not found in module")
            
            print("SUCCESS: All expected serializers found in accounts.serializers")
            
        except Exception as e:
            print(f"\nERROR: {e.__class__.__name__}: {e}")
            import traceback
            traceback.print_exc()
            self.fail(f"Failed to import or check accounts.serializers: {e}")
    
    def test_import_specific_serializer(self):
        """Test that we can import specific serializers."""
        try:
            # Try to import specific serializers
            from accounts.serializers import UserRegistrationSerializer, SimpleRegistrationSerializer
            
            print("SUCCESS: Successfully imported specific serializers")
            print(f"UserRegistrationSerializer: {UserRegistrationSerializer}")
            print(f"SimpleRegistrationSerializer: {SimpleRegistrationSerializer}")
            
            # Check that the serializers are callable
            self.assertTrue(callable(UserRegistrationSerializer), 
                          "UserRegistrationSerializer is not callable")
            self.assertTrue(callable(SimpleRegistrationSerializer), 
                          "SimpleRegistrationSerializer is not callable")
            
            print("SUCCESS: Both serializers are callable")
            
        except Exception as e:
            print(f"\nERROR: {e.__class__.__name__}: {e}")
            import traceback
            traceback.print_exc()
            self.fail(f"Failed to import specific serializers: {e}")
