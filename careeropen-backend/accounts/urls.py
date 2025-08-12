from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from . import views
from .views import SimpleRegistrationView  # Removed direct import of api_token_obtain_pair

# Create a router for ViewSets
router = DefaultRouter()
router.register(r'users', views.UserViewSet, basename='user')

# Create a simple view for the user profile
user_profile_view = views.UserProfileView.as_view()

urlpatterns = [
    # JWT Authentication
    path('token/', views.api_token_obtain_pair, name='api_token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('login/', views.UserLoginView.as_view(), name='user_login'),
    
    # User endpoints - Note: These are already under /api/v1/auth/ from core/urls.py
    path('me/', user_profile_view, name='user_profile'),
    path('register/', views.UserRegistrationView.as_view(), name='user_register'),
    path('register/simple/', SimpleRegistrationView.as_view(), name='simple_register'),
    
    # Include ViewSet URLs
    path('', include(router.urls)),
]
