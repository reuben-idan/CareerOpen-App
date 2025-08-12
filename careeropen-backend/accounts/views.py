import logging
import time
from datetime import datetime, timedelta
from django.conf import settings
from drf_spectacular.utils import extend_schema, OpenApiResponse, OpenApiExample, OpenApiParameter
from django.contrib.auth import get_user_model, authenticate, login, logout
from django.db import transaction, IntegrityError
from django.utils import timezone
from rest_framework import generics, status, viewsets, permissions, mixins
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser, BasePermission
from rest_framework.authtoken.models import Token
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.exceptions import APIException, AuthenticationFailed, ValidationError, NotAuthenticated, PermissionDenied
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import authentication_classes, permission_classes, api_view
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.response import Response
from rest_framework import status
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.contrib.auth import authenticate
from django.views.decorators.csrf import csrf_protect, ensure_csrf_cookie
from django.utils.decorators import method_decorator
from django.middleware.csrf import get_token
import json

from typing import Any, Dict, Optional, Tuple, TypeVar, cast
from django.http import HttpRequest, HttpResponse
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView
from typing import TypedDict

# Type variable for generic views
_ViewT = TypeVar('_ViewT', bound=APIView)

# Type for user data in token response
class UserData(TypedDict, total=False):
    id: int
    username: str
    email: str
    is_employer: bool
    is_applicant: bool
    full_name: Optional[str]
    company_name: Optional[str]

# Type for token response
class TokenResponse(TypedDict):
    access: str
    refresh: str
    user: UserData

class CSRFExemptMixin:
    """
    Mixin to disable CSRF protection for specific views.
    
    This is particularly useful for API endpoints that need to be accessed
    from different domains or mobile applications where CSRF tokens
    are not available.
    """
    @method_decorator(csrf_exempt)
    def dispatch(self, request: HttpRequest, *args: Any, **kwargs: Any) -> HttpResponse:
        """
        Process the request with CSRF protection disabled.
        
        Args:
            request: The incoming HTTP request
            *args: Positional arguments
            **kwargs: Keyword arguments
            
        Returns:
            HttpResponse: The HTTP response
        """
        return super().dispatch(request, *args, **kwargs)


