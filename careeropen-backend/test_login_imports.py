"""
Test imports required for the login view.
"""
import sys
import os
import importlib
from pathlib import Path

# Add the project root to the Python path
project_root = Path(__file__).resolve().parent
sys.path.insert(0, str(project_root))

def test_imports():
    """Test all imports required for the login view."""
    print("\n=== Testing imports ===")
    
    # Set up Django environment
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
    
    try:
        import django
        django.setup()
        print("SUCCESS: Django setup complete")
    except Exception as e:
        print(f"ERROR: Django setup failed: {e}")
        return
    
    # List of modules to test
    modules_to_test = [
        'django.urls',
        'rest_framework',
        'rest_framework.test',
        'django.contrib.auth',
        'rest_framework_simplejwt.tokens',
        'accounts.views',
        'accounts.serializers',
        'accounts.models'
    ]
    
    # Test each module
    for module_name in modules_to_test:
        try:
            module = importlib.import_module(module_name)
            print(f"SUCCESS: Imported {module_name}")
            
            # If this is the serializers module, check for SimpleRegistrationSerializer
            if module_name == 'accounts.serializers':
                if hasattr(module, 'SimpleRegistrationSerializer'):
                    print(f"  - Found SimpleRegistrationSerializer in {module_name}")
                else:
                    print(f"  - WARNING: SimpleRegistrationSerializer not found in {module_name}")
                
                # Print all available serializers
                print("  - Available serializers:")
                for name in dir(module):
                    if name.endswith('Serializer') and not name.startswith('_'):
                        print(f"    - {name}")
                        
        except ImportError as e:
            print(f"ERROR: Failed to import {module_name}: {e}")
        except Exception as e:
            print(f"ERROR: Error importing {module_name}: {e}")
    
    print("\n=== Import test complete ===")

if __name__ == "__main__":
    test_imports()
