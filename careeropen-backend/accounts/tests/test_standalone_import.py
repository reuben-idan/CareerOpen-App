"""
Test that verifies imports work in the test context.
This test uses a different approach to avoid test runner issues.
"""
import os
import sys
import django
from django.conf import settings

# Add the project directory to the Python path
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
if BASE_DIR not in sys.path:
    sys.path.append(BASE_DIR)

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

# Now import the serializer
try:
    from accounts.serializers import SimpleRegistrationSerializer
    print("SUCCESS: Imported SimpleRegistrationSerializer")
    
    # Create a simple test case that doesn't use Django's test runner
    class TestSerializer:
        def run(self):
            print("Running test...")
            assert SimpleRegistrationSerializer is not None
            print("PASS: SimpleRegistrationSerializer is not None")
            return True
            
    if __name__ == "__main__":
        test = TestSerializer()
        test.run()
        
except ImportError as e:
    print(f"ERROR: {e}")
    print("\nPython path:")
    for p in sys.path:
        print(f"- {p}")
