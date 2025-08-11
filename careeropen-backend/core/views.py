"""
Core views for the CareerOpen application.
"""
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.reverse import reverse
from django.db import connection
from django.utils import timezone
from django.http import JsonResponse
from django.views.generic import View


class HealthCheckView(APIView):
    """
    API endpoint for health checks.
    Returns 200 OK if the server is running and can connect to the database.
    """
    permission_classes = []  # No authentication required
    
    def get(self, request, *args, **kwargs):
        try:
            # Test database connection
            with connection.cursor() as cursor:
                cursor.execute("SELECT 1")
                db_ok = cursor.fetchone()
                
            if db_ok:
                return Response(
                    {
                        'status': 'healthy',
                        'database': 'connected',
                        'timestamp': timezone.now().isoformat()
                    },
                    status=status.HTTP_200_OK
                )
            else:
                return Response(
                    {'status': 'unhealthy', 'database': 'error'},
                    status=status.HTTP_503_SERVICE_UNAVAILABLE
                )
                
        except Exception as e:
            return Response(
                {
                    'status': 'unhealthy',
                    'database': 'connection_failed',
                    'error': str(e)
                },
                status=status.HTTP_503_SERVICE_UNAVAILABLE
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
