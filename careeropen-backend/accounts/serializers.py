from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer, TokenRefreshSerializer
from django.contrib.auth import get_user_model, authenticate
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework.exceptions import ValidationError
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()

import logging
logger = logging.getLogger(__name__)

class UserLoginSerializer(serializers.Serializer):
    """
    Serializer for user login with enhanced error handling and detailed logging.
    """
    email = serializers.EmailField(required=True, allow_blank=False)
    password = serializers.CharField(
        style={'input_type': 'password'}, 
        write_only=True,
        trim_whitespace=False
    )
    
    def validate(self, attrs):
        logger.info("=== USER LOGIN VALIDATION START ===")
        logger.info(f"Initial attrs: {attrs}")
        
        request = self.context.get('request')
        email = attrs.get('email', '').strip().lower()
        password = attrs.get('password')
        
        logger.info(f"Validating login for email: {email}")
        
        # Check for missing credentials
        if not email or not password:
            error_msg = 'Both email and password are required.'
            logger.warning(f"Validation failed: {error_msg}")
            logger.info("=== USER LOGIN VALIDATION END (MISSING CREDENTIALS) ===")
            raise ValidationError({
                'detail': error_msg,
                'code': 'missing_credentials'
            })
        
        try:
            logger.info("Attempting to authenticate user...")
            
            # Log the authentication backend being used
            logger.info(f"Available authentication backends: {[str(b) for b in getattr(request, 'authenticators', []) or ['default']]}")
            
            # Attempt authentication
            user = authenticate(
                request=request,
                email=email,
                password=password
            )
            
            logger.info(f"Authentication result: {'Success' if user else 'Failed'}")
            
            if not user:
                error_msg = 'Invalid email or password.'
                logger.warning(f"Authentication failed: {error_msg}")
                logger.info("=== USER LOGIN VALIDATION END (INVALID CREDENTIALS) ===")
                raise ValidationError({
                    'detail': error_msg,
                    'code': 'invalid_credentials'
                })
                
            if not user.is_active:
                error_msg = 'This account is inactive.'
                logger.warning(f"Authentication failed: {error_msg}")
                logger.info("=== USER LOGIN VALIDATION END (INACTIVE ACCOUNT) ===")
                raise ValidationError({
                    'detail': error_msg,
                    'code': 'account_inactive'
                })
                
            logger.info(f"User {user.id} authenticated successfully")
                
        except DjangoValidationError as e:
            error_msg = f"Validation error during authentication: {str(e)}"
            logger.error(error_msg, exc_info=True)
            logger.info("=== USER LOGIN VALIDATION END (VALIDATION ERROR) ===")
            raise ValidationError({
                'detail': 'Invalid input.',
                'code': 'validation_error',
                'errors': e.message_dict if hasattr(e, 'message_dict') else str(e)
            })
        except Exception as e:
            error_msg = f"Unexpected error during authentication: {str(e)}"
            logger.critical(error_msg, exc_info=True)
            logger.info("=== USER LOGIN VALIDATION END (UNEXPECTED ERROR) ===")
            # Re-raise as a ValidationError to maintain consistent error handling
            raise ValidationError({
                'detail': 'An unexpected error occurred during authentication.',
                'code': 'authentication_error',
                'error': str(e)
            })
        
        attrs['user'] = user
        logger.info("=== USER LOGIN VALIDATION END (SUCCESS) ===")
        return attrs


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Enhanced token serializer with additional user claims and better error handling.
    """
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.user = None
    
    @classmethod
    def get_token(cls, user):
        """
        Generate JWT token with custom claims.
        """
        token = super().get_token(user)
        
        # Add custom claims
        token['user_id'] = str(user.id)
        token['email'] = user.email
        token['is_employer'] = user.is_employer
        token['is_staff'] = user.is_staff
        token['is_active'] = user.is_active
        
        # Add first and last name if available
        if user.first_name:
            token['first_name'] = user.first_name
        if user.last_name:
            token['last_name'] = user.last_name
            
        return token
    
    def validate(self, attrs):
        """
        Validate credentials and return token with user data.
        """
        try:
            # Validate using parent class
            data = super().validate(attrs)
            self.user = self.user or self.context.get('user')
            
            if not self.user or not self.user.is_active:
                raise ValidationError({
                    'detail': 'User account is not active.',
                    'code': 'account_inactive'
                })
            
            # Get refresh and access tokens
            refresh = self.get_token(self.user)
            
            # Prepare user data
            user_data = {
                'id': self.user.id,
                'email': self.user.email,
                'first_name': self.user.first_name or '',
                'last_name': self.user.last_name or '',
                'is_employer': self.user.is_employer,
                'is_staff': self.user.is_staff,
                'is_active': self.user.is_active,
            }
            
            # Add profile data if available
            if hasattr(self.user, 'profile'):
                profile = self.user.profile
                user_data.update({
                    'phone_number': profile.phone_number or '',
                    'bio': profile.bio or '',
                    'location': profile.location or '',
                    'skills': profile.skills or [],
                    'company_name': profile.company_name or '',
                })
            
            # Update response data
            data.update({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user': user_data,
                'token_type': 'Bearer',
                'expires_in': int(refresh.access_token.lifetime.total_seconds())
            })
            
            return data
            
        except Exception as e:
            if hasattr(e, 'detail'):
                raise
            raise ValidationError({
                'detail': 'Authentication failed. Please check your credentials and try again.',
                'code': 'authentication_failed',
                'error': str(e)
            })


class CustomTokenRefreshSerializer(TokenRefreshSerializer):
    """
    Custom token refresh serializer with enhanced error handling.
    """
    def validate(self, attrs):
        try:
            return super().validate(attrs)
        except Exception as e:
            raise ValidationError({
                'detail': 'Invalid or expired refresh token.',
                'code': 'token_not_valid',
                'error': str(e)
            })

class UserRegistrationSerializer(serializers.ModelSerializer):
    """
    Serializer for user registration.
    """
    password = serializers.CharField(
        write_only=True,
        required=True,
        validators=[validate_password],
        style={'input_type': 'password'}
    )
    password2 = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'}
    )
    is_employer = serializers.BooleanField(
        required=False,
        default=False
    )

    class Meta:
        model = User
        fields = ('email', 'first_name', 'last_name', 'password', 'password2', 'is_employer')
        extra_kwargs = {
            'first_name': {'required': True},
            'last_name': {'required': True},
            'email': {'required': True}
        }

    def validate(self, attrs):
        if attrs.get('password') != attrs.get('password2'):
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs

    def create(self, validated_data):
        import logging
        import traceback
        from django.db import transaction
        from .models import UserProfile
        
        logger = logging.getLogger(__name__)
        
        # Log the start of the registration process
        logger.info("=== STARTING USER REGISTRATION PROCESS ===")
        logger.info(f"Validated data keys: {list(validated_data.keys())}")
        logger.debug(f"Full validated data: {validated_data}")
        
        # Extract and remove password2 and is_employer from the data
        password2 = validated_data.pop('password2', None)
        is_employer = validated_data.get('is_employer', False)
        
        logger.info(f"Creating user with email: {validated_data.get('email')}")
        logger.info(f"Is employer: {is_employer}")
        logger.info(f"First name: {validated_data.get('first_name')}")
        logger.info(f"Last name: {validated_data.get('last_name')}")
        
        # Use a transaction to ensure atomicity
        try:
            with transaction.atomic():
                # Log the data being used to create the user
                logger.info("=== CREATING USER ===")
                logger.info(f"User data: email={validated_data.get('email')}, "
                          f"first_name={validated_data.get('first_name')}, "
                          f"last_name={validated_data.get('last_name')}, "
                          f"is_employer={is_employer}")
                
                # Create the user
                try:
                    user = User.objects.create_user(
                        email=validated_data['email'],
                        first_name=validated_data.get('first_name', ''),
                        last_name=validated_data.get('last_name', ''),
                        password=validated_data['password'],
                        is_employer=is_employer
                    )
                    logger.info(f"=== USER CREATED SUCCESSFULLY ===")
                    logger.info(f"User ID: {user.id}")
                    logger.info(f"User email: {user.email}")
                    logger.info(f"User is_employer: {user.is_employer}")
                    logger.debug(f"Full user object: {user.__dict__}")
                except Exception as e:
                    error_trace = traceback.format_exc()
                    logger.error("=== ERROR CREATING USER ===")
                    logger.error(f"Error type: {type(e).__name__}")
                    logger.error(f"Error message: {str(e)}")
                    logger.error(f"Traceback:\n{error_trace}")
                    raise serializers.ValidationError({
                        "error": "Failed to create user account.",
                        "details": str(e),
                        "type": type(e).__name__
                    })
                
                # Create UserProfile for the new user
                logger.info("=== CREATING USER PROFILE ===")
                try:
                    logger.info(f"Creating profile for user ID: {user.id}")
                    profile = UserProfile.objects.create(user=user)
                    logger.info(f"=== USER PROFILE CREATED SUCCESSFULLY ===")
                    logger.info(f"Profile ID: {profile.id}")
                    logger.debug(f"Full profile object: {profile.__dict__}")
                except Exception as profile_error:
                    error_trace = traceback.format_exc()
                    logger.error("=== ERROR CREATING USER PROFILE ===")
                    logger.error(f"Error type: {type(profile_error).__name__}")
                    logger.error(f"Error message: {str(profile_error)}")
                    logger.error(f"Traceback:\n{error_trace}")
                    
                    # Even if profile creation fails, we'll still return the user
                    # as the profile is not strictly required for registration
                    logger.warning("Continuing with user creation despite profile creation error")
                
                logger.info("=== USER REGISTRATION COMPLETED SUCCESSFULLY ===")
                return user
                
        except serializers.ValidationError as ve:
            # Re-raise validation errors as-is
            logger.error("=== VALIDATION ERROR DURING REGISTRATION ===")
            logger.error(f"Validation error: {str(ve)}")
            raise
            
        except Exception as e:
            error_trace = traceback.format_exc()
            logger.error("=== UNEXPECTED ERROR DURING REGISTRATION ===")
            logger.error(f"Error type: {type(e).__name__}")
            logger.error(f"Error message: {str(e)}")
            logger.error(f"Traceback:\n{error_trace}")
            
            # Convert to a validation error with a user-friendly message
            raise serializers.ValidationError({
                "error": "An unexpected error occurred during registration. Please try again later.",
                "details": str(e),
                "type": type(e).__name__
            })


class UserProfileSerializer(serializers.ModelSerializer):
    """
    Serializer for user profile data.
    This works directly with the User model.
    """
    is_active = serializers.BooleanField(read_only=True)
    date_joined = serializers.DateTimeField(read_only=True)
    is_employer = serializers.BooleanField(required=False)
    is_staff = serializers.BooleanField(read_only=True)
    
    # Add any additional profile fields that should be included in the API
    phone_number = serializers.CharField(source='profile.phone_number', required=False, allow_blank=True)
    bio = serializers.CharField(source='profile.bio', required=False, allow_blank=True)
    location = serializers.CharField(source='profile.location', required=False, allow_blank=True)
    skills = serializers.CharField(source='profile.skills', required=False, allow_blank=True)
    company_name = serializers.CharField(source='profile.company_name', required=False, allow_blank=True)

    class Meta:
        model = User
        fields = ('id', 'email', 'first_name', 'last_name', 'is_active', 
                 'date_joined', 'is_employer', 'is_staff',
                 'phone_number', 'bio', 'location', 'skills', 'company_name')
        read_only_fields = ('id', 'email', 'is_active', 'date_joined', 'is_staff')
    
    def update(self, instance, validated_data):
        # Handle profile data if it exists
        profile_data = {}
        for field in ['phone_number', 'bio', 'location', 'skills', 'company_name']:
            if f'profile.{field}' in validated_data:
                profile_data[field] = validated_data.pop(f'profile.{field}')
        
        # Update the user instance
        instance = super().update(instance, validated_data)
        
        # Update or create the profile if there's profile data
        if hasattr(instance, 'profile'):
            for key, value in profile_data.items():
                setattr(instance.profile, key, value)
            instance.profile.save()
        
        return instance
