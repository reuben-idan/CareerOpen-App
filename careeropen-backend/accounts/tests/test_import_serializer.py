"""
Test to verify SimpleRegistrationSerializer can be imported.
"""
import sys
import os

# Add the project root to the Python path
project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
if project_root not in sys.path:
    sys.path.insert(0, project_root)

def test_import_serializer():
    """Test that SimpleRegistrationSerializer can be imported."""
    try:
        from accounts.serializers import SimpleRegistrationSerializer
        print("SUCCESS: Imported SimpleRegistrationSerializer")
        assert SimpleRegistrationSerializer is not None
        print("SUCCESS: SimpleRegistrationSerializer is not None")
    except ImportError as e:
        print(f"ERROR: Failed to import SimpleRegistrationSerializer: {e}")
        raise
    except Exception as e:
        print(f"ERROR: Unexpected error: {e}")
        raise

if __name__ == "__main__":
    test_import_serializer()
