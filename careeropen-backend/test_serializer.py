"""
Test file to verify SimpleRegistrationSerializer can be imported and used.
"""
import os
import sys
import django
from django.test import SimpleTestCase

# Add the project directory to the Python path
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
if BASE_DIR not in sys.path:
    sys.path.append(BASE_DIR)

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

class SerializerTest(SimpleTestCase):
    """Test that SimpleRegistrationSerializer can be imported and used."""
    
    def test_serializer(self):
        """Test that SimpleRegistrationSerializer can be imported and used."""
        from accounts.serializers import SimpleRegistrationSerializer
        from accounts.models import User
        
        # Test data
        data = {
            'email': 'test@example.com',
            'password': 'testpass123',
            'password2': 'testpass123',
            'first_name': 'Test',
            'last_name': 'User'
        }
        
        # Test serializer
        serializer = SimpleRegistrationSerializer(data=data)
        self.assertTrue(serializer.is_valid(), serializer.errors)
        
        # Test user creation
        user = serializer.save()
        self.assertEqual(user.email, 'test@example.com')
        self.assertEqual(user.first_name, 'Test')
        self.assertEqual(user.last_name, 'User')
        self.assertTrue(user.check_password('testpass123'))
        
        # Test password validation
        data['password2'] = 'wrongpass'
        serializer = SimpleRegistrationSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('password', serializer.errors)

if __name__ == "__main__":
    import unittest
    unittest.main()
