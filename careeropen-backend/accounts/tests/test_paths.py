"""
Test file to check Python paths and module imports.
"""
import sys
import os

def print_paths():
    """Print Python paths and check for module imports."""
    # Print Python paths
    print("\n=== Python Path ===")
    for i, path in enumerate(sys.path):
        print(f"{i}: {path}")
    
    # Check if accounts is importable
    print("\n=== Module Imports ===")
    try:
        import accounts
        print(f"accounts module path: {accounts.__file__}")
        print(f"accounts.__path__: {accounts.__path__}")
    except ImportError as e:
        print(f"Failed to import accounts: {e}")
    
    # Check if accounts.serializers is importable
    try:
        from accounts import serializers
        print(f"serializers module path: {serializers.__file__}")
        print(f"serializers.__path__: {serializers.__path__ if hasattr(serializers, '__path__') else 'N/A'}")
    except ImportError as e:
        print(f"Failed to import accounts.serializers: {e}")
    
    # Check if SimpleRegistrationSerializer is importable
    try:
        from accounts.serializers import SimpleRegistrationSerializer
        print(f"SimpleRegistrationSerializer: {SimpleRegistrationSerializer}")
    except ImportError as e:
        print(f"Failed to import SimpleRegistrationSerializer: {e}")
    except Exception as e:
        print(f"Error importing SimpleRegistrationSerializer: {e}")

if __name__ == "__main__":
    print("=== Starting path test ===")
    print(f"Current working directory: {os.getcwd()}")
    print(f"Script directory: {os.path.dirname(os.path.abspath(__file__))}")
    print_paths()
    print("\n=== Test complete ===")
