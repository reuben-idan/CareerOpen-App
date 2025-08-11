"""
URL configuration for core project.
"""
import os
from django.contrib import admin
from django.urls import path, include, re_path
from django.views.generic import RedirectView
from django.conf import settings
from rest_framework import permissions
from rest_framework import routers
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)
from .views import HealthCheckView, WelcomeView

# Create a router for the API
router = routers.DefaultRouter()

# Swagger/OpenAPI schema view
schema_view = get_schema_view(
    openapi.Info(
        title="CareerOpen API",
        default_version='v1',
        description="""
        API documentation for CareerOpen application.
        This API provides endpoints for managing job applications, user accounts, and professional networking.
        """,
        terms_of_service="https://www.careeropen.app/terms/",
        contact=openapi.Contact(email="contact@careeropen.app"),
        license=openapi.License(name="MIT License"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
    url=os.getenv('API_BASE_URL', 'https://careeropen-api.onrender.com'),
)

# Add a schema info function for drf-yasg
def schema_info():
    return schema_view.with_ui('swagger', cache_timeout=0)

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
    path('docs/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
    path('openapi.json', schema_view.without_ui(cache_timeout=0), name='schema-json'),
]

urlpatterns = [
    # Root URL - Welcome page with API documentation
    path('', WelcomeView.as_view(), name='welcome'),
    
    # Admin
    path('admin/', admin.site.urls),
    
    # API
    path('api/v1/', include(api_patterns)),
    
    # Redirect old API URLs to v1
    path('api/', include([
        path('', RedirectView.as_view(url='/api/v1/')),
        path('docs/', RedirectView.as_view(url='/api/v1/docs/')),
        path('redoc/', RedirectView.as_view(url='/api/v1/redoc/')),
    ])),
    
    # API Documentation (legacy support)
    re_path(r'^api/docs(?P<format>\.json|\.yaml)$', 
            schema_view.without_ui(cache_timeout=0), 
            name='schema-json'),
    
    # Redirect all other paths to the welcome page
    path('<path:path>/', WelcomeView.as_view()),
]
