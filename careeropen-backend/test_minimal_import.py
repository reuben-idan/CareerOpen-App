"""
Minimal test to verify import behavior in the root directory.
"""
import os
import sys
import django

# Add the project root to the Python path
project_root = os.path.abspath(os.path.dirname(__file__))
if project_root not in sys.path:
    sys.path.insert(0, project_root)

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

# Try to import the serializers
try:
    from accounts.serializers import UserRegistrationSerializer, SimpleRegistrationSerializer
    print("SUCCESS: Successfully imported serializers:")
    print(f"- UserRegistrationSerializer: {UserRegistrationSerializer}")
    print(f"- SimpleRegistrationSerializer: {SimpleRegistrationSerializer}")
    print("\nTest passed!")
    sys.exit(0)
except Exception as e:
    print(f"\nERROR: {e.__class__.__name__}: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)
