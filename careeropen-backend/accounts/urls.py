from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from . import views
from .views import SimpleRegistrationView

urlpatterns = [
    # JWT Authentication
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('login/', views.UserLoginView.as_view(), name='user_login'),
    
    # User endpoints
    path('me/', views.UserProfileView.as_view(), name='user_profile'),
    path('register/', views.UserRegistrationView.as_view(), name='user_register'),
    path('register/simple/', SimpleRegistrationView.as_view(), name='simple_register'),
    
    # User management (admin only)
    path('users/', views.UserListView.as_view(), name='user_list'),
    path('users/<int:pk>/', views.UserDetailView.as_view(), name='user_detail'),
]
