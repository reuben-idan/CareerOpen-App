"""
Minimal test with detailed debugging information.
"""
import os
import sys
import importlib
import traceback
from django.test import SimpleTestCase

class MinimalDebugTest(SimpleTestCase):
    """Minimal test with detailed debugging information."""
    
    def test_debug_imports(self):
        """Test imports with detailed debugging information."""
        print("\n=== Starting Debug Test ===\n")
        
        # 1. Print Python path
        print("Python Path:")
        for i, path in enumerate(sys.path):
            print(f"{i+1}. {path}")
        
        # 2. Print current working directory
        cwd = os.getcwd()
        print(f"\nCurrent Working Directory: {cwd}")
        
        # 3. Check if accounts package is importable
        try:
            import accounts
            print("\nSUCCESS: Imported accounts package")
            print(f"Accounts package path: {accounts.__file__}")
            print(f"Accounts package directory: {os.path.dirname(accounts.__file__)}")
        except ImportError as e:
            print(f"\nERROR: Failed to import accounts package: {e}")
            traceback.print_exc()
        
        # 4. Try to import serializers module directly
        try:
            import accounts.serializers
            print("\nSUCCESS: Imported accounts.serializers")
            print(f"Serializers module path: {accounts.serializers.__file__}")
            
            # List all attributes in the module
            print("\nAttributes in accounts.serializers:")
            for attr in dir(accounts.serializers):
                if not attr.startswith('_'):
                    print(f"- {attr}")
            
        except ImportError as e:
            print(f"\nERROR: Failed to import accounts.serializers: {e}")
            traceback.print_exc()
        
        # 5. Try to import specific serializers
        try:
            from accounts.serializers import SimpleRegistrationSerializer
            print("\nSUCCESS: Imported SimpleRegistrationSerializer")
            print(f"SimpleRegistrationSerializer: {SimpleRegistrationSerializer}")
        except ImportError as e:
            print(f"\nERROR: Failed to import SimpleRegistrationSerializer: {e}")
            traceback.print_exc()
        
        # 6. Try to find the module using importlib
        try:
            spec = importlib.util.find_spec('accounts.serializers')
            if spec is None:
                print("\nERROR: Could not find 'accounts.serializers' module")
            else:
                print(f"\nSUCCESS: Found 'accounts.serializers' module spec")
                print(f"Origin: {spec.origin}")
                print(f"Loader: {spec.loader}")
                
                # Try to load the module
                module = importlib.util.module_from_spec(spec)
                spec.loader.exec_module(module)
                print("SUCCESS: Loaded module using importlib")
                
                # Check for SimpleRegistrationSerializer
                if hasattr(module, 'SimpleRegistrationSerializer'):
                    print("SUCCESS: Found SimpleRegistrationSerializer in loaded module")
                else:
                    print("\nWARNING: SimpleRegistrationSerializer not found in loaded module")
                    print("\nAvailable attributes:")
                    for attr in dir(module):
                        if not attr.startswith('_'):
                            print(f"- {attr}")
        
        except Exception as e:
            print(f"\nERROR: Error finding/loading module: {e}")
            traceback.print_exc()
        
        print("\n=== End of Debug Test ===\n")
        
        # This test should always pass as it's just for debugging
        self.assertTrue(True, "Debug test completed")
