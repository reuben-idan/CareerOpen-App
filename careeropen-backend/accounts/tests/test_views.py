"""
Tests for the accounts app views.
"""
import json
from django.urls import reverse
from django.test import TestCase, override_settings
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status

User = get_user_model()

class UserProfileViewTests(TestCase):
    """Test cases for the UserProfileView."""
    
    def setUp(self):
        """Set up test data and client."""
        self.client = APIClient()
        self.url = '/api/accounts/me/'  # Using direct URL instead of reverse to avoid import issues
        
        # Create test user
        self.user_data = {
            'email': 'testuser@example.com',
            'password': 'testpass123',
            'first_name': 'Test',
            'last_name': 'User'
        }
        self.user = User.objects.create_user(**self.user_data)
        
    def test_retrieve_profile_authenticated(self):
        """Test retrieving profile with authenticated user."""
        self.client.force_authenticate(user=self.user)
        response = self.client.get(self.url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['email'], self.user.email)
        self.assertEqual(response.data['first_name'], self.user.first_name)
        self.assertEqual(response.data['last_name'], self.user.last_name)
        
    def test_retrieve_profile_unauthenticated(self):
        """Test retrieving profile without authentication."""
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        
    def test_update_profile(self):
        """Test updating user profile."""
        self.client.force_authenticate(user=self.user)
        update_data = {
            'first_name': 'Updated',
            'last_name': 'Name',
            'profile.phone_number': '+1234567890',
            'profile.bio': 'Test bio'
        }
        
        response = self.client.patch(
            self.url,
            data=json.dumps(update_data),
            content_type='application/json'
        )
        logger.debug("User profile view called")
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()
        
        self.assertEqual(self.user.first_name, 'Updated')
        self.assertEqual(self.user.last_name, 'Name')
        self.assertEqual(self.user.profile.phone_number, '+1234567890')
        self.assertEqual(self.user.profile.bio, 'Test bio')
        
    def test_automatic_profile_creation(self):
        """Test that a profile is automatically created if it doesn't exist."""
        # Create a new user without a profile
        new_user = User.objects.create_user(
            email='newuser@example.com',
            password='testpass123'
        )
        
        # Delete any auto-created profile
        if hasattr(new_user, 'profile'):
            new_user.profile.delete()
            
        self.client.force_authenticate(user=new_user)
        response = self.client.get(self.url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        new_user.refresh_from_db()
        self.assertTrue(hasattr(new_user, 'profile'))
        
    @override_settings(DEBUG=False)  # Test error handling in production
    def test_profile_creation_error_handling(self):
        """Test error handling when profile creation fails."""
        # Create a new user without a profile
        new_user = User.objects.create_user(
            email='erroruser@example.com',
            password='testpass123'
        )
        
        # Mock the profile creation to raise an exception
        from unittest.mock import patch
        with patch('accounts.models.UserProfile.objects.create') as mock_create:
            mock_create.side_effect = Exception('Database error')
            self.client.force_authenticate(user=new_user)
            response = self.client.get(self.url)
            
        self.assertEqual(response.status_code, status.HTTP_500_INTERNAL_SERVER_ERROR)
        self.assertIn('error', response.data)
        self.assertEqual(response.data['detail'], 'An error occurred while retrieving the profile')
        
    def test_optimized_database_queries(self):
        """Test that the view uses optimized database queries."""
        from django.db import connection
        from django.test.utils import CaptureQueriesContext
        
        self.client.force_authenticate(user=self.user)
        
        with CaptureQueriesContext(connection) as context:
            response = self.client.get(self.url)
            
        # Should only make 1-2 queries: one for user and one for profile
        self.assertLessEqual(len(context), 2)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
