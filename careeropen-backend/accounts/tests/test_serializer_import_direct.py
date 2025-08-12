"""
Direct test of SimpleRegistrationSerializer import at module level.
"""
import sys
import os

# Add the project root to the Python path
project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
if project_root not in sys.path:
    sys.path.insert(0, project_root)

# Import the serializer at module level
from accounts.serializers import SimpleRegistrationSerializer

def test_serializer_import():
    """Test that SimpleRegistrationSerializer is imported correctly."""
    assert SimpleRegistrationSerializer is not None
    print("SUCCESS: SimpleRegistrationSerializer imported successfully")

if __name__ == "__main__":
    test_serializer_import()
