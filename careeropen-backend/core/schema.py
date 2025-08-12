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
    Custom schema generator that provides robust error handling and validation
    for OpenAPI schema generation. This implementation is designed to be resilient
    to errors in the DRF Spectacular library and ensure a valid OpenAPI schema is always returned.
    """
    def get_schema(self, request=None, public=False):
        """
        Generate a schema document with robust error handling and validation.
        This method ensures we always return a valid OpenAPI schema, even if parts of the 
        generation process fail.
        """
        try:
            # First, ensure all views have our custom schema class
            self._ensure_custom_schemas()
            
            # Generate the base schema
            schema = super().get_schema(request=request, public=public)
            
            # Ensure we have a valid schema dictionary
            if not isinstance(schema, dict):
                return self._get_minimal_schema("Invalid schema format from base generator")
                
            # Validate and clean the schema
            schema = self._validate_and_clean_schema(schema)
            
            # Add security schemes if not present
            if 'components' not in schema:
                schema['components'] = {}
                
            if 'securitySchemes' not in schema['components']:
                schema['components']['securitySchemes'] = {}
                
            # Add common responses if not present
            if 'responses' not in schema['components']:
                schema['components']['responses'] = {
                    '400': {'description': 'Bad Request'},
                    '401': {'description': 'Unauthorized'},
                    '403': {'description': 'Forbidden'},
                    '404': {'description': 'Not Found'},
                    '500': {'description': 'Internal Server Error'},
                }
                
            # Ensure all paths have the required structure
            self._validate_and_clean_paths(schema)
                
            return schema
            
        except Exception as e:
            logger.error(f"Error generating schema: {str(e)}", exc_info=True)
            return self._get_minimal_schema(f"Error generating schema: {str(e)}")
    
    def _ensure_custom_schemas(self):
        """Ensure all views have our custom schema class."""
        if hasattr(self, 'endpoints') and self.endpoints is not None:
            for view in self.endpoints.values():
                if view is None:
                    continue
                    
                # Set the schema if it's not already set
                if hasattr(view, 'schema') and view.schema is None:
                    view.schema = CustomAutoSchema()
                elif not hasattr(view, 'schema'):
                    view.schema = CustomAutoSchema()
    
    def _get_minimal_schema(self, error_message=None):
        """Return a minimal valid OpenAPI schema with an error message."""
        schema = {
            'openapi': '3.0.3',
            'info': {
                'title': 'CareerOpen API',
                'version': '1.0.0',
                'description': 'API documentation for CareerOpen application' + 
                             (f"\n\nError: {error_message}" if error_message else "")
            },
            'servers': [
                {'url': 'https://careeropen-api.onrender.com', 'description': 'Production server'},
                {'url': 'http://localhost:8000', 'description': 'Local development server'},
            ],
            'paths': {},
            'components': {
                'schemas': {},
                'responses': {
                    '400': {'description': 'Bad Request'},
                    '401': {'description': 'Unauthorized'},
                    '403': {'description': 'Forbidden'},
                    '404': {'description': 'Not Found'},
                    '500': {'description': 'Internal Server Error'},
                },
                'securitySchemes': {}
            },
            'security': []
        }
        return schema
    
    def _validate_and_clean_schema(self, schema):
        """
        Validate and clean the generated schema to ensure it's valid OpenAPI.
        This handles common issues that might cause the schema to be invalid.
        """
        if not isinstance(schema, dict):
            return self._get_minimal_schema("Schema is not a dictionary")
            
        # Ensure required top-level fields exist
        if 'openapi' not in schema:
            schema['openapi'] = '3.0.3'
            
        if 'info' not in schema or not isinstance(schema['info'], dict):
            schema['info'] = {
                'title': 'CareerOpen API',
                'version': '1.0.0',
                'description': 'API documentation for CareerOpen application'
            }
        else:
            # Ensure required info fields exist
            if 'title' not in schema['info']:
                schema['info']['title'] = 'CareerOpen API'
            if 'version' not in schema['info']:
                schema['info']['version'] = '1.0.0'
                
        # Ensure paths exists and is an object
        if 'paths' not in schema or not isinstance(schema['paths'], dict):
            schema['paths'] = {}
            
        # Clean up paths
        self._validate_and_clean_paths(schema)
            
        # Ensure components exists and is an object
        if 'components' not in schema or not isinstance(schema['components'], dict):
            schema['components'] = {}
            
        return schema
    
    def _validate_and_clean_paths(self, schema):
        """Validate and clean the paths in the schema."""
        if 'paths' not in schema or not isinstance(schema['paths'], dict):
            return
            
        for path in list(schema['paths'].keys()):
            path_item = schema['paths'][path]
            if not isinstance(path_item, dict):
                del schema['paths'][path]
                continue
                
            # Clean up each HTTP method in the path
            for method in list(path_item.keys()):
                operation = path_item[method]
                if not isinstance(operation, dict):
                    del path_item[method]
                    continue
                    
                # Ensure responses exists and is an object
                if 'responses' not in operation or not isinstance(operation['responses'], dict):
                    operation['responses'] = {}
                    
                # Ensure each response has a description and clean content
                for status_code, response in operation['responses'].items():
                    if not isinstance(response, dict):
                        operation['responses'][status_code] = {'description': 'Response'}
                    else:
                        if 'description' not in response:
                            response['description'] = 'Response'
                            
                        # Clean up content
                        if 'content' in response and isinstance(response['content'], dict):
                            for content_type, content in response['content'].items():
                                if not isinstance(content, dict):
                                    response['content'][content_type] = {'schema': {}}
                                elif 'schema' not in content:
                                    content['schema'] = {}
                                    
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
        Safely handle example processing to prevent 'request_only' attribute errors.
        This version is more resilient to different input types and handles edge cases.
        """
        try:
            # If we don't have the expected arguments, return empty dict
            if not args and not kwargs:
                return {}
                
            # If we have a serializer as first arg, check if it's a dict
            if args and isinstance(args[0], dict):
                return {}
                
            # If we have a 'direction' in kwargs and it's 'response', return empty dict
            # to avoid processing response examples that might cause issues
            if kwargs.get('direction') == 'response':
                return {}
                
            # For any other case, try to call the parent method but be prepared to catch errors
            try:
                return super()._get_examples(*args, **kwargs)
            except Exception as e:
                logger.warning(f"Error in _get_examples: {str(e)}")
                return {}
                
        except Exception as e:
            logger.error(f"Unexpected error in _get_examples: {str(e)}", exc_info=True)
            return {}
        
    def _get_response_bodies(self, *args, **kwargs):
        """
        Safely get response bodies, handling any errors that might occur.
        This is the main entry point for response schema generation.
        """
        try:
            # Call the parent method but handle potential errors
            response_bodies = super()._get_response_bodies(*args, **kwargs)
            if not isinstance(response_bodies, dict):
                return {}
                
            # Ensure all responses have the correct structure
            for status_code, response in response_bodies.items():
                if not isinstance(response, dict):
                    response_bodies[status_code] = {'description': 'Response'}
                    continue
                    
                # Ensure content exists and is a dict
                if 'content' not in response or not isinstance(response['content'], dict):
                    response['content'] = {}
                    
                # Ensure each content type has a schema
                for content_type, content in response['content'].items():
                    if not isinstance(content, dict):
                        response['content'][content_type] = {'schema': {}}
                    elif 'schema' not in content:
                        content['schema'] = {}
                        
            return response_bodies
            
        except Exception as e:
            logger.error(f"Error in _get_response_bodies: {str(e)}", exc_info=True)
            return {}
    
    def _get_response_for_code(self, response_serializers, status_code, **kwargs):
        """
        Safely get the response for a status code, with enhanced error handling.
        This is a critical method that often causes issues with example processing.
        """
        try:
            # First, get the base response without processing examples
            response = super()._get_response_for_code(response_serializers, status_code, **kwargs)
            
            # If we don't have a valid response, return a minimal one
            if not isinstance(response, dict):
                return {
                    'description': 'Success' if status_code == '200' else 'Response',
                    'content': {
                        'application/json': {
                            'schema': {}
                        }
                    }
                }
                
            # Ensure the response has the required structure
            if 'content' not in response or not response['content']:
                response['content'] = {
                    'application/json': {
                        'schema': {}
                    }
                }
            
            # Clean up any problematic examples
            if 'content' in response and isinstance(response['content'], dict):
                for content_type, content in response['content'].items():
                    if not isinstance(content, dict):
                        response['content'][content_type] = {'schema': {}}
                        continue
                        
                    # Ensure schema exists
                    if 'schema' not in content:
                        content['schema'] = {}
                        
                    # Remove examples to prevent processing issues
                    if 'examples' in content:
                        del content['examples']
                        
            return response
            
        except Exception as e:
            logger.error(f"Error in _get_response_for_code: {str(e)}", exc_info=True)
            # Return a minimal valid response
            return {
                'description': 'Success' if status_code == '200' else 'Response',
                'content': {
                    'application/json': {
                        'schema': {}
                    }
                }
            }
            
    def get_operation(self, *args, **kwargs):
        """
        Override get_operation to ensure we handle examples safely.
        """
        try:
            operation = super().get_operation(*args, **kwargs)
            
            # Ensure we have a valid operation
            if not isinstance(operation, dict):
                return {}
                
            # Ensure responses exists and is a dict
            if 'responses' not in operation or not isinstance(operation['responses'], dict):
                operation['responses'] = {}
                
            # Ensure each response has the required structure
            for status_code, response in operation['responses'].items():
                if not isinstance(response, dict):
                    operation['responses'][status_code] = {}
                    continue
                    
                # Ensure content exists and is a dict
                if 'content' not in response or not isinstance(response['content'], dict):
                    response['content'] = {}
                    
                # Ensure each media type has a schema
                for media_type, content in response['content'].items():
                    if not isinstance(content, dict):
                        response['content'][media_type] = {}
                        continue
                        
                    # Ensure schema exists
                    if 'schema' not in content or not isinstance(content['schema'], dict):
                        content['schema'] = {}
                        
            return operation
            
        except Exception as e:
            logger.error(f"Error in get_operation: {str(e)}", exc_info=True)
            # Return a minimal valid operation to prevent 500 errors
            return {
                'responses': {
                    '200': {
                        'description': 'Success',
                        'content': {
                            'application/json': {
                                'schema': {}
                            }
                        }
                    }
                }
            }
            
    def _get_response_bodies(self, *args, **kwargs):
        """
        Safely get response bodies, handling any errors that might occur.
        """
        try:
            return super()._get_response_bodies(*args, **kwargs)
        except Exception as e:
            logger.error(f"Error in _get_response_bodies: {str(e)}", exc_info=True)
            return {}
            
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
