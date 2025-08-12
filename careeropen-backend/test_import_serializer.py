"""
Minimal test to verify serializer import works.
"""
import os
import sys

# Add the project directory to the Python path
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
if BASE_DIR not in sys.path:
    sys.path.append(BASE_DIR)

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
import django
django.setup()

# Now try to import the serializer
try:
    from accounts.serializers import SimpleRegistrationSerializer
    print("SUCCESS: Successfully imported SimpleRegistrationSerializer")
    print(f"Serializer: {SimpleRegistrationSerializer}")
except ImportError as e:
    print(f"ERROR: Failed to import SimpleRegistrationSerializer: {e}")
    print("\nPython path:")
    for p in sys.path:
        print(f"- {p}")
    
    print("\nCurrent directory:", os.getcwd())
    print("Accounts directory exists:", os.path.exists(os.path.join(BASE_DIR, 'accounts')))
    print("Accounts/__init__.py exists:", os.path.exists(os.path.join(BASE_DIR, 'accounts', '__init__.py')))
    print("Accounts/serializers.py exists:", os.path.exists(os.path.join(BASE_DIR, 'accounts', 'serializers.py')))
