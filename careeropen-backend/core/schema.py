"""
Minimal schema implementation for DRF Spectacular that completely bypasses schema generation.
This is a workaround for issues with DRF Spectacular's schema generation.
"""

import logging
from rest_framework import views
from rest_framework.response import Response
from rest_framework.permissions import AllowAny

logger = logging.getLogger(__name__)

class MinimalSchemaView(views.APIView):
    """
    A minimal schema view that returns a basic OpenAPI schema.
    This completely bypasses DRF Spectacular's schema generation.
    """
    permission_classes = [AllowAny]
    
    def get(self, request, *args, **kwargs):
        """
        Return a minimal OpenAPI schema.
        """
        return Response({
            "openapi": "3.0.3",
            "info": {
                "title": "CareerOpen API",
                "description": "Minimal API documentation. Full schema generation is disabled due to compatibility issues.",
                "version": "1.0.0"
            },
            "paths": {},
            "components": {}
        })
