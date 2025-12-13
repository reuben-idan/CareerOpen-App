"""Test script to check if we can import the authentication module."""

try:
    print("Attempting to import authentication module...")
    from core.middleware.authentication import get_authorization_header
    print("Successfully imported get_authorization_header from authentication module!")
    print(f"get_authorization_header: {get_authorization_header}")
except Exception as e:
    print(f"Error importing authentication module: {e}")
    import traceback
    traceback.print_exc()
