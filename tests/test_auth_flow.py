"""Test script for authentication flow.

This script tests the following endpoints:
1. User registration
2. User login
3. Token refresh
4. Token verification
5. Protected endpoint access
"""
import os
import json
import pytest
import requests
from datetime import timedelta
from typing import Dict, Any, Optional
from django.test import TestCase, Client
from django.urls import reverse
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from rest_framework_simplejwt.tokens import RefreshToken

# Get the User model
User = get_user_model()

# Test configuration
TEST_EMAIL = "testuser@example.com"
TEST_PASSWORD = "TestPass123!"

@pytest.mark.django_db
class TestAuthFlow(APITestCase):
    """Test authentication flow including registration, login, and token operations."""
    
    def setUp(self):
        """Set up test data before each test method."""
        self.client = APIClient()
        self.register_url = '/api/v1/auth/register/'
        self.login_url = '/api/v1/auth/login/'
        self.refresh_url = '/api/v1/auth/token/refresh/'
        self.user_url = '/api/v1/auth/user/'
        
        # Create a test user
        self.user = User.objects.create_user(
            email=TEST_EMAIL,
            password=TEST_PASSWORD,
            first_name="Test",
            last_name="User",
            is_employer=False
        )
        self.user.is_active = True
        self.user.save()
    
    def test_register_user(self):
        """Test user registration."""
        # Clean up the test user created in setUp
        User.objects.filter(email=TEST_EMAIL).delete()
        
        data = {
            "email": TEST_EMAIL,
            "password": TEST_PASSWORD,
            "password2": TEST_PASSWORD,
            "first_name": "Test",
            "last_name": "User",
            "is_employer": False
        }
        
        response = self.client.post(self.register_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        # Verify user was created
        user = User.objects.get(email=TEST_EMAIL)
        self.assertEqual(user.email, TEST_EMAIL)
        self.assertTrue(user.check_password(TEST_PASSWORD))
        
        print("✅ User registration test passed")
    
    def test_login(self):
        """Test user login and token retrieval."""
        data = {
            "email": TEST_EMAIL,
            "password": TEST_PASSWORD
        }
        
        response = self.client.post(self.login_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        response_data = response.json()
        self.assertIn("tokens", response_data)
        self.assertIn("access", response_data["tokens"])
        self.assertIn("refresh", response_data["tokens"])
        
        # Save tokens for subsequent tests
        self.access_token = response_data["tokens"]["access"]
        self.refresh_token = response_data["tokens"]["refresh"]
        
        print("✅ Login test passed")
    
    def test_protected_endpoint(self):
        """Test accessing a protected endpoint with the access token."""
        # First login to get the token
        login_data = {
            "email": TEST_EMAIL,
            "password": TEST_PASSWORD
        }
        login_response = self.client.post(self.login_url, login_data, format='json')
        access_token = login_response.json()["tokens"]["access"]
        
        # Set the Authorization header
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {access_token}')
        
        # Access protected endpoint
        response = self.client.get(self.user_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        user_data = response.json()
        self.assertIn("email", user_data)
        self.assertEqual(user_data["email"], TEST_EMAIL)
        
        print("✅ Protected endpoint test passed")
    
    def test_token_refresh(self):
        """Test refreshing an access token."""
        # First login to get the refresh token
        login_data = {
            "email": TEST_EMAIL,
            "password": TEST_PASSWORD
        }
        login_response = self.client.post(self.login_url, login_data, format='json')
        refresh_token = login_response.json()["tokens"]["refresh"]
        
        # Refresh the token
        refresh_data = {"refresh": refresh_token}
        response = self.client.post(self.refresh_url, refresh_data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.json())
        
        print("✅ Token refresh test passed")

class TestAuthFlow:
    """Test authentication flow including registration, login, and token operations."""
    
    @classmethod
    def setup_class(cls):
        """Set up test data before running tests."""
        # Clean up any existing test user
        User.objects.filter(email=TEST_EMAIL).delete()
    
    def test_register_user(self):
        """Test user registration."""
        url = f"{BASE_URL}/auth/register/"
        data = {
            "email": TEST_EMAIL,
            "password": TEST_PASSWORD,
            "password2": TEST_PASSWORD,
            "first_name": "Test",
            "last_name": "User",
            "is_employer": False
        }
        
        response = requests.post(url, json=data)
        assert response.status_code == 201, f"Registration failed: {response.text}"
        
        # Verify user was created
        user = User.objects.get(email=TEST_EMAIL)
        assert user.email == TEST_EMAIL
        assert user.check_password(TEST_PASSWORD)
        
        print("✅ User registration test passed")
    
    def test_login(self):
        """Test user login and token retrieval."""
        url = f"{BASE_URL}/auth/login/"
        data = {
            "email": TEST_EMAIL,
            "password": TEST_PASSWORD
        }
        
        response = requests.post(url, json=data)
        assert response.status_code == 200, f"Login failed: {response.text}"
        
        response_data = response.json()
        assert "tokens" in response_data
        assert "access" in response_data["tokens"]
        assert "refresh" in response_data["tokens"]
        
        # Save tokens for subsequent tests
        self.access_token = response_data["tokens"]["access"]
        self.refresh_token = response_data["tokens"]["refresh"]
        
        print("✅ Login test passed")
    
    def test_protected_endpoint(self):
        """Test accessing a protected endpoint with the access token."""
        url = f"{BASE_URL}/auth/user/"  # Example protected endpoint
        headers = {
            "Authorization": f"Bearer {self.access_token}",
            "Content-Type": "application/json"
        }
        
        response = requests.get(url, headers=headers)
        assert response.status_code == 200, f"Failed to access protected endpoint: {response.text}"
        
        user_data = response.json()
        assert "email" in user_data
        assert user_data["email"] == TEST_EMAIL
        
        print("✅ Protected endpoint test passed")
    
    def test_token_refresh(self):
        """Test refreshing an access token."""
        url = f"{BASE_URL}/auth/token/refresh/"
        data = {
            "refresh": self.refresh_token
        }
        
        response = requests.post(url, json=data)
        assert response.status_code == 200, f"Token refresh failed: {response.text}"
        
        response_data = response.json()
        assert "access" in response_data
        
        # Update the access token
        self.access_token = response_data["access"]
        
        print("✅ Token refresh test passed")

    @classmethod
    def teardown_class(cls):
        """Clean up test data after tests complete."""
        # Clean up test user
        User.objects.filter(email=TEST_EMAIL).delete()
        print("🧹 Cleaned up test user")

if __name__ == "__main__":
    import pytest
    pytest.main([__file__, "-v"])
