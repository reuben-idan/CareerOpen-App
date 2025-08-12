"""
Serializers for the core app.
"""
from rest_framework import serializers


class HealthCheckSerializer(serializers.Serializer):
    """
    Serializer for health check response.
    """
    status = serializers.CharField(read_only=True, help_text="Status of the service")
    timestamp = serializers.DateTimeField(read_only=True, help_text="Current server time")
    database = serializers.CharField(read_only=True, help_text="Database connection status")
    version = serializers.CharField(read_only=True, help_text="API version")

    class Meta:
        fields = ['status', 'timestamp', 'database', 'version']
