"""
Test script to verify import paths and Django setup.
"""
import os
import sys
import django

# Add the project root to the Python path
project_root = os.path.abspath(os.path.dirname(__file__))
if project_root not in sys.path:
    sys.path.insert(0, project_root)

# Print Python path for debugging
print("\nPython Path:")
for i, path in enumerate(sys.path, 1):
    print(f"{i}. {path}")

# Set up Django
print("\nSetting up Django...")
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
try:
    django.setup()
    print("SUCCESS: Django setup completed")
except Exception as e:
    print(f"ERROR: Failed to set up Django: {e}")
    raise

# Try to import the serializers
try:
    print("\nAttempting to import serializers...")
    from accounts.serializers import SimpleRegistrationSerializer, UserRegistrationSerializer
    
    print("SUCCESS: Successfully imported serializers:")
    print(f"- UserRegistrationSerializer: {UserRegistrationSerializer}")
    print(f"- SimpleRegistrationSerializer: {SimpleRegistrationSerializer}")
    
    # Check if the serializers are callable
    print("\nChecking if serializers are callable...")
    assert callable(UserRegistrationSerializer), "UserRegistrationSerializer is not callable"
    assert callable(SimpleRegistrationSerializer), "SimpleRegistrationSerializer is not callable"
    print("SUCCESS: Both serializers are callable")
    
    # Test creating a serializer instance
    print("\nTesting serializer instantiation...")
    user_data = {
        'email': 'test@example.com',
        'password': 'testpass123',
        'first_name': 'Test',
        'last_name': 'User'
    }
    
    # Test UserRegistrationSerializer
    user_serializer = UserRegistrationSerializer(data=user_data)
    assert user_serializer.is_valid(), f"UserRegistrationSerializer validation failed: {user_serializer.errors}"
    
    # Test SimpleRegistrationSerializer
    simple_serializer = SimpleRegistrationSerializer(data=user_data)
    assert simple_serializer.is_valid(), f"SimpleRegistrationSerializer validation failed: {simple_serializer.errors}"
    
    print("SUCCESS: Successfully created and validated serializer instances")
    print("\nAll tests passed!")
    
except Exception as e:
    print(f"\nERROR: {e.__class__.__name__}: {e}")
    import traceback
    traceback.print_exc()
    print("\nTest failed!")
    sys.exit(1)
else:
    sys.exit(0)
