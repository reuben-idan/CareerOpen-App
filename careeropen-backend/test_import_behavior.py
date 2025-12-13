"""
Test import behavior from the root directory.
"""
import os
import sys
import importlib.util
from django.test import SimpleTestCase

class RootImportTest(SimpleTestCase):
    """Test import behavior from the root directory."""
    
    def test_import_serializers(self):
        """Test that we can import serializers from the root directory."""
        try:
            # Try to import the serializers module
            from accounts.serializers import UserRegistrationSerializer, SimpleRegistrationSerializer
            
            print("SUCCESS: Successfully imported serializers from root directory")
            print(f"UserRegistrationSerializer: {UserRegistrationSerializer}")
            print(f"SimpleRegistrationSerializer: {SimpleRegistrationSerializer}")
            
            # Check that the serializers are callable
            self.assertTrue(callable(UserRegistrationSerializer), 
                          "UserRegistrationSerializer is not callable")
            self.assertTrue(callable(SimpleRegistrationSerializer), 
                          "SimpleRegistrationSerializer is not callable")
            
            print("SUCCESS: Both serializers are callable from root directory")
            
        except Exception as e:
            print(f"\nERROR: {e.__class__.__name__}: {e}")
            import traceback
            traceback.print_exc()
            self.fail(f"Failed to import serializers from root directory: {e}")
    
    def test_import_paths(self):
        """Test the Python path and module resolution."""
        print("\nPython Path:")
        for path in sys.path:
            print(f"- {path}")
        
        # Check if the project root is in the Python path
        project_root = os.path.abspath(os.path.dirname(__file__))
        self.assertIn(project_root, sys.path, 
                     f"Project root {project_root} not in Python path")
        
        print(f"\nProject root: {project_root}")
        print("Project root exists:", os.path.exists(project_root))
        
        # Try to find the serializers module
        spec = importlib.util.find_spec('accounts.serializers')
        self.assertIsNotNone(spec, "Could not find 'accounts.serializers' module")
        
        print(f"\nFound 'accounts.serializers' at: {spec.origin}")
        print("Module exists:", os.path.exists(spec.origin) if spec.origin else "No origin")
        
        # Check the module's file location
        if spec.origin:
            module_dir = os.path.dirname(spec.origin)
            print(f"\nModule directory: {module_dir}")
            print("Directory exists:", os.path.exists(module_dir))
            
            # List the contents of the module directory
            if os.path.exists(module_dir):
                print("\nContents of module directory:")
                for f in os.listdir(module_dir):
                    print(f"- {f}")
        
        # Try to load the module
        try:
            module = importlib.util.module_from_spec(spec)
            spec.loader.exec_module(module)
            print("\nSUCCESS: Successfully loaded module using importlib")
            
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
            self.fail(f"Failed to load module using importlib: {e}")