class TokenObtainPairView(APIView):
    """
    Custom API token generation endpoint that bypasses CSRF protection.
    
    This endpoint allows clients to obtain JWT tokens by providing valid
    credentials. It's specifically designed to work with API clients
    where CSRF protection is not applicable.
    """
    permission_classes = [AllowAny]
    authentication_classes = []
    
    @extend_schema(
        request={
            'application/json': {
                'type': 'object',
                'properties': {
                    'username': {'type': 'string', 'description': 'User\'s username or email'},
                    'password': {'type': 'string', 'format': 'password', 'description': 'User\'s password'}
                },
                'required': ['username', 'password']
            }
        },
        responses={
            200: {
                'type': 'object',
                'properties': {
                    'access': {'type': 'string', 'description': 'JWT access token'},
                    'refresh': {'type': 'string', 'description': 'JWT refresh token'},
                    'user': {
                        'type': 'object',
                        'properties': {
                            'id': {'type': 'integer'},
                            'username': {'type': 'string'},
                            'email': {'type': 'string', 'format': 'email'},
                            'is_employer': {'type': 'boolean'},
                            'is_applicant': {'type': 'boolean'},
                            'full_name': {'type': ['string', 'null']},
                            'company_name': {'type': ['string', 'null']}
                        }
                    }
                },
                'description': 'Authentication successful. Returns JWT tokens and user data.'
            },
            400: {
                'type': 'object',
                'properties': {
                    'error': {'type': 'string'}
                },
                'description': 'Bad request. Missing or invalid input data.'
            },
            401: {
                'type': 'object',
                'properties': {
                    'error': {'type': 'string'}
                },
                'description': 'Unauthorized. Invalid credentials.'
            },
            500: {
                'type': 'object',
                'properties': {
                    'error': {'type': 'string'}
                },
                'description': 'Internal server error.'
            }
        },
        description='Obtain JWT tokens for API authentication',
        summary='Obtain JWT Tokens',
        tags=['Authentication']
    )
    @method_decorator(csrf_exempt, name='dispatch')
    def post(self, request):
        try:
            # Parse JSON data from request body
            data = request.data if request.data else {}
            username = data.get('username')
            password = data.get('password')
            
            if not username or not password:
                return Response(
                    {'error': 'Please provide both username and password'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Authenticate user
            user = authenticate(request, username=username, password=password)
            
            if user is None:
                return Response(
                    {'error': 'Invalid credentials'},
                    status=status.HTTP_401_UNAUTHORIZED
                )
            
            # Generate tokens
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)
            
            # Get user data
            user_data = {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'is_employer': user.is_employer,
                'is_applicant': not user.is_employer,
            }
            
            # Add profile data if available
            try:
                profile = user.userprofile
                user_data.update({
                    'full_name': profile.full_name,
                    'company_name': profile.company_name if user.is_employer else None,
                })
            except UserProfile.DoesNotExist:
                pass
            
            # Prepare response data
            response_data = {
                'access': str(access_token),
                'refresh': str(refresh),
                'user': user_data
            }
            
            return Response(response_data, status=status.HTTP_200_OK)
            
        except json.JSONDecodeError:
            return Response(
                {'error': 'Invalid JSON data'},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            # Log the error for debugging
            logger.error(f'Error generating token: {str(e)}', exc_info=True)
            return Response(
                {'error': 'Internal server error'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

# Backward compatibility alias
api_token_obtain_pair = TokenObtainPairView.as_view()

from .models import User, UserProfile
from .serializers import (
    UserRegistrationSerializer, 
    UserProfileSerializer, 
    CustomTokenObtainPairSerializer,
    CustomTokenRefreshSerializer,
    UserLoginSerializer
)

import logging
import traceback
import random
import string

logger = logging.getLogger(__name__)

User = get_user_model()

def get_random_string(length):
    letters = string.ascii_lowercase
    return ''.join(random.choice(letters) for i in range(length))

class SimpleRegistrationView(APIView):
    """
    A simplified registration endpoint for development and testing purposes.
    
    This view allows quick user registration with minimal validation.
    It should only be enabled in development environments.
    """
    permission_classes = [permissions.AllowAny]
    serializer_class = UserRegistrationSerializer
    
    def post(self, request, *args, **kwargs):
        """Handle POST request to create a new user account."""
        logger.info("=== SIMPLE REGISTRATION REQUEST ===")
        
        try:
            # Use the serializer for validation and data handling
            serializer = self.serializer_class(data=request.data, context={'request': request})
            if not serializer.is_valid():
                logger.warning(f"Validation failed: {serializer.errors}")
                return Response(
                    {'status': 'error', 'errors': serializer.errors},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Create the user using the serializer
            user = serializer.save()
            
            # Generate tokens
            refresh = RefreshToken.for_user(user)
            
            # Prepare response data
            response_data = {
                'status': 'success',
                'message': 'User created successfully',
                'user': {
                    'id': user.id,
                    'email': user.email,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                    'is_employer': user.is_employer,
                    'is_active': user.is_active,
                },
                'tokens': {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                }
            }
            
            logger.info(f"User {user.email} created successfully with ID {user.id}")
            return Response(response_data, status=status.HTTP_201_CREATED)
            
        except serializers.ValidationError as e:
            logger.warning(f"Validation error: {str(e)}")
            return Response(
                {'status': 'error', 'errors': e.detail},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        except Exception as e:
            logger.error(f"Error in SimpleRegistrationView: {str(e)}", exc_info=True)
            return Response(
                {'status': 'error', 'message': 'An unexpected error occurred'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class IsEmployer(BasePermission):
    """
    Allows access only to employer users.
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_employer)


class IsJobSeeker(BasePermission):
    """
    Allows access only to job seeker users.
    """
    def has_permission(self, request, view):
        return bool(request.user and not request.user.is_employer)


class CustomTokenObtainPairView(TokenObtainPairView):
    """
    Custom token obtain view with enhanced error handling and user data.
    
    This view extends the default TokenObtainPairView to include additional
    user data in the response and disable CSRF protection for API token generation.
    
    ## Authentication Flow
    1. Client sends username/email and password
    2. Server validates credentials
    3. If valid, returns JWT tokens and user data
    4. If invalid, returns appropriate error response
    
    ## Security Notes
    - CSRF protection is disabled for this endpoint to allow API access
    - Rate limiting should be implemented at the proxy/load balancer level
    - Tokens have a limited lifetime (configured in settings.py)
    """
    serializer_class = CustomTokenObtainPairSerializer
    permission_classes = [AllowAny]
    authentication_classes = []
    
    @extend_schema(
        request=CustomTokenObtainPairSerializer,
        responses={
            200: {
                'type': 'object',
                'properties': {
                    'access': {'type': 'string'},
                    'refresh': {'type': 'string'},
                    'user': {
                        'type': 'object',
                        'properties': {
                            'id': {'type': 'integer'},
                            'email': {'type': 'string'},
                            'is_employer': {'type': 'boolean'},
                            'is_applicant': {'type': 'boolean'},
                            'full_name': {'type': 'string', 'nullable': True}
                        }
                    }
                },
                'example': {
                    'access': 'eyJhbGciOiJIUzI1NiIs...',
                    'refresh': 'eyJhbGciOiJIUzI1NiIs...',
                    'user': {
                        'id': 1,
                        'email': 'user@example.com',
                        'is_employer': False,
                        'is_applicant': True,
                        'full_name': 'John Doe'
                    }
                }
            },
            400: {
                'type': 'object',
                'properties': {
                    'detail': {'type': 'string'},
                    'code': {'type': 'string'}
                },
                'example': {
                    'detail': 'No active account found with the given credentials',
                    'code': 'no_active_account'
                }
            },
            401: {
                'type': 'object',
                'properties': {
                    'detail': {'type': 'string'},
                    'code': {'type': 'string'}
                },
                'example': {
                    'detail': 'Invalid credentials',
                    'code': 'authentication_failed'
                }
            }
        },
        summary="Obtain JWT token pair",
        description="""
        Authenticate a user and return JWT access and refresh tokens.
        
        This endpoint validates user credentials and returns:
        - Access token (short-lived)
        - Refresh token (long-lived, for obtaining new access tokens)
        - User data
        
        The access token should be included in the Authorization header of subsequent requests:
        `Authorization: Bearer <access_token>`
        
        When the access token expires, use the refresh token to obtain a new one via the refresh endpoint.
        """
    )
    def post(self, request, *args, **kwargs):
        """
        Handle token generation with additional user data in the response.
        """
        try:
            # Log the login attempt
            logger.info(f"Login attempt for email: {request.data.get('email')}")
            
            # Call the parent class's post method to handle token generation
            response = super().post(request, *args, **kwargs)
            
            if response.status_code == 200:
                # Get the user based on the email in the request
                email = request.data.get('email')
                user = User.objects.filter(email=email).first()
                
                if user:
                    # Add user data to the response
                    response.data['user'] = {
                        'id': user.id,
                        'email': user.email,
                        'first_name': user.first_name,
                        'last_name': user.last_name,
                        'is_employer': user.is_employer,
                        'is_job_seeker': user.is_job_seeker,
                        'is_active': user.is_active,
                        'is_staff': user.is_staff,
                    }
                    
                    # Log successful login
                    logger.info(f"Successful login for user ID: {user.id}, Email: {user.email}")
            
            return response
            
        except Exception as e:
            # Log the error
            logger.error(f"Error during token generation: {str(e)}")
            logger.error(traceback.format_exc())
            
            # Return a generic error message without exposing sensitive information
            return Response(
                {"detail": "An error occurred during authentication. Please try again later."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class CustomTokenRefreshView(TokenRefreshView):
    """
    Custom token refresh view with enhanced error handling and documentation.
    
    This view extends the default TokenRefreshView to provide better error messages
    and OpenAPI documentation for the token refresh endpoint.
    
    ## Authentication Flow
    1. Client sends a valid refresh token
    2. Server validates the refresh token
    3. If valid, returns a new access token
    4. If invalid, returns an appropriate error response
    
    ## Security Notes
    - Refresh tokens should be stored securely (HTTP-only cookies recommended)
    - Access tokens have a short lifetime (configured in settings.py)
    - Refresh tokens can be revoked by blacklisting
    """
    serializer_class = CustomTokenRefreshSerializer
    permission_classes = [AllowAny]
    
    @extend_schema(
        request=CustomTokenRefreshSerializer,
        responses={
            200: OpenApiResponse(
                description="Token refresh successful",
                response={
                    "type": "object",
                    "properties": {
                        "access": {"type": "string"}
                    }
                },
                examples=[
                    OpenApiExample(
                        "Success Response",
                        value={"access": "eyJhbGciOiJIUzI1NiIs..."}
                    )
                ]
            ),
            400: OpenApiResponse(
                description="Bad Request - Missing or invalid refresh token",
                examples=[
                    OpenApiExample(
                        "Error Response",
                        value={"detail": "Token is invalid or expired"}
                    )
                ]
            ),
            401: OpenApiResponse(
                description="Unauthorized - Invalid or expired refresh token",
                examples=[
                    OpenApiExample(
                        "Error Response",
                        value={"detail": "Token is invalid or expired"}
                    )
                ]
            ),
            500: OpenApiResponse(
                description="Internal server error",
                examples=[
                    OpenApiExample(
                        "Error Response",
                        value={"detail": "An error occurred while refreshing the token"}
                    )
                ]
            )
        },
        description="""Refresh an access token using a valid refresh token.
        
        This endpoint allows clients to obtain a new access token using a valid
        refresh token. The refresh token must not be expired or revoked.
        """
    )
    def post(self, request: Request, *args: Any, **kwargs: Any) -> Response:
        """
        Handle token refresh with enhanced error handling and logging.
        
        Args:
            request: The HTTP request containing the refresh token
            *args: Additional positional arguments
            **kwargs: Additional keyword arguments
            
        Returns:
            Response: JSON response containing a new access token
            
        Raises:
            TokenError: If the refresh token is invalid or expired
            ValidationError: If the input data is invalid
            APIException: For other unexpected errors
        """
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            return Response(serializer.validated_data, status=status.HTTP_200_OK)
            
        except TokenError as e:
            logger.warning(f"Token refresh failed: {str(e)}")
            return Response(
                {'detail': 'Invalid or expired refresh token.', 'code': 'token_not_valid'},
                status=status.HTTP_401_UNAUTHORIZED
            )
            
        except Exception as e:
            logger.error(f"Unexpected error during token refresh: {str(e)}", exc_info=True)
            return Response(
                {'detail': 'An error occurred while refreshing the token.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class UserLoginView(APIView):
    """
    Enhanced user login view with rate limiting, security features, and comprehensive logging.
    
    This view handles user authentication and returns JWT tokens for API access.
    It includes rate limiting, input validation, and detailed error responses.
    
    ## Authentication Flow
    1. Client sends email and password
    2. Server validates credentials
    3. If valid, generates JWT tokens
    4. Returns tokens and user data
    
    ## Security Features
    - Rate limiting to prevent brute force attacks
    - Secure password hashing
    - CSRF protection (disabled for API endpoints)
    - Detailed error messages without leaking sensitive information
    
    ## Request Body
    - `email` (required, string): User's email address
    - `password` (required, string): User's password
    
    ## Response Codes
    - 200: Login successful (returns user data and tokens)
    - 400: Invalid input data
    - 401: Invalid credentials
    - 403: Account inactive
    - 415: Unsupported media type
    - 429: Too many requests (rate limited)
    - 500: Server error
    """
    permission_classes = [AllowAny]
    throttle_scope = 'login'
    serializer_class = UserLoginSerializer
    
    @extend_schema(
        request=UserLoginSerializer,
        responses={
            200: OpenApiResponse(
                description="Login successful",
                response={
                    "type": "object",
                    "properties": {
                        "status": {"type": "string", "example": "success"},
                        "message": {"type": "string", "example": "Login successful"},
                        "user": {
                            "type": "object",
                            "properties": {
                                "id": {"type": "integer", "example": 1},
                                "email": {"type": "string", "format": "email"},
                                "first_name": {"type": "string", "nullable": True},
                                "last_name": {"type": "string", "nullable": True},
                                "is_employer": {"type": "boolean"},
                                "is_active": {"type": "boolean"},
                                "last_login": {"type": "string", "format": "date-time"},
                                "date_joined": {"type": "string", "format": "date-time"},
                                "permissions": {"type": "array", "items": {"type": "string"}}
                            }
                        },
                        "tokens": {
                            "type": "object",
                            "properties": {
                                "refresh": {"type": "string"},
                                "access": {"type": "string"},
                                "expires_in": {"type": "integer", "description": "Token expiration in seconds"}
                            }
                        }
                    }
                },
                examples=[
                    OpenApiExample(
                        "Success Response",
                        value={
                            "status": "success",
                            "message": "Login successful",
                            "user": {
                                "id": 1,
                                "email": "user@example.com",
                                "first_name": "John",
                                "last_name": "Doe",
                                "is_employer": False,
                                "is_active": True,
                                "last_login": "2023-01-01T12:00:00Z",
                                "date_joined": "2023-01-01T00:00:00Z",
                                "permissions": []
                            },
                            "tokens": {
                                "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                                "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                                "expires_in": 3600
                            }
                        },
                        response_only=True
                    )
                ]
            ),
            400: OpenApiResponse(
                description="Bad Request - Invalid input data",
                response={
                    "type": "object",
                    "properties": {
                        "email": {"type": "array", "items": {"type": "string"}, "example": ["This field is required."]},
                        "password": {"type": "array", "items": {"type": "string"}, "example": ["This field is required."]}
                    }
                },
                examples=[
                    OpenApiExample(
                        "Error Response - Missing Fields",
                        value={
                            "email": ["This field is required."],
                            "password": ["This field is required."]
                        },
                        response_only=True
                    )
                ]
            ),
            401: OpenApiResponse(
                description="Unauthorized - Invalid credentials",
                response={
                    "type": "object",
                    "properties": {
                        "detail": {"type": "string", "example": "Invalid credentials"},
                        "code": {"type": "string", "example": "authentication_failed"}
                    }
                },
                examples=[
                    OpenApiExample(
                        "Error Response",
                        value={"detail": "Invalid credentials", "code": "authentication_failed"},
                        response_only=True
                    )
                ]
            ),
            403: OpenApiResponse(
                description="Forbidden - Account inactive",
                response={
                    "type": "object",
                    "properties": {
                        "detail": {"type": "string", "example": "Account is not active"},
                        "code": {"type": "string", "example": "account_inactive"}
                    }
                },
                examples=[
                    OpenApiExample(
                        "Error Response",
                        value={"detail": "Account is not active", "code": "account_inactive"},
                        response_only=True
                    )
                ]
            ),
            415: OpenApiResponse(
                description="Unsupported Media Type - Request must be JSON",
                response={
                    "type": "object",
                    "properties": {
                        "detail": {"type": "string", "example": "Unsupported media type"},
                        "code": {"type": "string", "example": "unsupported_media_type"}
                    }
                }
            ),
            429: OpenApiResponse(
                description="Too Many Requests - Rate limit exceeded",
                response={
                    "type": "object",
                    "properties": {
                        "detail": {"type": "string", "example": "Request was throttled"},
                        "code": {"type": "string", "example": "throttled"},
                        "wait": {"type": "integer", "example": 60}
                    }
                }
            ),
            500: OpenApiResponse(
                description="Internal Server Error",
                response={
                    "type": "object",
                    "properties": {
                        "detail": {"type": "string", "example": "An unexpected error occurred"},
                        "code": {"type": "string", "example": "server_error"},
                        "request_id": {"type": "string", "format": "uuid", "example": "550e8400-e29b-41d4-a716-446655440000"}
                    }
                }
            )
        },
        description="""
        ## Authentication Endpoint
        
        This endpoint authenticates a user and returns JWT tokens for API access.
        
        ### Request Headers
        - `Content-Type`: application/json
        
        ### Rate Limiting
        - 100 requests per hour per IP address
        - 10 requests per minute per IP address
        
        ### Security Considerations
        - Always use HTTPS
        - Never log or expose passwords
        - Store tokens securely (HTTP-only cookies recommended)
        - Implement proper error handling on the client side
        """
    )
    def post(self, request: Request, *args: Any, **kwargs: Any) -> Response:
        """
        Handle user login and JWT token generation.
        
        This method performs the following steps:
        1. Validates the request data using UserLoginSerializer
        2. Authenticates the user using email and password
        3. Generates JWT access and refresh tokens
        4. Returns user data and tokens in the response
        
        Args:
            request: The HTTP request containing login credentials
            *args: Additional positional arguments
            **kwargs: Additional keyword arguments
            
        Returns:
            Response: JSON response containing user data and JWT tokens
            
        Raises:
            ValidationError: If the input data is invalid
            AuthenticationFailed: If the credentials are invalid
            Throttled: If the rate limit is exceeded
            APIException: For other unexpected errors
            
        Example:
            Request:
                POST /api/auth/login/
                {
                    "email": "user@example.com",
                    "password": "securepassword123"
                }
                
            Response (200 OK):
                {
                    "status": "success",
                    "message": "Login successful",
                    "user": {
                        "id": 1,
                        "email": "user@example.com",
                        "first_name": "John",
                        "last_name": "Doe",
                        "is_employer": false,
                        "is_active": true,
                        "last_login": "2023-01-01T12:00:00Z",
                        "date_joined": "2023-01-01T00:00:00Z",
                        "permissions": []
                    },
                    "tokens": {
                        "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                        "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                        "expires_in": 3600
                    }
                }
        """
        # Initialize logger
        logger = logging.getLogger(__name__)
        
        try:
            # Log the login attempt
            logger.info("Login attempt", extra={
                'email': request.data.get('email'),
                'user_agent': request.META.get('HTTP_USER_AGENT', ''),
                'ip_address': request.META.get('REMOTE_ADDR', 'unknown')
            })
            
            # Validate request data
            serializer = self.serializer_class(data=request.data, context={'request': request})
            serializer.is_valid(raise_exception=True)
            
            # Get the authenticated user
            user = serializer.validated_data['user']
            
            # Generate tokens
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)
            refresh_token = str(refresh)
            
            # Update last login
            user.last_login = timezone.now()
            user.save(update_fields=['last_login'])
            
            # Prepare response data
            response_data = {
                'status': 'success',
                'message': 'Login successful',
                'user': {
                    'id': user.id,
                    'email': user.email,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                    'is_employer': user.is_employer,
                    'is_active': user.is_active,
                    'last_login': user.last_login.isoformat() if user.last_login else None,
                    'date_joined': user.date_joined.isoformat(),
                    'permissions': list(user.get_all_permissions())
                },
                'tokens': {
                    'refresh': refresh_token,
                    'access': access_token,
                    'expires_in': settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'].total_seconds()
                }
            }
            
            # Log successful login
            logger.info("Login successful", extra={
                'user_id': user.id,
                'email': user.email
            })
            
            return Response(response_data, status=status.HTTP_200_OK)
            
        except serializers.ValidationError as e:
            logger.warning("Login validation error", extra={
                'error': str(e),
                'email': request.data.get('email')
            })
            raise
            
        except AuthenticationFailed as e:
            logger.warning("Authentication failed", extra={
                'error': str(e),
                'email': request.data.get('email')
            })
            raise
            
        except Throttled as e:
            logger.warning("Login throttled", extra={
                'email': request.data.get('email'),
                'wait_seconds': e.wait
            })
            raise
            
        except Exception as e:
            logger.error("Unexpected error during login", exc_info=True, extra={
                'email': request.data.get('email')
            })
            return Response(
                {'detail': 'An unexpected error occurred. Please try again later.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class UserRegistrationView(generics.CreateAPIView):
    """
    Enhanced user registration view with comprehensive validation and security.
    """
    queryset = User.objects.none()  # Required for Django REST Framework
    serializer_class = UserRegistrationSerializer
    permission_classes = [AllowAny]
    
    @extend_schema(
        request=UserRegistrationSerializer,
        responses={
            201: OpenApiResponse(
                description="User registered successfully",
                response=UserRegistrationSerializer,
                examples=[
                    OpenApiExample(
                        'Successful registration',
                        value={
                            'id': 1,
                            'email': 'user@example.com',
                            'first_name': 'John',
                            'last_name': 'Doe',
                            'is_employer': False,
                            'is_active': True,
                            'last_login': '2023-01-01T12:00:00Z',
                            'date_joined': '2023-01-01T00:00:00Z',
                            'permissions': []
                        }
                    )
                ]
            ),
            400: OpenApiResponse(
                description="Bad request - validation error",
                examples=[
                    OpenApiExample(
                        'Validation error',
                        value={
                            'email': ['This field is required.'],
                            'password': ['This field is required.']
                        }
                    )
                ]
            )
        }
    )
    
    def create(self, request, *args, **kwargs):
        """
        Handle user registration with validation and error handling.
        
        This method processes the registration request, validates the input data,
        creates a new user, and returns the appropriate response.
        
        Args:
            request: The HTTP request containing user registration data
            *args: Additional positional arguments
            **kwargs: Additional keyword arguments
            
        Returns:
            Response: JSON response with the created user data or error messages
        """
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            
            # Generate tokens for the new user
            refresh = RefreshToken.for_user(user)
            access = refresh.access_token
            
            # Prepare response data
            response_data = {
                'status': 'success',
                'message': 'User registered successfully',
                'user': UserProfileSerializer(user).data,
                'tokens': {
                    'refresh': str(refresh),
                    'access': str(access),
                    'expires_in': int(settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'].total_seconds())
                }
            }
            
            return Response(response_data, status=status.HTTP_201_CREATED)
        
        return Response(
            {'status': 'error', 'errors': serializer.errors},
            status=status.HTTP_400_BAD_REQUEST
        )


class UserProfileError(APIException):
    status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
    default_detail = 'An error occurred while processing your profile.'
    default_code = 'user_profile_error'
    
    def __init__(self, detail=None, code=None, status_code=None):
        if status_code is not None:
            self.status_code = status_code
        if detail is not None:
            self.detail = detail
        if code is not None:
            self.code = code


class UserLoginView(APIView):
    """
    User login view that handles JWT token generation.
    
    This view authenticates users and returns JWT tokens for API access.
    It includes rate limiting and comprehensive error handling.
    """
    permission_classes = [AllowAny]
    throttle_scope = 'login'
    serializer_class = UserLoginSerializer
    
    @extend_schema(
        request=UserLoginSerializer,
        responses={
            200: OpenApiResponse(
                description="Login successful",
                response=UserLoginSerializer,
                examples=[
                    OpenApiExample(
                        'Successful login',
                        value={
                            'status': 'success',
                            'message': 'Login successful',
                            'user': {
                                'id': 1,
                                'email': 'user@example.com',
                                'first_name': 'John',
                                'last_name': 'Doe',
                                'is_employer': False,
                                'is_active': True,
                                'permissions': [],
                                'last_login': '2023-01-01T12:00:00Z',
                                'date_joined': '2023-01-01T00:00:00Z'
                            },
                            'tokens': {
                                'refresh': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                                'access': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                                'expires_in': 3600
                            }
                        }
                    )
                ]
            ),
            400: OpenApiResponse(
                description="Bad request - validation error",
                examples=[
                    OpenApiExample(
                        'Validation error',
                        value={
                            'email': ['This field is required.'],
                            'password': ['This field is required.']
                        }
                    )
                ]
            ),
            401: OpenApiResponse(
                description="Unauthorized - invalid credentials",
                examples=[
                    OpenApiExample(
                        'Authentication failed',
                        value={
                            'detail': 'Invalid email or password',
                            'code': 'authentication_failed'
                        }
                    )
                ]
            ),
            403: OpenApiResponse(
                description="Forbidden - account inactive",
                examples=[
                    OpenApiExample(
                        'Account inactive',
                        value={
                            'detail': 'This account is inactive',
                            'code': 'account_inactive'
                        }
                    )
                ]
            ),
            429: OpenApiResponse(
                description="Too many requests",
                examples=[
                    OpenApiExample(
                        'Rate limited',
                        value={
                            'detail': 'Request was throttled',
                            'code': 'throttled',
                            'wait': 60
                        }
                    )
                ]
            )
        },
        tags=['Authentication']
    )
    def post(self, request, *args, **kwargs):
        """
        Handle POST request for user login.
        
        This method performs the following steps:
        1. Validates the request data
        2. Authenticates the user
        3. Generates JWT tokens
        4. Returns user data and tokens
        """
        # Track start time for performance monitoring
        start_time = timezone.now()
        
        # Initialize request ID for tracking
        request_id = str(uuid.uuid4())[:8]
        
        # Configure a request-specific logger
        def log(level, message, *args, **kwargs):
            if hasattr(message, '__await__'):
                message = "[Coroutine detected in log message]"
            logger.log(level, f"[REQ-{request_id}] {message}", *args, **kwargs)
        
        log(logging.INFO, "\n" + "="*80)
        log(logging.INFO, "=== LOGIN REQUEST START ===")
        log(logging.INFO, f"Timestamp: {start_time.isoformat()}")
        log(logging.INFO, f"IP: {self._get_client_ip(request)}")
        
        try:
            # Log the incoming request data
            log(logging.INFO, "\n[REQUEST DETAILS]")
            log(logging.INFO, f"Method: {request.method}")
            log(logging.INFO, f"Path: {request.path}")
            log(logging.INFO, f"Content-Type: {request.content_type}")
            
            # Validate request data using the serializer
            serializer = self.serializer_class(
                data=request.data,
                context={'request': request}
            )
            
            if not serializer.is_valid():
                log(logging.WARNING, f"Validation failed: {serializer.errors}")
                return Response(
                    {
                        'detail': 'Invalid input',
                        'code': 'validation_error',
                        'errors': serializer.errors
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Get validated data
            email = serializer.validated_data['email']
            password = serializer.validated_data['password']
            
            # Log the login attempt (without password)
            log(logging.INFO, f"Login attempt for email: {email}")
            
            # Authenticate user
            user = authenticate(request, email=email, password=password)
            
            if user is None:
                log(logging.WARNING, f"Invalid login attempt for email: {email}")
                # Add a small delay to prevent timing attacks
                time.sleep(0.5)
                return Response(
                    {'detail': 'Invalid email or password', 'code': 'invalid_credentials'},
                    status=status.HTTP_401_UNAUTHORIZED
                )
            
            if not user.is_active:
                log(logging.WARNING, f"Login attempt for inactive user: {email}")
                return Response(
                    {'detail': 'This account is inactive', 'code': 'account_inactive'},
                    status=status.HTTP_403_FORBIDDEN
                )
            
            # Log user details (excluding sensitive info)
            log(logging.INFO, f"User authenticated: ID={user.id}, Email={user.email}")
            log(logging.DEBUG, f"User is active: {user.is_active}")
            log(logging.DEBUG, f"User is staff: {user.is_staff}")
            log(logging.DEBUG, f"Last login: {user.last_login}")
            log(logging.DEBUG, f"Date joined: {user.date_joined}")
            
            # Generate tokens
            try:
                refresh = RefreshToken.for_user(user)
                access_token = str(refresh.access_token)
                refresh_token = str(refresh)
                
                # Get the user's permissions
                permissions = self._get_user_permissions(user)
                
                # Prepare response data
                response_data = {
                    'status': 'success',
                    'message': 'Login successful',
                    'user': {
                        'id': user.id,
                        'email': user.email,
                        'first_name': user.first_name,
                        'last_name': user.last_name,
                        'is_employer': user.is_employer,
                        'is_active': user.is_active,
                        'permissions': permissions,
                        'last_login': user.last_login.isoformat() if user.last_login else None,
                        'date_joined': user.date_joined.isoformat()
                    },
                    'tokens': {
                        'refresh': refresh_token,
                        'access': access_token,
                        'expires_in': int(settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'].total_seconds())
                    }
                }
                
                # Log successful login
                log(logging.INFO, f"Login successful for user: {user.email} (ID: {user.id})")
                
                # Update last login time
                user.last_login = timezone.now()
                user.save(update_fields=['last_login'])
                
                # Calculate request processing time
                end_time = timezone.now()
                processing_time = (end_time - start_time).total_seconds()
                log(logging.INFO, f"Request processed in {processing_time:.3f} seconds")
                
                return Response(response_data, status=status.HTTP_200_OK)
                
            except Exception as e:
                log(logging.ERROR, f"Error generating tokens: {str(e)}")
                log(logging.DEBUG, traceback.format_exc())
                return Response(
                    {'detail': 'Error generating authentication tokens', 'code': 'token_generation_error'},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
                
        except Exception as e:
            log(logging.ERROR, f"Unexpected error in login view: {str(e)}")
            log(logging.DEBUG, traceback.format_exc())
            return Response(
                {'detail': 'An unexpected error occurred during login', 'code': 'server_error'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
            
        except ValidationError as e:
            # Handle validation errors
            error_detail = e.detail if hasattr(e, 'detail') else str(e)
            log(logging.WARNING, f"Login validation error: {error_detail}")
            
            response_data = {
                'detail': 'Validation error',
                'code': 'validation_error',
                'errors': error_detail if isinstance(error_detail, dict) else {'non_field_errors': [str(error_detail)]}
            }
                
            return Response(
                response_data,
                status=getattr(e, 'status_code', status.HTTP_400_BAD_REQUEST)
            )

        except KeyError as e:
            error_msg = f"Key error in login view: {str(e)}"
            log(logging.ERROR, error_msg, exc_info=True)
            
            available_keys = list(request.data.keys()) if hasattr(request.data, 'keys') else []
            log(logging.DEBUG, f"Available data keys: {available_keys}")
            
            return Response(
                {
                    'detail': f'Missing required field: {str(e)}',
                    'code': 'missing_field',
                    'error': str(e),
                    'available_fields': available_keys
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        except Exception as e:
            error_msg = f"Unexpected error during login: {str(e)}"
            log(logging.CRITICAL, error_msg, exc_info=True)
            
            # Log detailed error information
            error_info = {
                'timestamp': timezone.now().isoformat(),
                'request_id': request_id,
                'error': str(e),
                'exception_type': type(e).__name__,
                'exception_args': getattr(e, 'args', []),
                'traceback': traceback.format_exc(),
                'request_method': request.method,
                'request_path': request.path,
                'request_content_type': request.content_type,
                'request_data': str(request.data) if hasattr(request, 'data') else 'No request data',
                'request_meta': {k: str(v) for k, v in request.META.items() if not k.startswith('HTTP_COOKIE')}
            }
            
            # Log to error file
            try:
                error_log_path = os.path.join(settings.BASE_DIR, 'logs', 'login_errors.log')
                os.makedirs(os.path.dirname(error_log_path), exist_ok=True)
                
                with open(error_log_path, 'a', encoding='utf-8') as f:
                    f.write(f"\n\n{'='*80}\n")
                    f.write(f"{error_info['timestamp']} - Request ID: {request_id}\n")
                    f.write(f"Error: {error_info['error']}\n")
                    f.write(f"Type: {error_info['exception_type']}\n")
                    f.write(f"Request: {request.method} {request.path}\n")
                    f.write("Traceback:\n")
                    f.write(error_info['traceback'])
                    f.write("\nRequest data: ")
                    f.write(error_info['request_data'])
                    f.write("\n")
            except Exception as log_error:
                log(logging.ERROR, f"Failed to write to error log: {str(log_error)}", exc_info=True)
            
            # Return a safe error response
            return Response(
                {
                    'detail': 'An unexpected error occurred during login. Please try again later.',
                    'code': 'internal_server_error',
                    'request_id': request_id
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        finally:
            # Log completion of request processing
            log(logging.INFO, "Login request processing completed")
            log(logging.INFO, f"Total processing time: {timezone.now() - start_time}")
            log(logging.INFO, "="*80 + "\n")


class UserRegistrationView(generics.CreateAPIView):
    """
    Enhanced user registration view with comprehensive validation and security.
    """
    queryset = User.objects.none()  # Required for Django REST Framework
    serializer_class = UserRegistrationSerializer
    permission_classes = [AllowAny]
    permission_classes = [permissions.AllowAny]
    
    def create(self, request, *args, **kwargs):
        logger.info("=== USER REGISTRATION REQUEST START ===")
        logger.info(f"Request path: {request.path}")
        logger.info(f"Request method: {request.method}")
        logger.info(f"Request headers: {dict(request.headers)}")
        logger.info(f"Request data: {request.data}")
        
        try:
            # Log the raw request data and user model fields for debugging
            logger.info("=== USER MODEL FIELDS ===")
            logger.info(f"User model fields: {[f.name for f in User._meta.get_fields()]}")
            logger.info(f"User model attributes: {dir(User)}")
            logger.info("=== END USER MODEL FIELDS ===")
            
            # Log the raw request data
            logger.info("=== REQUEST DATA ===")
            for key, value in request.data.items():
                logger.info(f"{key}: {value} (type: {type(value).__name__})")
            logger.info("=== END REQUEST DATA ===")
            
            # Get the serializer with the request data
            logger.info("Initializing serializer...")
            serializer = self.get_serializer(data=request.data)
            logger.info("Serializer initialized")
            
            # Log the serializer data
            logger.info("=== SERIALIZER DATA ===")
            logger.info(f"Initial data: {serializer.initial_data}")
            logger.info(f"Is valid: {serializer.is_valid()}")
            logger.info("=== END SERIALIZER DATA ===")
            
            # Validate the serializer with detailed error logging
            logger.info("Validating serializer...")
            is_valid = False
            try:
                is_valid = serializer.is_valid(raise_exception=True)
                logger.info("Serializer validation passed")
            except Exception as val_error:
                logger.error("=== VALIDATION ERROR ===")
                logger.error(f"Validation error: {str(val_error)}")
                if hasattr(val_error, 'detail'):
                    logger.error(f"Error details: {val_error.detail}")
                logger.error(traceback.format_exc())
                logger.error("=== END VALIDATION ERROR ===")
                raise
            
            # Create the user and get the response data
            try:
                logger.info("Attempting to create user...")
                user = serializer.save()
                logger.info(f"User created successfully with ID: {user.id}")
                logger.info(f"User object after creation: {user.__dict__}")
                
                # Log the user's profile if it exists
                if hasattr(user, 'profile'):
                    logger.info(f"User profile created: {user.profile.__dict__}")
                else:
                    logger.warning("User profile was not created automatically")
                
                # Generate tokens
                logger.info("Generating JWT tokens...")
                refresh = None
                try:
                    refresh = RefreshToken.for_user(user)
                    logger.info("Tokens generated successfully")
                except Exception as token_error:
                    logger.error("=== TOKEN GENERATION ERROR ===")
                    logger.error(f"Error generating tokens: {str(token_error)}")
                    logger.error(traceback.format_exc())
                    logger.error("=== END TOKEN GENERATION ERROR ===")
                    raise
                
                # Prepare the response data
                response_data = {
                    'user': {
                        'id': user.id,
                        'email': user.email,
                        'first_name': user.first_name,
                        'last_name': user.last_name,
                        'is_employer': user.is_employer,
                    },
                    'refresh': str(refresh) if refresh else None,
                    'access': str(refresh.access_token) if refresh else None,
                }
                
                logger.info("=== REGISTRATION SUCCESS ===")
                logger.info(f"Response data: {response_data}")
                logger.info("=== END REGISTRATION SUCCESS ===")
                
                return Response(response_data, status=status.HTTP_201_CREATED)
                
            except Exception as save_error:
                logger.error("=== USER CREATION ERROR ===")
                logger.error(f"Error during user creation: {str(save_error)}")
                logger.error(traceback.format_exc())
                logger.error("=== END USER CREATION ERROR ===")
                
                # Try to clean up any partially created user
                if 'user' in locals() and user and user.pk:
                    try:
                        logger.warning(f"Attempting to delete partially created user with ID: {user.id}")
                        user.delete()
                        logger.info("Partially created user was deleted successfully")
                    except Exception as cleanup_error:
                        logger.error("Failed to clean up partially created user:")
                        logger.error(str(cleanup_error))
                
                return Response(
                    {'error': 'Failed to create user account. Please try again.'},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
                
        except serializers.ValidationError as e:
            logger.error("=== VALIDATION EXCEPTION ===")
            logger.error(f"Validation error: {str(e)}")
            logger.error(f"Validation error details: {e.detail}")
            logger.error(traceback.format_exc())
            logger.error("=== END VALIDATION EXCEPTION ===")
            
            return Response(
                {'error': 'Validation failed', 'details': e.detail},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        except Exception as e:
            logger.error("=== UNEXPECTED EXCEPTION ===")
            logger.error(f"Unexpected error during registration: {str(e)}")
            logger.error(traceback.format_exc())
            logger.error("=== END UNEXPECTED EXCEPTION ===")
            
            return Response(
                {'error': 'An unexpected error occurred during registration. Please try again.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        finally:
            logger.info("=== USER REGISTRATION REQUEST END ===")


    status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
    default_detail = 'An error occurred while processing your profile.'
    default_code = 'user_profile_error'

class UserProfileView(APIView):
    """
    Simplified view to handle user profile retrieval and updates.
    """
    permission_classes = [IsAuthenticated]
    authentication_classes = [SessionAuthentication, TokenAuthentication, JWTAuthentication]
    serializer_class = UserProfileSerializer
    
    def get_serializer_class(self):
        """Return the class to use for the serializer."""
        return self.serializer_class
        
    def get_serializer(self, *args, **kwargs):
        """Return the serializer instance with the request context."""
        kwargs['context'] = self.get_serializer_context()
        serializer_class = self.get_serializer_class()
        return serializer_class(*args, **kwargs)
    
    def get_serializer_context(self):
        """Extra context provided to the serializer class."""
        return {
            'request': self.request,
            'format': self.format_kwarg if hasattr(self, 'format_kwarg') else None,
            'view': self
        }
    
    def get(self, request, *args, **kwargs):
        """Handle GET requests to retrieve the user's profile."""
        logger.debug("Handling GET request for user profile")
        user = request.user
        
        # Ensure the user has a profile
        self._ensure_user_has_profile(user)
        
        # Get the user with profile data
        user_with_profile = User.objects.select_related('profile').get(pk=user.pk)
        
        serializer = self.get_serializer(user_with_profile)
        return Response(serializer.data)
    
    def patch(self, request, *args, **kwargs):
        """Handle PATCH requests to update the user's profile."""
        logger.debug(f"Handling PATCH request with data: {request.data}")
        user = request.user
        
        # Ensure the user has a profile
        self._ensure_user_has_profile(user)
        
        # Get the user with profile data
        user_with_profile = User.objects.select_related('profile').get(pk=user.pk)
        
        # Deserialize and validate the request data
        serializer = self.get_serializer(
            user_with_profile,
            data=request.data,
            partial=True
        )
        
        if not serializer.is_valid():
            logger.warning(f"Validation errors: {serializer.errors}")
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Save the updated user data
        serializer.save()
        
        # Refresh the user from the database
        user_with_profile.refresh_from_db()
        
        # Return the updated user data
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def _ensure_user_has_profile(self, user):
        """Ensure the user has a profile, creating one if necessary."""
        if not hasattr(user, 'profile'):
            from .models import UserProfile
            UserProfile.objects.create(user=user)
    
    def perform_update(self, serializer):
        """
        Save the updated user profile.
        
        This method is called by the update() method after the serializer is validated.
        It saves the serializer and ensures the profile is properly updated.
        """
        # Save the user and profile data
        instance = serializer.save()
        
        # If there's profile data in the serializer's validated data,
        # we need to ensure it's saved properly
        if hasattr(instance, 'profile') and hasattr(serializer, 'validated_data'):
            profile_data = {}
            for field in ['bio', 'location', 'phone_number', 'profile_picture', 'resume']:
                if field in serializer.validated_data:
                    profile_data[field] = serializer.validated_data[field]
            
            if profile_data:
                # Update the profile with any profile-specific fields
                from django.db import transaction
                with transaction.atomic():
                    for key, value in profile_data.items():
                        setattr(instance.profile, key, value)
                    instance.profile.save()
        
        return instance
    
    def get_queryset(self):
        """
        Optimize the queryset to fetch user profile data in a single query.
        """
        return User.objects.select_related('profile').all()
        
    def get_object(self):
        """
        Retrieve the current user's profile with optimized database queries.
        """
        if not self.request.user.is_authenticated:
            raise NotAuthenticated("Authentication credentials were not provided.")
            
        user = self.request.user
        
        try:
            # Log basic request info for debugging
            logger.debug(
                f"[UserProfileView] Getting profile for user: {getattr(user, 'email', 'unknown')} "
                f"(ID: {getattr(user, 'id', 'unknown')})"
            )
            
            # Get the user with profile data using the optimized queryset
            user_with_profile = self.get_queryset().filter(pk=user.id).first()
            
            if not user_with_profile:
                error_msg = "User not found"
                logger.error(f"[UserProfileView] {error_msg}")
                raise UserProfileError(detail=error_msg, status_code=status.HTTP_404_NOT_FOUND)
            
            # Ensure the user has a profile (lazy creation if missing)
            self._ensure_user_has_profile(user_with_profile)
            
            return user_with_profile
            
        except UserProfileError as upe:
            # Re-raise UserProfileError with the original status code
            if not hasattr(upe, 'status_code') or not upe.status_code:
                upe.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
            raise upe
                
        except Exception as e:
            error_msg = f"Unexpected error in UserProfileView: {str(e)}"
            logger.error(f"[UserProfileView] {error_msg}", exc_info=True, stack_info=True)
            
            if user:
                logger.error(f"[UserProfileView] User object type: {type(user)}")
                logger.error(f"[UserProfileView] User object attributes: {[attr for attr in dir(user) if not attr.startswith('_')]}")
            
            if hasattr(self, 'request'):
                logger.error(f"[UserProfileView] Request method: {getattr(self.request, 'method', 'unknown')}")
                logger.error(f"[UserProfileView] Request path: {getattr(self.request, 'path', 'unknown')}")
            
            raise UserProfileError(
                detail="An error occurred while processing your request",
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def _ensure_user_has_profile(self, user):
        """Ensure the user has a profile, creating one if necessary."""
        from django.db import transaction
        
        # Check if the user already has a profile
        if hasattr(user, 'profile'):
            return False
            
        logger.warning(f"[UserProfileView] Creating missing profile for user {user.id}")
        
        try:
            with transaction.atomic():
                from .models import UserProfile
                # Create a profile with default values
                profile = UserProfile.objects.create(user=user)
                # Refresh the user instance to get the new profile
                user.refresh_from_db()
                return True
        except Exception as e:
            logger.error(f"[UserProfileView] Error creating user profile: {str(e)}", exc_info=True)
            raise UserProfileError(
                detail="Failed to create user profile",
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def get(self, request, *args, **kwargs):
        """Handle GET requests to retrieve the user's profile."""
        try:
            instance = self.get_object()
            serializer = self.get_serializer(instance)
            return Response(serializer.data)
        except NotAuthenticated as e:
            return Response(
                {'detail': str(e)},
                status=status.HTTP_401_UNAUTHORIZED
            )
    
    def patch(self, request, *args, **kwargs):
        """Handle PATCH requests to update the user's profile."""
        try:
            instance = self.get_object()
            serializer = self.get_serializer(instance, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            self.perform_update(serializer)
            
            if hasattr(instance, '_prefetched_objects_cache'):
                # If 'prefetch_related' has been applied to a queryset, we need to
                # forcibly invalidate the prefetch cache on the instance.
                instance._prefetched_objects_cache = {}
                
            return Response(serializer.data)
        except NotAuthenticated as e:
            return Response(
                {'detail': str(e)},
                status=status.HTTP_401_UNAUTHORIZED
            )
    
    def handle_exception(self, exc):
        """
        Handle any exception that occurs, and return an appropriate response.
        """
        logger.error(f"[UserProfileView] Exception: {str(exc)}", exc_info=True)
        
        if isinstance(exc, NotAuthenticated):
            return Response(
                {'detail': str(exc)},
                status=status.HTTP_401_UNAUTHORIZED
            )
        elif isinstance(exc, UserProfileError):
            return Response(
                {'detail': str(exc), 'code': getattr(exc, 'code', 'error')},
                status=getattr(exc, 'status_code', status.HTTP_500_INTERNAL_SERVER_ERROR)
            )
            
        # For all other exceptions, let DRF handle them
        return super().handle_exception(exc)
        
    def get_serializer(self, *args, **kwargs):
        """Ensure we're using the correct serializer and it has the request context."""
        serializer_class = self.get_serializer_class()
        kwargs['context'] = self.get_serializer_context()
        return serializer_class(*args, **kwargs)


class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserProfileSerializer
    permission_classes = [IsAdminUser]  # Only admin users can access this viewset
    lookup_field = 'id'
    
    def get_queryset(self):
        """
        Filter users based on query parameters.
        """
        queryset = super().get_queryset()
        
        # Filter by user type if provided
        is_employer = self.request.query_params.get('is_employer')
        if is_employer is not None:
            is_employer = is_employer.lower() in ('true', '1', 't')
            queryset = queryset.filter(is_employer=is_employer)
            
        # Filter by active status if provided
        is_active = self.request.query_params.get('is_active')
        if is_active is not None:
            is_active = is_active.lower() in ('true', '1', 't')
            queryset = queryset.filter(is_active=is_active)
            
        return queryset
    
    @action(detail=True, methods=['post'])
    def activate(self, request, id=None):
        """
        Activate or deactivate a user account.
        """
        user = self.get_object()
        is_active = request.data.get('is_active', True)
        user.is_active = is_active
        user.save()
        
        status_msg = 'activated' if is_active else 'deactivated'
        return Response(
            {'status': f'User {status_msg} successfully'},
            status=status.HTTP_200_OK
        )
