"""
Minimal test to verify UserRegistrationSerializer can be imported.
"""
import os
import sys
import django

# Add the project directory to the Python path
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if BASE_DIR not in sys.path:
    sys.path.append(BASE_DIR)

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

try:
    # Try to import the serializer directly
    from accounts.serializers import UserRegistrationSerializer
    print("SUCCESS: Successfully imported UserRegistrationSerializer")
    print(f"Serializer: {UserRegistrationSerializer}")
    
    # Print the module path
    import accounts.serializers
    print(f"Module path: {accounts.serializers.__file__}")
    
    # Check if the file exists
    serializers_path = os.path.join(os.path.dirname(accounts.serializers.__file__), 'serializers.py')
    print(f"Serializers file exists: {os.path.exists(serializers_path)}")
    
    # List directory contents for debugging
    print("\nDirectory contents:")
    for f in os.listdir(os.path.dirname(accounts.serializers.__file__)):
        print(f"- {f}")
    
except ImportError as e:
    print(f"ERROR: Failed to import UserRegistrationSerializer: {e}")
    import traceback
    traceback.print_exc()
    
    # Try to find the module
    print("\nTrying to find the module...")
    import importlib.util
    
    # Try to import the accounts package
    try:
        import accounts
        print(f"Accounts package found at: {accounts.__file__}")
        print("Accounts package contents:", dir(accounts))
    except ImportError as e:
        print(f"Failed to import accounts package: {e}")
        
    # Try to import the serializers module directly
    try:
        spec = importlib.util.find_spec('accounts.serializers')
        if spec is None:
            print("\nERROR: Could not find 'accounts.serializers' module")
            print("Python path:", sys.path)
        else:
            print(f"\nFound 'accounts.serializers' at: {spec.origin}")
            print("Module exists:", os.path.exists(spec.origin))
            
            # Try to import the module using importlib
            module = importlib.util.module_from_spec(spec)
            spec.loader.exec_module(module)
            print("Successfully loaded module using importlib")
            
            # Try to get the UserRegistrationSerializer class
            if hasattr(module, 'UserRegistrationSerializer'):
                print("Found UserRegistrationSerializer in module")
                print(f"Serializer: {module.UserRegistrationSerializer}")
            else:
                print("UserRegistrationSerializer not found in module. Available attributes:")
                for attr in dir(module):
                    if not attr.startswith('_'):
                        print(f"- {attr}")
    except Exception as e:
        print(f"\nERROR: Failed to import module: {e}")
        import traceback
        traceback.print_exc()
