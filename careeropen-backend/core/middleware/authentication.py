"""
Authentication middleware for CareerOpen API.

This middleware handles JWT token validation and user authentication.
"""
import jwt
from django.conf import settings
from django.contrib.auth import get_user_model
from django.http import JsonResponse
from functools import wraps
from rest_framework import status

User = get_user_model()

def get_authorization_header(request):
    """Extract the JWT token from the Authorization header."""
    auth = request.META.get('HTTP_AUTHORIZATION', '').split()
    
    if not auth or auth[0].lower() != 'bearer':
        return None
    
    if len(auth) == 1:
        return None
    elif len(auth) > 2:
        return None
    
    return auth[1]

def jwt_required(view_func):
    """
    Decorator to ensure the request has a valid JWT token.
    
    This decorator checks for a valid JWT token in the Authorization header
    and attaches the corresponding user to the request object.
    """
    @wraps(view_func)
    def wrapped_view(request, *args, **kwargs):
        token = get_authorization_header(request)
        
        if not token:
            return JsonResponse(
                {'error': 'Authentication credentials were not provided.'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        try:
            # Decode the JWT token
            payload = jwt.decode(
                token,
                settings.SECRET_KEY,
                algorithms=['HS256']
            )
            
            # Get the user from the token
            user_id = payload.get('user_id')
            if not user_id:
                raise jwt.InvalidTokenError('Invalid token payload')
                
            # Get the user from the database
            try:
                user = User.objects.get(id=user_id, is_active=True)
            except User.DoesNotExist:
                return JsonResponse(
                    {'error': 'User not found or inactive.'},
                    status=status.HTTP_401_UNAUTHORIZED
                )
            
            # Attach the user to the request
            request.user = user
            
        except jwt.ExpiredSignatureError:
            return JsonResponse(
                {'error': 'Token has expired.'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        except jwt.InvalidTokenError as e:
            return JsonResponse(
                {'error': 'Invalid token.', 'details': str(e)},
                status=status.HTTP_401_UNAUTHORIZED
            )
        except Exception as e:
            return JsonResponse(
                {'error': 'Authentication failed.', 'details': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
        return view_func(request, *args, **kwargs)
    
    return wrapped_view

def role_required(*roles):
    """
    Decorator to ensure the user has the required role(s).
    
    Args:
        *roles: One or more role names that are allowed to access the view.
        
    Returns:
        function: Decorated view function that checks for the required role(s).
    """
    def decorator(view_func):
        @wraps(view_func)
        def wrapped_view(request, *args, **kwargs):
            if not hasattr(request, 'user') or not request.user.is_authenticated:
                return JsonResponse(
                    {'error': 'Authentication required.'},
                    status=status.HTTP_401_UNAUTHORIZED
                )
            
            user_role = getattr(request.user, 'role', None)
            if user_role not in roles:
                return JsonResponse(
                    {'error': 'You do not have permission to perform this action.'},
                    status=status.HTTP_403_FORBIDDEN
                )
            
            return view_func(request, *args, **kwargs)
        return wrapped_view
    return decorator
