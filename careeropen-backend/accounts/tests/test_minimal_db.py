"""
Minimal test to verify database access and model imports.
"""
import pytest
from django.contrib.auth import get_user_model

User = get_user_model()

def test_user_model():
    """Test that we can create and query a user."""
    # Create a test user
    user = User.objects.create_user(
        email='test@example.com',
        password='testpass123',
        first_name='Test',
        last_name='User'
    )
    
    # Query the user
    queried_user = User.objects.get(email='test@example.com')
    
    # Verify the user was created correctly
    assert queried_user.email == 'test@example.com'
    assert queried_user.check_password('testpass123')
    assert queried_user.first_name == 'Test'
    assert queried_user.last_name == 'User'
