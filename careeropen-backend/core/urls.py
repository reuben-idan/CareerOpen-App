"""
URL configuration for core project.
"""
import os
from django.contrib import admin
from django.urls import path, include, re_path
from django.views.generic import RedirectView
from rest_framework import permissions
from rest_framework import routers
from drf_spectacular.views import (
    SpectacularRedocView,
    SpectacularSwaggerView,
    SpectacularAPIView
)
from .schema import CustomSchemaGenerator, CustomAutoSchema
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)
from .views import HealthCheckView, WelcomeView

# Create a router for the API
router = routers.DefaultRouter()

# API Info
API_TITLE = 'CareerOpen API'
API_DESCRIPTION = """
API documentation for CareerOpen application.
This API provides endpoints for managing job applications, user accounts, and professional networking.
"""
API_VERSION = 'v1'

# API URL patterns
api_patterns = [
    # Health check
    path('health/', HealthCheckView.as_view(), name='health_check'),
    
    # Authentication
    path('auth/', include('accounts.urls')),  # Includes token and user endpoints
    
    # JWT Token endpoints
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    
    # Apps
    path('jobs/', include('jobs.urls')),  # Job-related endpoints
    path('network/', include('network.urls')),  # Network-related endpoints
    
    # API Documentation
    path('schema/', SpectacularAPIView.as_view(generator_class=CustomSchemaGenerator), name='schema'),
    path('docs/', SpectacularSwaggerView.as_view(url_name='api_v1:schema'), name='swagger-ui'),
    path('redoc/', SpectacularRedocView.as_view(url_name='api_v1:schema'), name='redoc'),
]

# API v1 URLs
urlpatterns = [
    # Root URL - Welcome page with API documentation
    path('', WelcomeView.as_view(), name='welcome'),
    
    # Admin
    path('admin/', admin.site.urls),
    
    # API v1
    path('api/v1/', include((api_patterns, 'api_v1'), namespace='api_v1')),
    
    # Redirect old API URLs to v1
    path('api/', include([
        path('', RedirectView.as_view(url='/api/v1/')),
        path('docs/', RedirectView.as_view(url='/api/v1/docs/')),
        path('redoc/', RedirectView.as_view(url='/api/v1/redoc/')),
        path('schema/', RedirectView.as_view(url='/api/v1/schema/')),
    ])),
    
    # Redirect all other paths to the welcome page, but exclude paths that should be handled by API
    re_path(r'^(?!api/|admin/|auth/).*$', WelcomeView.as_view()),
]
