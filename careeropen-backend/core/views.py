"""
Core views for the CareerOpen application.
"""
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db import connection
from django.utils import timezone


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
