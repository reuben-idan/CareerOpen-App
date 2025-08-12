"""
URL configuration for core project.
"""
import os
from django.contrib import admin
from django.urls import path, include, re_path
from django.views.generic import RedirectView
from rest_framework import permissions
from rest_framework import routers
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)
from .views import HealthCheckView, WelcomeView
from .schema import MinimalSchemaView

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
    
    # Schema (using our minimal implementation)
    path('schema/', MinimalSchemaView.as_view(), name='schema'),
    
    # Authentication
    path('auth/', include('accounts.urls')),  # Includes token and user endpoints
    
    # JWT Token endpoints
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    
    # Apps
    path('jobs/', include('jobs.urls')),  # Job-related endpoints
    path('network/', include('network.urls')),  # Network-related endpoints
]

# API v1 URLs
urlpatterns = [
    # Root URL - Welcome page with API documentation
    path('', WelcomeView.as_view(), name='welcome'),
    
    # Admin
    path('admin/', admin.site.urls),
    
    # API v1
    path('api/v1/', include((api_patterns, 'api_v1'), namespace='api_v1')),
    
    # API Documentation - using our minimal schema view
    path('api/v1/schema/', MinimalSchemaView.as_view(), name='schema'),
    
    # Simple welcome page for API docs
    path('api/v1/docs/', TemplateView.as_view(
        template_name='api_docs.html',
        extra_context={
            'title': 'CareerOpen API',
            'description': 'API documentation for CareerOpen application.',
            'schema_url': '/api/v1/schema/'
        }
    ), name='api-docs'),
    
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
