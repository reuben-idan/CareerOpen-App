"""
Core views for the CareerOpen application.
"""
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.reverse import reverse
from rest_framework import serializers
from drf_spectacular.utils import extend_schema, OpenApiResponse
from django.db import connection
from django.utils import timezone
from django.http import JsonResponse
from django.views.generic import View
from django.conf import settings

from .serializers import HealthCheckSerializer


class HealthCheckView(APIView):
    """
    API endpoint for health checks.
    Returns 200 OK if the server is running and can connect to the database.
    
    This endpoint can be used by load balancers and monitoring tools to verify
    that the service is operational.
    
    Response includes:
    - status: Service status (ok/error)
    - timestamp: Current server time
    - database: Database connection status
    - version: API version
    """
    permission_classes = []  # No authentication required
    serializer_class = HealthCheckSerializer
    
    @extend_schema(
        summary='Check service health status',
        description='Returns the health status of the API and its dependencies.',
        responses={
            200: HealthCheckSerializer,
            500: OpenApiResponse(
                response={"type": "object", "properties": {"error": {"type": "string"}}},
                description='Server error'
            ),
            503: OpenApiResponse(
                response={"type": "object", "properties": {"error": {"type": "string"}}},
                description='Service unavailable'
            ),
        },
        tags=['health']
    )
    def get(self, request, *args, **kwargs):
        """
        Check the health of the service and its dependencies.
        
        This endpoint performs the following checks:
        - Database connectivity
        - Service responsiveness
        
        Returns HTTP 200 if all systems are operational.
        """
        try:
            # Test database connection
            with connection.cursor() as cursor:
                cursor.execute("SELECT 1")
                db_ok = cursor.fetchone()
            
            if not db_ok:
                return Response(
                    {'error': 'Database connection failed'},
                    status=status.HTTP_503_SERVICE_UNAVAILABLE
                )
            
            # Prepare response data
            data = {
                'status': 'ok',
                'timestamp': timezone.now().isoformat(),
                'database': 'connected',
                'version': getattr(settings, 'API_VERSION', '1.0.0'),
            }
            
            serializer = self.serializer_class(data=data)
            serializer.is_valid(raise_exception=True)
            
            return Response(serializer.data, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response(
                {
                    'status': 'error',
                    'error': str(e),
                    'timestamp': timezone.now().isoformat()
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class WelcomeView(View):
    """
    Welcome view that provides information about the API endpoints.
    """
    def get(self, request, *args, **kwargs):
        base_url = request.build_absolute_uri('/').rstrip('/')
        
        endpoints = {
            'api_documentation': f"{base_url}/api/docs/",
            'health_check': f"{base_url}/api/health/",
            'authentication': {
                'obtain_token': f"{base_url}/api/token/",
                'refresh_token': f"{base_url}/api/token/refresh/",
                'verify_token': f"{base_url}/api/token/verify/"
            },
            'endpoints': {
                'jobs': f"{base_url}/api/jobs/",
                'network': f"{base_url}/api/network/"
            },
            'documentation': 'https://github.com/reuben-idan/CareerOpen-App',
            'version': '1.0.0',
            'status': 'operational'
        }
        
        return JsonResponse({
            'message': 'Welcome to CareerOpen API',
            'endpoints': endpoints,
            'timestamp': timezone.now().isoformat()
        })
