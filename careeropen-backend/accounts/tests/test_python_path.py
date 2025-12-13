"""
Test Python path and module imports in accounts/tests.
"""
import os
import sys
import importlib
import pkgutil
from django.test import SimpleTestCase

class PythonPathTest(SimpleTestCase):
    """Test Python path and module imports."""
    
    def test_python_path(self):
        """Test that the Python path is set up correctly."""
        print("\nPython Path:")
        for path in sys.path:
            print(f"- {path}")
        
        # Check if the project root is in the Python path
        project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
        self.assertIn(project_root, sys.path, 
                     f"Project root {project_root} not in Python path")
        
        print(f"\nProject root: {project_root}")
        print("Project root exists:", os.path.exists(project_root))
        
        # Check if the accounts package is importable
        try:
            import accounts
            print(f"\nAccounts package found at: {accounts.__file__}")
            print("Accounts package contents:", dir(accounts))
        except ImportError as e:
            self.fail(f"Failed to import accounts package: {e}")
    
    def test_import_serializers_module(self):
        """Test that we can import the serializers module."""
        try:
            # Try to import the serializers module using importlib
            spec = importlib.util.find_spec('accounts.serializers')
            self.assertIsNotNone(spec, "Could not find 'accounts.serializers' module")
            
            print(f"\nFound 'accounts.serializers' at: {spec.origin}")
            print("Module exists:", os.path.exists(spec.origin))
            
            # Try to load the module
            module = importlib.util.module_from_spec(spec)
            spec.loader.exec_module(module)
            print("Successfully loaded module using importlib")
            
            # Check for the serializers
            serializers = [
                'UserRegistrationSerializer',
                'SimpleRegistrationSerializer',
                'UserLoginSerializer',
                'UserProfileSerializer'
            ]
            
            missing = []
            for serializer in serializers:
                if not hasattr(module, serializer):
                    missing.append(serializer)
            
            if missing:
                print(f"\nWARNING: Missing serializers: {', '.join(missing)}")
                print("\nAvailable attributes in module:")
                for attr in dir(module):
                    if not attr.startswith('_'):
                        print(f"- {attr}")
            
            self.assertFalse(missing, f"Missing serializers: {', '.join(missing)}")
            
        except Exception as e:
            print(f"\nERROR: {e.__class__.__name__}: {e}")
            import traceback
            traceback.print_exc()
            self.fail(f"Failed to import or check accounts.serializers: {e}")
