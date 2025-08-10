from rest_framework import generics, status, permissions, viewsets
from rest_framework.permissions import IsAuthenticated, BasePermission, IsAdminUser
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import action
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import get_user_model, authenticate
from .serializers import UserRegistrationSerializer, UserProfileSerializer, CustomTokenObtainPairSerializer

User = get_user_model()


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
    Custom token obtain view that includes additional user data in the response.
    """
    serializer_class = CustomTokenObtainPairSerializer


class UserLoginView(APIView):
    """
    View to handle user login and return JWT tokens.
    """
    permission_classes = [permissions.AllowAny]
    
    def post(self, request, *args, **kwargs):
        email = request.data.get('email')
        password = request.data.get('password')
        
        if not email or not password:
            return Response(
                {'error': 'Please provide both email and password'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        user = authenticate(request, email=email, password=password)
        
        if not user:
            return Response(
                {'error': 'Invalid credentials'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        if not user.is_active:
            return Response(
                {'error': 'Account is disabled'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        refresh = RefreshToken.for_user(user)
        return Response({
            'user': {
                'id': user.id,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'is_employer': user.is_employer,
                'is_staff': user.is_staff,
            },
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        })

import logging

logger = logging.getLogger(__name__)

class UserRegistrationView(generics.CreateAPIView):
    """
    View to register a new user.
    """
    queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer
    permission_classes = [permissions.AllowAny]  # Allow unauthenticated access

    def create(self, request, *args, **kwargs):
        logger.info(f"Registration request received with data: {request.data}")
        
        try:
            serializer = self.get_serializer(data=request.data)
            if serializer.is_valid():
                logger.info("Serializer is valid, attempting to save user...")
                try:
                    user = serializer.save()
                    logger.info(f"User created successfully with email: {user.email}")
                    
                    # Generate tokens for the new user
                    try:
                        refresh = RefreshToken.for_user(user)
                        logger.info("Refresh token generated successfully")
                        
                        # Get user profile data
                        try:
                            user_data = UserProfileSerializer(user).data
                            logger.info("User profile data serialized successfully")
                            
                            return Response({
                                'user': user_data,
                                'refresh': str(refresh),
                                'access': str(refresh.access_token),
                            }, status=status.HTTP_201_CREATED)
                            
                        except Exception as e:
                            logger.error(f"Error serializing user profile: {str(e)}", exc_info=True)
                            return Response(
                                {'error': 'Error processing user data', 'details': str(e)},
                                status=status.HTTP_500_INTERNAL_SERVER_ERROR
                            )
                            
                    except Exception as e:
                        logger.error(f"Error generating tokens: {str(e)}", exc_info=True)
                        return Response(
                            {'error': 'Error generating authentication tokens', 'details': str(e)},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR
                        )
                        
                except Exception as e:
                    logger.error(f"Error saving user: {str(e)}", exc_info=True)
                    return Response(
                        {'error': 'Error creating user account', 'details': str(e)},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR
                    )
            
            logger.warning(f"Invalid registration data: {serializer.errors}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
        except Exception as e:
            logger.critical(f"Unexpected error in registration: {str(e)}", exc_info=True)
            return Response(
                {'error': 'An unexpected error occurred during registration', 'details': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

import logging
from rest_framework.exceptions import APIException
from rest_framework import status

logger = logging.getLogger(__name__)

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
