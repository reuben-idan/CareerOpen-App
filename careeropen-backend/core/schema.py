from typing import Dict, Any, Optional, List, Union
from drf_spectacular.generators import SchemaGenerator, EndpointEnumerator
from drf_spectacular.openapi import AutoSchema
from drf_spectacular.plumbing import get_doc, force_real_str
from drf_spectacular.types import OpenApiTypes
from drf_spectacular.utils import OpenApiExample, OpenApiResponse, extend_schema
from drf_spectacular.drainage import get_override
from drf_spectacular.settings import spectacular_settings
from drf_spectacular.validation import validate_schema

import logging
logger = logging.getLogger(__name__)

def preprocess_example_responses(result=None, **kwargs):
    """Minimal preprocessor that just returns the input to avoid processing examples"""
    if result is not None:
        return result
    if 'endpoints' in kwargs:
        return kwargs['endpoints']
    return {}

class CustomSchemaGenerator(SchemaGenerator):
    """
    Custom schema generator that completely bypasses problematic example handling.
    This is a more aggressive approach to prevent the 'request_only' attribute error.
    """
    def get_schema(self, request=None, public=False):
        # Get the base schema without any example processing
        schema = super().get_schema(request, public)
        
        # If we don't have a valid schema, return early
        if not schema or 'paths' not in schema:
            return schema
            
        # Clean up the schema to remove any problematic examples
        for path, methods in schema['paths'].items():
            if not isinstance(methods, dict):
                continue
                
            for method, operation in methods.items():
                if not isinstance(operation, dict) or method.lower() not in ['get', 'post', 'put', 'patch', 'delete']:
                    continue
                    
                # Remove examples completely to avoid processing issues
                if 'responses' in operation and isinstance(operation['responses'], dict):
                    for response in operation['responses'].values():
                        if not isinstance(response, dict) or 'content' not in response:
                            continue
                            
                        for content in response['content'].values():
                            if isinstance(content, dict) and 'examples' in content:
                                del content['examples']
                                
        return schema


class CustomAutoSchema(AutoSchema):
    """
    Custom AutoSchema that completely bypasses problematic example processing.
    This is a minimal implementation that focuses on generating a valid schema
    without any example processing that could cause issues.
    """
    def _get_response_for_code(self, response_serializers, status_code, direction='response'):
        try:
            # Get the base response without any example processing
            response = super()._get_response_for_code(response_serializers, status_code, direction)
            
            # If we don't have a valid response, return a minimal valid one
            if not isinstance(response, dict):
                return {'description': 'Response'}
                
            # Ensure we have a content section
            if 'content' not in response:
                response['content'] = {'application/json': {'schema': {}}}
                
            # Clean up the response to remove any problematic examples
            for content_type, content in response.get('content', {}).items():
                if not isinstance(content, dict):
                    continue
                    
                # Remove examples completely to avoid processing issues
                if 'examples' in content:
                    del content['examples']
                    
                # Ensure we have a schema
                if 'schema' not in content:
                    content['schema'] = {}
            
            return response
            
        except Exception as e:
            logger.error(f"Error in CustomAutoSchema._get_response_for_code: {str(e)}", exc_info=True)
            
            # Return a minimal valid response
            return {
                'description': 'Response',
                'content': {
                    'application/json': {
                        'schema': {}
                    }
                }
            }
