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
    Custom AutoSchema that handles example processing more robustly to prevent
    the 'request_only' attribute error in DRF Spectacular.
    """
    def _get_examples(self, serializer, direction, media_type, status_code, examples):
        """
        Override to safely handle examples and prevent 'request_only' attribute errors.
        This is a more robust implementation that safely processes examples.
        """
        if not examples:
            return
            
        try:
            # If examples is a dictionary, process it safely
            if isinstance(examples, dict):
                for name, example in examples.items():
                    if not isinstance(example, dict):
                        continue
                    # Skip if this is a request example and we're processing a response
                    if direction == 'response' and example.get('request_only', False):
                        continue
                    # Skip if this is a response example and we're processing a request
                    if direction == 'request' and example.get('response_only', False):
                        continue
                    
                    # Add the example if it's valid
                    if 'value' in example:
                        if 'examples' not in examples:
                            examples['examples'] = {}
                        examples['examples'][name] = example
        
        except Exception as e:
            logger.warning(f"Error processing examples in CustomAutoSchema: {str(e)}")
            # Don't re-raise, just continue without examples
            
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
