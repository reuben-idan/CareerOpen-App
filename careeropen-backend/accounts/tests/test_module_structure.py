"""
Test module structure and imports in accounts/tests.
"""
import os
import sys
import importlib
import pkgutil
from django.test import SimpleTestCase

class ModuleStructureTest(SimpleTestCase):
    """Test module structure and imports."""
    
    def test_module_structure(self):
        """Test the structure of the accounts package."""
        print("\nTesting module structure...")
        
        # Get the project root and accounts package paths
        project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
        accounts_pkg = os.path.join(project_root, 'accounts')
        
        print(f"\nProject root: {project_root}")
        print(f"Accounts package: {accounts_pkg}")
        
        # Check if the accounts package exists
        self.assertTrue(os.path.isdir(accounts_pkg), "Accounts package directory not found")
        
        # Check for __init__.py in the accounts package
        init_py = os.path.join(accounts_pkg, '__init__.py')
        self.assertTrue(os.path.isfile(init_py), "__init__.py not found in accounts package")
        
        # Check for serializers.py in the accounts package
        serializers_py = os.path.join(accounts_pkg, 'serializers.py')
        self.assertTrue(os.path.isfile(serializers_py), "serializers.py not found in accounts package")
        
        print("\nAccounts package structure is valid")
    
    def test_import_accounts_serializers(self):
        """Test importing accounts.serializers directly."""
        try:
            # Add the project root to the Python path if not already there
            project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
            if project_root not in sys.path:
                sys.path.insert(0, project_root)
            
            # Try to import the serializers module directly
            import accounts.serializers
            print("\nSUCCESS: Successfully imported accounts.serializers")
            print(f"Module path: {accounts.serializers.__file__}")
            
            # List the module's attributes
            print("\nModule attributes:")
            for attr in dir(accounts.serializers):
                if not attr.startswith('_'):
                    print(f"- {attr}")
            
            # Check for the serializers we expect
            serializers = [
                'UserRegistrationSerializer',
                'SimpleRegistrationSerializer',
                'UserLoginSerializer',
                'UserProfileSerializer'
            ]
            
            missing = []
            for serializer in serializers:
                if not hasattr(accounts.serializers, serializer):
                    missing.append(serializer)
            
            if missing:
                print(f"\nWARNING: Missing serializers: {', '.join(missing)}")
            
            self.assertFalse(missing, f"Missing serializers: {', '.join(missing)}")
            
        except Exception as e:
            print(f"\nERROR: {e.__class__.__name__}: {e}")
            import traceback
            traceback.print_exc()
            self.fail(f"Failed to import accounts.serializers: {e}")
    
    def test_import_specific_serializers(self):
        """Test importing specific serializers from accounts.serializers."""
        try:
            # Add the project root to the Python path if not already there
            project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
            if project_root not in sys.path:
                sys.path.insert(0, project_root)
            
            # Try to import specific serializers
            from accounts.serializers import (
                UserRegistrationSerializer,
                SimpleRegistrationSerializer,
                UserLoginSerializer,
                UserProfileSerializer
            )
            
            print("\nSUCCESS: Successfully imported all serializers")
            print(f"UserRegistrationSerializer: {UserRegistrationSerializer}")
            print(f"SimpleRegistrationSerializer: {SimpleRegistrationSerializer}")
            print(f"UserLoginSerializer: {UserLoginSerializer}")
            print(f"UserProfileSerializer: {UserProfileSerializer}")
            
            # Check that the serializers are callable
            self.assertTrue(callable(UserRegistrationSerializer), 
                          "UserRegistrationSerializer is not callable")
            self.assertTrue(callable(SimpleRegistrationSerializer), 
                          "SimpleRegistrationSerializer is not callable")
            self.assertTrue(callable(UserLoginSerializer), 
                          "UserLoginSerializer is not callable")
            self.assertTrue(callable(UserProfileSerializer), 
                          "UserProfileSerializer is not callable")
            
            print("\nSUCCESS: All serializers are callable")
            
        except Exception as e:
            print(f"\nERROR: {e.__class__.__name__}: {e}")
            import traceback
            traceback.print_exc()
            self.fail(f"Failed to import specific serializers: {e}")
