"""
URL configuration for core project.
"""
from django.contrib import admin
from django.urls import path, include
from django.utils import timezone
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)
from .views import HealthCheckView, WelcomeView

# Swagger/OpenAPI schema view
schema_view = get_schema_view(
    openapi.Info(
        title="CareerOpen API",
        default_version='v1',
        description="API documentation for CareerOpen application",
        terms_of_service="https://www.careeropen.app/terms/",
        contact=openapi.Contact(email="contact@careeropen.app"),
        license=openapi.License(name="MIT License"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

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
    path('network/', include('network.urls')),  # Network-related endpoints (connections, messages, etc.)
]

urlpatterns = [
    # Root URL - Welcome page with API documentation
    path('', WelcomeView.as_view(), name='welcome'),
    
    # Admin
    path('admin/', admin.site.urls),
    
    # API
    path('api/', include(api_patterns)),
    
    # API Documentation
    path('api/docs/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('api/redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
    path('api/schema.json', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    
    # Redirect all other paths to the welcome page
    path('<path:path>/', WelcomeView.as_view()),
]
