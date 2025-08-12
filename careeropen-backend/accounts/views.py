import logging
import time
from datetime import datetime, timedelta
from django.conf import settings
from drf_spectacular.utils import extend_schema, OpenApiResponse, OpenApiExample
from django.contrib.auth import get_user_model, authenticate, login, logout
from django.db import transaction, IntegrityError
from django.utils import timezone
from rest_framework import generics, status, permissions, viewsets, serializers
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.exceptions import APIException, ValidationError, PermissionDenied
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser, BasePermission
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken

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
    """
    serializer_class = CustomTokenObtainPairSerializer
    permission_classes = [AllowAny]
    
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        
        try:
            # Validate credentials and get tokens
            serializer.is_valid(raise_exception=True)
            
            # Get the user from the serializer context
            user = serializer.user
            
            # Update last login time
            user.last_login = timezone.now()
            user.save(update_fields=['last_login'])
            
            # Get the response data from the serializer
            data = serializer.validated_data
            
            # Set session data if needed (for browser-based auth)
            if getattr(settings, 'REST_SESSION_LOGIN', False):
                login(request, user)
            
            return Response(data, status=status.HTTP_200_OK)
            
        except ValidationError as e:
            # Handle validation errors from the serializer
            logger.warning(f"Authentication failed: {e.detail}")
            return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)
            
        except Exception as e:
            logger.error(f"Unexpected error during authentication: {str(e)}", exc_info=True)
            return Response(
                {'detail': 'An unexpected error occurred during authentication.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class CustomTokenRefreshView(TokenRefreshView):
    """
    Custom token refresh view with enhanced error handling.
    """
    serializer_class = CustomTokenRefreshSerializer
    permission_classes = [AllowAny]
    
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        
        try:
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
    
    ## Request Body
    - `email` (required): User's email address
    - `password` (required): User's password
    
    ## Response
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
        summary='User Login',
        description='''
        ## Overview
        Authenticate a user and return JWT tokens for API access.
        
        ## Request Body
        - `email` (string, required): The user's email address
        - `password` (string, required): The user's password
        
        ## Response
        - `200`: Login successful - Returns user data and tokens
        - `400`: Invalid input data - Missing or invalid fields
        - `401`: Invalid credentials - Email or password is incorrect
        - `403`: Account inactive - User account is not active
        - `415`: Unsupported media type - Request must be JSON
        - `429`: Too many requests - Rate limit exceeded
        - `500`: Server error - An unexpected error occurred
        
        ## Security
        - Rate limited to prevent brute force attacks
        - Passwords are never logged
        - Tokens have a limited lifetime
        '''.strip(),
        request=UserLoginSerializer,
        examples=[
            OpenApiExample(
                'Login Request Example',
                value={
                    'email': 'user@example.com',
                    'password': 'securepassword123'
                },
                request_only=True
            ),
            OpenApiExample(
                'Login Success Response',
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
                        'last_login': '2023-01-01T12:00:00Z',
                        'date_joined': '2023-01-01T00:00:00Z',
                        'permissions': []
                    },
                    'tokens': {
                        'refresh': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                        'access': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                        'expires_in': 3600
                    }
                },
                response_only=True,
                status_codes=['200']
            ),
            OpenApiExample(
                'Error Response',
                value={
                    'detail': 'Invalid credentials',
                    'code': 'authentication_failed'
                },
                response_only=True,
                status_codes=['401']
            )
        ],
        responses={
            200: OpenApiResponse(
                description='Login successful',
                response={
                    'type': 'object',
                    'properties': {
                        'status': {
                            'type': 'string',
                            'description': 'Status of the operation',
                            'example': 'success'
                        },
                        'message': {
                            'type': 'string',
                            'description': 'Human-readable message',
                            'example': 'Login successful'
                        },
                        'user': {
                            'type': 'object',
                            'properties': {
                                'id': {'type': 'integer', 'example': 1},
                                'email': {'type': 'string', 'example': 'user@example.com'},
                                'first_name': {'type': 'string', 'example': 'John'},
                                'last_name': {'type': 'string', 'example': 'Doe'},
                                'is_employer': {'type': 'boolean', 'example': False},
                                'is_active': {'type': 'boolean', 'example': True},
                                'last_login': {'type': 'string', 'format': 'date-time', 'example': '2023-01-01T12:00:00Z'},
                                'date_joined': {'type': 'string', 'format': 'date-time', 'example': '2023-01-01T00:00:00Z'},
                                'permissions': {
                                    'type': 'array',
                                    'items': {'type': 'string'},
                                    'example': []
                                }
                            }
                        },
                        'tokens': {
                            'type': 'object',
                            'properties': {
                                'refresh': {
                                    'type': 'string',
                                    'description': 'JWT refresh token for obtaining new access tokens',
                                    'example': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
                                },
                                'access': {
                                    'type': 'string',
                                    'description': 'JWT access token for authenticating API requests',
                                    'example': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
                                },
                                'expires_in': {
                                    'type': 'integer',
                                    'description': 'Time in seconds until the access token expires',
                                    'example': 3600
                                }
                            }
                        }
                    }
                }
            ),
            400: OpenApiResponse(
                description='Bad Request',
                response={
                    'type': 'object',
                    'properties': {
                        'detail': {'type': 'string', 'example': 'Invalid input data'},
                        'code': {'type': 'string', 'example': 'invalid_input'},
                        'errors': {
                            'type': 'object',
                            'additionalProperties': {
                                'type': 'array',
                                'items': {'type': 'string'}
                            },
                            'example': {
                                'email': ['This field is required.'],
                                'password': ['This field is required.']
                            }
                        }
                    }
                }
            ),
            401: OpenApiResponse(
                description='Unauthorized',
                response={
                    'type': 'object',
                    'properties': {
                        'detail': {'type': 'string', 'example': 'Invalid credentials'},
                        'code': {'type': 'string', 'example': 'authentication_failed'}
                    }
                }
            ),
            403: OpenApiResponse(
                description='Forbidden',
                response={
                    'type': 'object',
                    'properties': {
                        'detail': {'type': 'string', 'example': 'Account is not active'},
                        'code': {'type': 'string', 'example': 'account_inactive'}
                    }
                }
            ),
            415: OpenApiResponse(
                description='Unsupported Media Type',
                response={
                    'type': 'object',
                    'properties': {
                        'detail': {'type': 'string', 'example': 'Unsupported media type'},
                        'code': {'type': 'string', 'example': 'unsupported_media_type'}
                    }
                }
            ),
            429: OpenApiResponse(
                description='Too Many Requests',
                response={
                    'type': 'object',
                    'properties': {
                        'detail': {'type': 'string', 'example': 'Request was throttled'},
                        'code': {'type': 'string', 'example': 'throttled'},
                        'wait': {'type': 'integer', 'example': 60}
                    }
                }
            ),
            500: OpenApiResponse(
                description='Internal Server Error',
                response={
                    'type': 'object',
                    'properties': {
                        'detail': {'type': 'string', 'example': 'An unexpected error occurred'},
                        'code': {'type': 'string', 'example': 'server_error'},
                        'request_id': {'type': 'string', 'example': '550e8400-e29b-41d4-a716-446655440000'}
                    }
                }
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


class UserProfileError(APIException):
    status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
    default_detail = 'An error occurred while processing your profile.'
    default_code = 'user_profile_error'

class UserProfileView(generics.RetrieveUpdateAPIView):
    """
    View to retrieve or update the current user's profile.
    
    This view uses optimized database queries with select_related to fetch the user's
    profile data in a single query, reducing database round-trips.
    """
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """
        Optimize the queryset to fetch user profile data in a single query.
        """
        return User.objects.select_related('profile').all()

    def get_object(self):
        """
        Retrieve the current user's profile with optimized database queries.
        """
        user = None
        try:
            user = self.request.user
            if not user or not hasattr(user, 'id'):
                error_msg = "Invalid or missing user in request"
                logger.error(f"[UserProfileView] {error_msg}")
                raise UserProfileError(detail=error_msg)
            
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
                raise UserProfileError(detail=error_msg)
            
            # Ensure the user has a profile (lazy creation if missing)
            if not hasattr(user_with_profile, 'profile'):
                logger.warning(f"[UserProfileView] Creating missing profile for user {user_with_profile.id}")
                try:
                    from .models import UserProfile
                    UserProfile.objects.create(user=user_with_profile)
                    # Refresh the user instance to get the new profile
                    user_with_profile.refresh_from_db()
                except Exception as e:
                    logger.error(f"[UserProfileView] Error creating user profile: {str(e)}")
                    raise UserProfileError(detail="Failed to create user profile")
            
            return user_with_profile
                
        except UserProfileError as upe:
            # Re-raise the UserProfileError with the original error message
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
            raise UserProfileError(detail=error_msg)
    
    def get_serializer_context(self):
        """Add request to the serializer context."""
        context = super().get_serializer_context()
        context.update({
            'request': self.request,
            'user': self.request.user
        })
        return context


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


# For backward compatibility with existing URLs
class UserListView(generics.ListAPIView):
    """
    List all users (admin only).
    """
    queryset = User.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [IsAdminUser]


class UserDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete a user (admin only).
    """
    queryset = User.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [IsAdminUser]
    lookup_field = 'id'
