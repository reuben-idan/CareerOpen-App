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

class UserRegistrationView(generics.CreateAPIView):
    """
    View to register a new user.
    """
    queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer
    permission_classes = [permissions.AllowAny]  # Allow unauthenticated access

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            # Generate tokens for the new user
            refresh = RefreshToken.for_user(user)
            return Response({
                'user': UserProfileSerializer(user).data,
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserProfileView(generics.RetrieveUpdateAPIView):
    """
    View to retrieve or update the current user's profile.
    """
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user


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
