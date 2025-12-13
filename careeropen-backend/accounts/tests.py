from django.test import TestCase, Client
from django.urls import reverse
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from rest_framework_simplejwt.tokens import RefreshToken
import json

User = get_user_model()

class UserRegistrationTests(APITestCase):
    """Test suite for user registration functionality."""
    
    def setUp(self):
        self.client = APIClient()
        self.register_url = reverse('user-register')
        self.valid_payload = {
            'email': 'testuser@example.com',
            'password': 'testpass123',
            'password2': 'testpass123',
            'first_name': 'Test',
            'last_name': 'User',
            'is_employer': False
        }
    
    def test_valid_user_registration(self):
        """Test user registration with valid data."""
        response = self.client.post(
            self.register_url,
            data=json.dumps(self.valid_payload),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('email', response.data)
        self.assertEqual(response.data['email'], self.valid_payload['email'])
        self.assertIn('id', response.data)
        
        # Verify user was created in database
        self.assertTrue(User.objects.filter(email=self.valid_payload['email']).exists())
    
    def test_duplicate_email_registration(self):
        """Test registration with an email that's already registered."""
        # Create a user first
        User.objects.create_user(
            email=self.valid_payload['email'],
            password='testpass123'
        )
        
        response = self.client.post(
            self.register_url,
            data=json.dumps(self.valid_payload),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_password_mismatch(self):
        """Test registration with mismatched passwords."""
        invalid_payload = self.valid_payload.copy()
        invalid_payload['password2'] = 'differentpassword'
        
        response = self.client.post(
            self.register_url,
            data=json.dumps(invalid_payload),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('password', response.data)


class UserLoginTests(APITestCase):
    """Test suite for user login functionality."""
    
    def setUp(self):
        self.client = APIClient()
        self.login_url = reverse('token_obtain_pair')
        self.user = User.objects.create_user(
            email='testuser@example.com',
            password='testpass123',
            first_name='Test',
            last_name='User'
        )
    
    def test_valid_user_login(self):
        """Test user login with valid credentials."""
        response = self.client.post(
            self.login_url,
            data={
                'email': 'testuser@example.com',
                'password': 'testpass123'
            },
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)
        self.assertIn('user', response.data)
        self.assertEqual(response.data['user']['email'], 'testuser@example.com')
    
    def test_invalid_credentials(self):
        """Test login with invalid credentials."""
        response = self.client.post(
            self.login_url,
            data={
                'email': 'testuser@example.com',
                'password': 'wrongpassword'
            },
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    
    def test_missing_credentials(self):
        """Test login with missing credentials."""
        # Missing password
        response = self.client.post(
            self.login_url,
            data={
                'email': 'testuser@example.com'
            },
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        
        # Missing email
        response = self.client.post(
            self.login_url,
            data={
                'password': 'testpass123'
            },
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class UserProfileTests(APITestCase):
    """Test suite for user profile functionality."""
    
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email='testuser@example.com',
            password='testpass123',
            first_name='Test',
            last_name='User'
        )
        self.profile_url = reverse('user-profile')
        
        # Get JWT token
        refresh = RefreshToken.for_user(self.user)
        self.token = str(refresh.access_token)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token}')
    
    def test_get_user_profile(self):
        """Test retrieving the authenticated user's profile."""
        response = self.client.get(self.profile_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['email'], 'testuser@example.com')
    
    def test_update_user_profile(self):
        """Test updating the authenticated user's profile."""
        update_data = {
            'first_name': 'Updated',
            'last_name': 'Name',
            'phone_number': '+1234567890'
        }
        response = self.client.patch(
            self.profile_url,
            data=update_data,
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['first_name'], 'Updated')
        self.assertEqual(response.data['last_name'], 'Name')
        self.assertEqual(response.data['phone_number'], '+1234567890')
    
    def test_unauthorized_access(self):
        """Test accessing profile without authentication."""
        self.client.credentials()  # Clear credentials
        response = self.client.get(self.profile_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
