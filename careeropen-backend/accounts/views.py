import logging
import time
from datetime import datetime, timedelta
from django.conf import settings
from django.contrib.auth import get_user_model, authenticate, login, logout
from django.db import transaction, IntegrityError
from django.utils import timezone
from rest_framework import generics, status, permissions, viewsets
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
    A simplified registration view that directly creates a user with minimal validation.
    This is for debugging purposes only.
    """
    permission_classes = [permissions.AllowAny]
    
    def post(self, request, *args, **kwargs):
        logger.info("=== SIMPLE REGISTRATION REQUEST ===")
        logger.info(f"Request data: {request.data}")
        
        try:
            # Extract required fields with defaults
            logger.info("Extracting request data...")
            email = request.data.get('email', f'test_{get_random_string(8)}@example.com')
            password = request.data.get('password', 'TestPass123!')
            first_name = request.data.get('first_name', 'Test')
            last_name = request.data.get('last_name', 'User')
            is_employer = request.data.get('is_employer', False)
            
            logger.info(f"Creating user with email: {email}")
            logger.info(f"User model fields: {[f.name for f in User._meta.get_fields()]}")
            logger.info(f"User model attributes: {dir(User)}")
            
            with transaction.atomic():
                # Create the user
                try:
                    logger.info("Attempting to create user...")
                    logger.info(f"Creating user with email: {email}, first_name: {first_name}, last_name: {last_name}, is_employer: {is_employer}")
                    
                    # Try to create the user with minimal required fields
                    user_data = {
                        'email': email,
                        'password': password,
                        'first_name': first_name,
                        'last_name': last_name,
                        'is_employer': is_employer,
                    }
                    
                    logger.info(f"User data before creation: {user_data}")
                    
                    # Create user with create_user method
                    user = User.objects.create_user(**user_data)
                    logger.info(f"User created successfully with ID: {user.id}")
                    logger.info(f"User object after creation: {user.__dict__}")
                    
                    # Create a profile for the user
                    try:
                        from .models import UserProfile
                        logger.info("Attempting to create UserProfile...")
                        logger.info(f"UserProfile model fields: {[f.name for f in UserProfile._meta.get_fields()]}")
                        
                        profile_data = {'user': user}
                        logger.info(f"Creating UserProfile with data: {profile_data}")
                        
                        profile = UserProfile.objects.create(user=user)
                        logger.info(f"UserProfile created successfully with ID: {profile.id}")
                        logger.info(f"UserProfile object after creation: {profile.__dict__}")
                    except Exception as profile_error:
                        logger.error(f"Error creating UserProfile: {str(profile_error)}")
                        logger.error(traceback.format_exc())
                        # Re-raise to trigger transaction rollback
                        raise profile_error
                    
                    # Generate tokens
                    try:
                        logger.info("Generating JWT tokens...")
                        refresh = RefreshToken.for_user(user)
                        logger.info("Tokens generated successfully")
                    except Exception as token_error:
                        logger.error(f"Error generating tokens: {str(token_error)}")
                        logger.error(traceback.format_exc())
                        # Re-raise to trigger transaction rollback
                        raise token_error
                    
                    response_data = {
                        'user': {
                            'id': user.id,
                            'email': user.email,
                            'first_name': user.first_name,
                            'last_name': user.last_name,
                            'is_employer': user.is_employer,
                        },
                        'refresh': str(refresh),
                        'access': str(refresh.access_token),
                    }
                    
                    logger.info("Simple registration completed successfully")
                    logger.info(f"Response data: {response_data}")
                    return Response(response_data, status=status.HTTP_201_CREATED)
                    
                except Exception as e:
                    error_msg = f"Error in simple registration: {str(e)}"
                    error_trace = traceback.format_exc()
                    logger.error(f"{error_msg}\n{error_trace}")
                    
                    # Log more details about the error
                    if hasattr(e, '__dict__'):
                        logger.error(f"Exception details: {e.__dict__}")
                    
                    return Response(
                        {
                            'error': 'Error in simple registration',
                            'details': str(e),
                            'type': type(e).__name__,
                            'trace': [line for line in error_trace.split('\n') if line.strip()]
                        },
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR
                    )
                    
        except Exception as e:
            error_msg = f"Unexpected error in simple registration: {str(e)}"
            error_trace = traceback.format_exc()
            logger.critical(f"{error_msg}\n{error_trace}")
            
            # Log more details about the error
            if hasattr(e, '__dict__'):
                logger.critical(f"Exception details: {e.__dict__}")
            
            return Response(
                {
                    'error': 'An unexpected error occurred during simple registration',
                    'details': str(e),
                    'type': type(e).__name__,
                    'trace': [line for line in error_trace.split('\n') if line.strip()]
                },
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
    Enhanced user login view with rate limiting and security features.
    This view is explicitly synchronous to avoid any async/coroutine issues.
    """
    permission_classes = [AllowAny]
    throttle_scope = 'login'
    
    def post(self, request, *args, **kwargs):
        """
        Handle POST request for user login.
        This is a synchronous method to ensure we don't return coroutines.
        """
        # Track start time for performance monitoring
        start_time = timezone.now()
        
        # Initialize request ID for tracking
        import uuid
        request_id = str(uuid.uuid4())[:8]
        
        # Configure a request-specific logger
        def log(level, message, *args, **kwargs):
            # Ensure we're not passing coroutines to the logger
            if hasattr(message, '__await__'):
                message = "[Coroutine detected in log message]"
            logger.log(level, f"[REQ-{request_id}] {message}", *args, **kwargs)
        
        log(logging.INFO, "\n" + "="*80)
        log(logging.INFO, "=== LOGIN REQUEST START ===")
        log(logging.INFO, f"Timestamp: {start_time.isoformat()}")
        
        try:
            # Log the incoming request data
            log(logging.INFO, "\n[REQUEST DETAILS]")
            log(logging.INFO, f"Method: {request.method}")
            log(logging.INFO, f"Path: {request.path}")
            log(logging.INFO, f"Content-Type: {request.content_type}")
            
            # Safely log headers (excluding sensitive info)
            try:
                headers = {}
                for key, value in request.headers.items():
                    if key.upper() in ['AUTHORIZATION', 'COOKIE']:
                        headers[key] = '***REDACTED***'
                    else:
                        headers[key] = str(value)
                log(logging.DEBUG, f"Headers: {headers}")
            except Exception as e:
                log(logging.ERROR, f"Failed to process headers: {str(e)}")
            
            # Log request data safely
            try:
                # Ensure we're not dealing with coroutines
                if hasattr(request.data, 'items'):
                    log(logging.DEBUG, f"Request data: {dict(request.data.items())}")
                else:
                    log(logging.DEBUG, f"Request data (raw): {request.data}")
                
                # Safely log request body
                if hasattr(request, 'body'):
                    try:
                        body_str = request.body.decode('utf-8') if request.body else ''
                        log(logging.DEBUG, f"Request body: {body_str}")
                    except UnicodeDecodeError:
                        log(logging.DEBUG, "Request body: [binary data]")
            except Exception as e:
                log(logging.ERROR, f"Failed to log request data: {str(e)}")
            
            # Validate request data
            log(logging.INFO, "\n[VALIDATING REQUEST DATA]")
            try:
                if not request.data:
                    error_msg = "No data provided"
                    log(logging.ERROR, error_msg)
                    return Response(
                        {'detail': error_msg, 'code': 'missing_data'},
                        status=status.HTTP_400_BAD_REQUEST
                    )
                
                required_fields = ['email', 'password']
                missing_fields = [field for field in required_fields if field not in request.data]
                
                if missing_fields:
                    error_msg = f"Missing required fields: {', '.join(missing_fields)}"
                    log(logging.ERROR, error_msg)
                    return Response(
                        {
                            'detail': error_msg,
                            'code': 'missing_fields',
                            'fields': missing_fields
                        },
                        status=status.HTTP_400_BAD_REQUEST
                    )
                
                log(logging.INFO, "Request data validation successful")
                
            except Exception as e:
                error_msg = f"Request validation error: {str(e)}"
                log(logging.ERROR, error_msg, exc_info=True)
                return Response(
                    {'detail': 'Invalid request data', 'code': 'invalid_request'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Initialize serializer with request data
            log(logging.INFO, "\n[INITIALIZING SERIALIZER]")
            try:
                # Ensure request.data is fully evaluated (not a coroutine)
                request_data = dict(request.data.items()) if hasattr(request.data, 'items') else {}
                
                # Log the data being passed to the serializer
                log(logging.DEBUG, f"Request data for serializer: {request_data}")
                
                # Create the serializer with the evaluated data
                serializer = UserLoginSerializer(
                    data=request_data, 
                    context={'request': request}
                )
                log(logging.INFO, "Serializer initialized successfully")
            except Exception as e:
                error_msg = f"Failed to initialize serializer: {str(e)}"
                log(logging.ERROR, error_msg, exc_info=True)
                return Response(
                    {'detail': 'Internal server error', 'code': 'serializer_error'},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
            
            # Validate the serializer
            log(logging.INFO, "\n[VALIDATING LOGIN DATA]")
            try:
                is_valid = serializer.is_valid()
                log(logging.INFO, f"Validation result: {is_valid}")
                
                if not is_valid:
                    error_details = {
                        'detail': 'Invalid credentials',
                        'code': 'authentication_failed',
                        'errors': serializer.errors
                    }
                    log(logging.WARNING, f"Login validation failed: {serializer.errors}")
                    return Response(error_details, status=status.HTTP_400_BAD_REQUEST)
                    
                log(logging.INFO, "Login data validation successful")
                
            except Exception as e:
                error_msg = f"Login validation error: {str(e)}"
                log(logging.ERROR, error_msg, exc_info=True)
                return Response(
                    {'detail': 'Internal server error during validation', 'code': 'validation_error'},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
            
            # Get the authenticated user
            log(logging.INFO, "\n[AUTHENTICATING USER]")
            try:
                user = serializer.validated_data.get('user')
                if not user:
                    error_msg = "No user found in validated_data - authentication failed"
                    log(logging.WARNING, error_msg)
                    return Response(
                        {
                            'detail': 'Authentication failed. Invalid email or password.',
                            'code': 'invalid_credentials'
                        },
                        status=status.HTTP_401_UNAUTHORIZED
                    )
                
                # Log user details (excluding sensitive info)
                log(logging.INFO, f"User authenticated: ID={user.id}, Email={user.email}")
                log(logging.DEBUG, f"User is active: {user.is_active}")
                log(logging.DEBUG, f"User is staff: {user.is_staff}")
                log(logging.DEBUG, f"Last login: {user.last_login}")
                log(logging.DEBUG, f"Date joined: {user.date_joined}")
                
            except Exception as e:
                error_msg = f"User authentication error: {str(e)}"
                log(logging.ERROR, error_msg, exc_info=True)
                return Response(
                    {'detail': 'Internal server error during authentication', 'code': 'auth_error'},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
            
            # Generate tokens
            log(logging.INFO, "\n[GENERATING TOKENS]")
            try:
                log(logging.INFO, "Generating refresh token...")
                
                # Generate refresh and access tokens
                try:
                    refresh = RefreshToken.for_user(user)
                    access_token = str(refresh.access_token)
                    log(logging.INFO, "Tokens generated successfully")
                except Exception as e:
                    error_msg = f"Token generation failed: {str(e)}"
                    log(logging.ERROR, error_msg, exc_info=True)
                    return Response(
                        {'detail': 'Failed to generate authentication tokens', 'code': 'token_generation_error'},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR
                    )
                
                # Prepare user data for response (excluding sensitive info)
                try:
                    user_data = {
                        'id': user.id,
                        'email': user.email,
                        'first_name': user.first_name or '',
                        'last_name': user.last_name or '',
                        'is_employer': getattr(user, 'is_employer', False),
                        'is_staff': user.is_staff,
                        'is_active': user.is_active,
                        'last_login': user.last_login.isoformat() if user.last_login else None,
                        'date_joined': user.date_joined.isoformat() if user.date_joined else None
                    }
                    
                    # Create response data
                    response_data = {
                        'refresh': str(refresh),
                        'access': access_token,
                        'user': user_data
                    }
                    
                    log(logging.INFO, "Response data prepared successfully")
                    log(logging.DEBUG, f"Response data: {response_data}")
                    
                except Exception as e:
                    error_msg = f"Failed to prepare response data: {str(e)}"
                    log(logging.ERROR, error_msg, exc_info=True)
                    return Response(
                        {'detail': 'Failed to prepare response', 'code': 'response_error'},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR
                    )
                
                # Create and return the response
                try:
                    response = Response(response_data, status=status.HTTP_200_OK)
                    
                    # Set response headers
                    response['X-Auth-Status'] = 'success'
                    response['X-Request-ID'] = request_id
                    
                    # Update user's last login time
                    try:
                        user.last_login = timezone.now()
                        user.save(update_fields=['last_login'])
                        log(logging.DEBUG, f"Updated last login time for user {user.id}")
                    except Exception as e:
                        log(logging.ERROR, f"Failed to update last login time: {str(e)}", exc_info=True)
                    
                    # Log successful login
                    log(logging.INFO, "\n[LOGIN SUCCESSFUL]")
                    log(logging.INFO, f"User {user.email} logged in successfully")
                    log(logging.INFO, f"User ID: {user.id}, Email: {user.email}")
                    log(logging.INFO, f"Access token expires in: {settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME']}")
                    log(logging.INFO, f"Refresh token expires in: {settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME']}")
                    log(logging.INFO, "="*80 + "\n")
                    
                    return response
                    
                except Exception as e:
                    error_msg = f"Failed to create response: {str(e)}"
                    log(logging.ERROR, error_msg, exc_info=True)
                    return Response(
                        {'detail': 'Failed to create response', 'code': 'response_error'},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR
                    )
                
            except Exception as e:
                error_msg = f"Unexpected error during token generation: {str(e)}"
                log(logging.CRITICAL, error_msg, exc_info=True)
                return Response(
                    {'detail': 'Internal server error during authentication', 'code': 'auth_error'},
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
    """
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        user = None
        try:
            user = self.request.user
            if not user or not hasattr(user, 'id'):
                error_msg = "Invalid or missing user in request"
                logger.error(f"[UserProfileView] {error_msg}")
                raise UserProfileError(detail=error_msg)
                
            logger.info(f"[UserProfileView] Getting profile for user: {getattr(user, 'email', 'unknown')} (ID: {getattr(user, 'id', 'unknown')})")
            
            # Debug: Log request headers and user details
            logger.debug(f"[UserProfileView] Request method: {getattr(self.request, 'method', 'unknown')}")
            logger.debug(f"[UserProfileView] Request path: {getattr(self.request, 'path', 'unknown')}")
            logger.debug(f"[UserProfileView] Request headers: {dict(getattr(self.request, 'headers', {}))}")
            logger.debug(f"[UserProfileView] User details - ID: {getattr(user, 'id', 'unknown')}, Email: {getattr(user, 'email', 'unknown')}, Is Active: {getattr(user, 'is_active', 'unknown')}")
            
            # Check if user has a profile, create one if not
            try:
                # First, try to get the profile directly
                if not hasattr(user, 'profile'):
                    logger.info(f"[UserProfileView] User model does not have 'profile' attribute, trying direct query...")
                    from .models import UserProfile
                    try:
                        profile = UserProfile.objects.get(user=user)
                        logger.info(f"[UserProfileView] Found profile via direct query: {profile.id}")
                        return profile
                    except UserProfile.DoesNotExist:
                        logger.info(f"[UserProfileView] No profile found for user {user.id}, creating one...")
                        profile = UserProfile.objects.create(user=user)
                        logger.info(f"[UserProfileView] Created new profile for user {user.id} (Profile ID: {profile.id})")
                        return profile
                
                # If we get here, user has a profile attribute
                profile = user.profile
                logger.debug(f"[UserProfileView] Retrieved profile via user.profile: {getattr(profile, 'id', 'no-id')}")
                return profile
                
            except UserProfile.DoesNotExist:
                logger.info(f"[UserProfileView] UserProfile.DoesNotExist for user {user.id}, creating profile...")
                from .models import UserProfile
                try:
                    profile = UserProfile.objects.create(user=user)
                    logger.info(f"[UserProfileView] Created new profile for user {user.id} (Profile ID: {profile.id})")
                    return profile
                except Exception as e:
                    error_msg = f"Error creating profile for user {user.id}: {str(e)}"
                    logger.error(f"[UserProfileView] {error_msg}", exc_info=True)
                    raise UserProfileError(detail=error_msg)
                    
            except Exception as e:
                error_msg = f"Unexpected error accessing profile for user {user.id}: {str(e)}"
                logger.error(f"[UserProfileView] {error_msg}", exc_info=True)
                logger.error(f"[UserProfileView] User model fields: {[f for f in user._meta.get_fields() if hasattr(f, 'name')]}")
                raise UserProfileError(detail=error_msg) 
                
        except UserProfileError as upe:
            logger.error(f"[UserProfileView] UserProfileError: {str(upe)}", exc_info=True)
            if hasattr(self, 'request') and hasattr(self.request, 'user'):
                logger.error(f"[UserProfileView] Current user in error handler: {getattr(self.request.user, 'id', 'unknown')}")
            raise  # Re-raise our custom error
            
        except Exception as e:
            error_msg = f"Unexpected error in UserProfileView.get_object: {str(e)}"
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
