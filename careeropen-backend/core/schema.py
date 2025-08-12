from typing import Dict, Any, Optional
from drf_spectacular.generators import SchemaGenerator
from drf_spectacular.openapi import AutoSchema
from drf_spectacular.plumbing import get_doc
from drf_spectacular.types import OpenApiTypes
from drf_spectacular.utils import OpenApiExample, OpenApiResponse, extend_schema

def preprocess_example_responses(result=None, **kwargs):
    """
    Preprocess example responses to ensure they are in the correct format.
    This helps prevent the 'dict' object has no attribute 'request_only' error.
    
    Args:
        result: The schema result dictionary (for post-processing hook)
        **kwargs: Additional arguments that might be passed by drf-spectacular
        
    Returns:
        The processed result or endpoints depending on the hook type
    """
    # Handle both pre and post processing hooks
    if result is None and 'endpoints' in kwargs:
        # This is a pre-processing hook (before endpoints are processed)
        return kwargs['endpoints']
    
    # This is a post-processing hook (after schema is generated)
    if result is None:
        return {}
        
    def clean_examples(examples: Dict[str, Any]) -> Dict[str, Any]:
        cleaned = {}
        if not isinstance(examples, dict):
            return cleaned
            
        for key, value in examples.items():
            if value is None:
                continue
            if hasattr(value, 'get') and 'value' in value:
                cleaned[key] = value
            elif isinstance(value, (OpenApiExample, dict)):
                cleaned[key] = {'value': value}
            else:
                cleaned[key] = {'value': value}
        return cleaned

    if isinstance(result, dict) and 'paths' in result:
        for path, methods in result['paths'].items():
            if not isinstance(methods, dict):
                continue
                
            for method, operation in methods.items():
                if not isinstance(operation, dict):
                    continue
                    
                if method.lower() in ['get', 'post', 'put', 'patch', 'delete']:
                    if 'responses' in operation and isinstance(operation['responses'], dict):
                        for response in operation['responses'].values():
                            if not isinstance(response, dict):
                                continue
                                
                            if 'content' in response and isinstance(response['content'], dict):
                                for content_type, content in response['content'].items():
                                    if not isinstance(content, dict):
                                        continue
                                        
                                    if 'examples' in content and content['examples'] is not None:
                                        content['examples'] = clean_examples(content['examples'])
    
    return result

class CustomSchemaGenerator(SchemaGenerator):
    """
    Custom schema generator that handles example dictionaries more gracefully.
    This prevents the 'dict' object has no attribute 'request_only' error.
    """
    def get_schema(self, request=None, public=False):
        schema = super().get_schema(request, public)
        # Ensure all responses have valid examples
        if schema and 'paths' in schema:
            for path, methods in schema['paths'].items():
                for method, operation in methods.items():
                    if method.lower() in ['get', 'post', 'put', 'patch', 'delete']:
                        self._clean_response_examples(operation)
        return schema

    def _clean_response_examples(self, operation):
        """Clean up response examples to be compatible with drf-spectacular"""
        if 'responses' in operation:
            for response in operation['responses'].values():
                if 'content' in response:
                    for content_type, content in response['content'].items():
                        if 'examples' in content:
                            # Convert any OpenAPI example objects to plain dicts
                            if isinstance(content['examples'], dict):
                                for example_name, example in content['examples'].items():
                                    if hasattr(example, 'get'):
                                        content['examples'][example_name] = {
                                            'value': example.get('value', {})
                                        }


class CustomAutoSchema(AutoSchema):
    """Custom AutoSchema that handles example dictionaries more gracefully"""
    def _get_response_for_code(self, response_serializers, status_code, direction='response'):
        response = super()._get_response_for_code(response_serializers, status_code, direction)
        # Ensure examples are properly formatted
        if 'content' in response:
            for content_type, content in response['content'].items():
                if 'examples' in content and isinstance(content['examples'], dict):
                    for example_name, example in content['examples'].items():
                        if hasattr(example, 'get'):
                            content['examples'][example_name] = {
                                'value': example.get('value', {})
                            }
        return response
