from typing import Dict, Any, Optional, List, Union
from drf_spectacular.generators import SchemaGenerator
from drf_spectacular.openapi import AutoSchema
from drf_spectacular.plumbing import get_doc
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
    Custom schema generator that ensures consistent schema generation and example handling.
    This version is more aggressive in handling schema generation to prevent 'request_only' attribute errors.
    """
    def get_schema(self, request=None, public=False):
        # First call the parent's get_schema to ensure endpoints are initialized
        schema = super().get_schema(request, public)
        
        # If we have endpoints, set the default schema class for views that don't have one
        if hasattr(self, 'endpoints') and self.endpoints is not None:
            for view in self.endpoints.values():
                if view is None:
                    continue
                    
                # Set the schema if it's not already set
                if hasattr(view, 'schema') and view.schema is None:
                    view.schema = CustomAutoSchema()
                elif not hasattr(view, 'schema'):
                    view.schema = CustomAutoSchema()
        
        # Get the schema again with our custom schema classes
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
                    
                # Clean up responses
                if 'responses' in operation and isinstance(operation['responses'], dict):
                    for response_code, response in operation['responses'].items():
                        if not isinstance(response, dict):
                            continue
                            
                        # Clean up content
                        if 'content' in response and isinstance(response['content'], dict):
                            for content_type, content in response['content'].items():
                                if not isinstance(content, dict):
                                    continue
                                    
                                # Remove examples to prevent processing issues
                                if 'examples' in content:
                                    del content['examples']
                                
                                # Ensure schema exists
                                if 'schema' not in content:
                                    content['schema'] = {}
        
        return schema


class CustomAutoSchema(AutoSchema):
    """
    Custom AutoSchema that handles schema generation and example processing
    in a way that's more resilient to errors in the DRF Spectacular library.
    """
    def _get_examples(self, *args, **kwargs):
        """
        Completely override to prevent any example processing that might cause errors.
        We'll handle examples in the schema generator instead.
        """
        return {}
        
    def _get_serializer(self, path, method):
        """
        Safely get the serializer for the given path and method.
        """
        try:
            return super()._get_serializer(path, method)
        except Exception as e:
            logger.warning(f"Error getting serializer for {method} {path}: {str(e)}")
            return None
            
    def _get_response_bodies(self, *args, **kwargs):
        """
        Safely get response bodies, handling any errors that might occur.
        """
        try:
            return super()._get_response_bodies(*args, **kwargs)
        except Exception as e:
            logger.warning(f"Error getting response bodies: {str(e)}")
            return {}
            
    def _get_response_for_code(self, response_serializers, status_code, *args, **kwargs):
        """
        Safely get the response for a status code, with enhanced error handling.
        """
        try:
            response = super()._get_response_for_code(response_serializers, status_code, *args, **kwargs)
            
            # Ensure the response has the required structure
            if not isinstance(response, dict):
                response = {}
                
            # Ensure content exists
            if 'content' not in response:
                response['content'] = {}
                
            # Ensure each content type has a schema
            for content_type, content in response.get('content', {}).items():
                if not isinstance(content, dict):
                    content = {}
                    response['content'][content_type] = content
                    
                if 'schema' not in content:
                    content['schema'] = {}
                    
            return response
            
        except Exception as e:
            logger.warning(f"Error getting response for status {status_code}: {str(e)}")
            return {
                'description': 'Error generating response schema',
                'content': {
                    'application/json': {
                        'schema': {}
                        }
                    }
                }
            
    def _get_response_for_code(self, response_serializers, status_code, direction='response'):
        """
        Get the response object for a given status code, with enhanced error handling.
        """
        try:
            # Get the base response
            response = super()._get_response_for_code(response_serializers, status_code, direction)
            
            # If we don't have a valid response, return a minimal valid one
            if not isinstance(response, dict):
                return {'description': 'Response'}
                
            # Ensure we have a content section
            if 'content' not in response:
                response['content'] = {'application/json': {'schema': {}}}
            
            # Process each content type in the response
            for content_type, content in response.get('content', {}).items():
                if not isinstance(content, dict):
                    continue
                
                # Ensure we have a schema
                if 'schema' not in content:
                    content['schema'] = {}
                
                # Clean up examples if they exist
                if 'examples' in content and isinstance(content['examples'], dict):
                    # Create a new examples dict to store valid examples
                    valid_examples = {}
                    
                    for name, example in content['examples'].items():
                        try:
                            # Skip if this is a request example and we're processing a response
                            if direction == 'response' and hasattr(example, 'request_only') and example.request_only:
                                continue
                            # Skip if this is a response example and we're processing a request
                            if direction == 'request' and hasattr(example, 'response_only') and example.response_only:
                                continue
                                
                            # If we have a valid example, add it to our valid examples
                            if hasattr(example, 'value'):
                                valid_examples[name] = example
                            elif isinstance(example, dict) and 'value' in example:
                                valid_examples[name] = example
                                
                        except Exception as e:
                            logger.warning(f"Error processing example {name}: {str(e)}")
                            continue
                    
                    # Update the examples with only the valid ones
                    if valid_examples:
                        content['examples'] = valid_examples
                    else:
                        del content['examples']
                
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
