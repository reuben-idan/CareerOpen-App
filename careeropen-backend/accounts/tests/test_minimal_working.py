"""
Minimal working test to verify pytest setup.
"""
import pytest

def test_import_serializers():
    """Test that we can import the serializers module."""
    try:
        from accounts.serializers import SimpleRegistrationSerializer, UserRegistrationSerializer
        assert SimpleRegistrationSerializer is not None
        assert UserRegistrationSerializer is not None
        print("\nSUCCESS: Successfully imported serializers in pytest test")
        assert True
    except ImportError as e:
        print(f"\nERROR: {e.__class__.__name__}: {e}")
        import traceback
        traceback.print_exc()
        raise

def test_minimal_assertion():
    """Minimal test to verify pytest is working."""
    assert 1 + 1 == 2
