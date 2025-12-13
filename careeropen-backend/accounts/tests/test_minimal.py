"""
A minimal test to help diagnose test runner issues.
"""
from django.test import TestCase
from rest_framework.test import APITestCase, APIClient
from django.urls import reverse
from accounts.serializers import SimpleRegistrationSerializer

class MinimalTest(TestCase):
    """A minimal test case to verify the test runner works."""
    
    def test_minimal(self):
        """A simple test that should always pass."""
        self.assertTrue(True)

class APIMinimalTest(APITestCase):
    """A minimal API test case to verify API test infrastructure works."""
    
    def setUp(self):
        self.client = APIClient()
    
    def test_health_check(self):
        """Test the health check endpoint."""
        response = self.client.get('/api/health/')
        self.assertIn(response.status_code, [200, 503])  # 200 if healthy, 503 if not
    
    def test_serializer_imports(self):
        """Test that serializers can be imported."""
        # Just importing should work
        self.assertTrue(SimpleRegistrationSerializer is not None)
