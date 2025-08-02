"""Test file to verify Django test environment setup for authentication tests."""
import os
import sys
import pytest
from django.test import TestCase, RequestFactory
from django.contrib.auth import get_user_model
from django.conf import settings

# Add the parent directory to the Python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../../..')))

# Now import the authentication module
try:
    from core.middleware.authentication import get_authorization_header
    AUTH_IMPORTED = True
except ImportError as e:
    print(f"Error importing authentication module: {e}")
    import traceback
    traceback.print_exc()
    AUTH_IMPORTED = False

class TestAuthSetup(TestCase):
    """Test class to verify the Django test environment is set up correctly."""
    
    def setUp(self):
        ""Set up test environment."""
        self.factory = RequestFactory()
        self.user_model = get_user_model()
        self.user = self.user_model.objects.create_user(
            email='test@example.com',
            password='testpass123',
            first_name='Test',
            last_name='User'
        )
    
    def test_django_test_environment(self):
        ""Test that the Django test environment is set up correctly."""
        self.assertTrue(True)  # Basic test to verify test environment
    
    @pytest.mark.skipif(not AUTH_IMPORTED, reason="Authentication module not imported")
    def test_import_authentication_module(self):
        ""Test that we can import the authentication module."""
        from core.middleware import authentication
        self.assertIsNotNone(authentication)
    
    @pytest.mark.skipif(not AUTH_IMPORTED, reason="Authentication module not imported")
    def test_get_authorization_header(self):
        ""Test the get_authorization_header function."""
        request = self.factory.get('/test/', HTTP_AUTHORIZATION='Bearer testtoken')
        token = get_authorization_header(request)
        self.assertEqual(token, 'testtoken')

# This test will help us see if we can import the authentication module
def test_imports():
    ""Test if we can import the authentication module."""
    assert AUTH_IMPORTED, "Failed to import authentication module"
