"""
API documentation for the network app.

This module contains API documentation and schema definitions for the network app.
"""
from rest_framework import permissions

# API documentation description
API_DESCRIPTION = """
# CareerOpen Network API

This API provides endpoints for managing user connections, following relationships, 
messaging, and notifications in the CareerOpen platform.

## Authentication

All endpoints require authentication using JWT tokens. Include the token in the 
`Authorization` header as follows:

```
Authorization: Bearer <your_token_here>
```

## Rate Limiting

API requests are rate-limited to prevent abuse. The default rate limits are:
- 1000 requests per day
- 100 requests per hour

## Error Handling

All error responses follow the same format:

```json
{
    "detail": "Error message here"
}
```

## Response Format

All successful responses include a `data` field containing the requested data:

```json
{
    "data": {
        // Response data here
    }
}
```

## Pagination

List endpoints are paginated with the following query parameters:
- `page`: Page number (default: 1)
- `page_size`: Number of items per page (default: 20, max: 100)

Example paginated response:

```json
{
    "count": 42,
    "next": "https://api.careeropen.app/endpoint/?page=2",
    "previous": null,
    "results": [
        // Items here
    ]
}
```
"""

# Create schema view for API documentation
schema_view = get_schema_view(
    openapi.Info(
        title="CareerOpen Network API",
        default_version='v1',
        description=description,
        terms_of_service="https://www.careeropen.app/terms/",
        contact=openapi.Contact(email="api@careeropen.app"),
        license=openapi.License(name="MIT License"),
    ),
    public=True,
    permission_classes=[permissions.AllowAny],
)

# Common response schemas
error_response_schema = {
    "type": "object",
    "properties": {
        "detail": {"type": "string", "description": "Error message"},
        "code": {"type": "string", "description": "Error code"},
    }
}

# Common parameters
AUTH_HEADER = [
    openapi.Parameter(
        'Authorization',
        openapi.IN_HEADER,
        description="JWT token in format 'Bearer <token>'",
        type=openapi.TYPE_STRING,
        required=True
    )
]

# Common responses
UNAUTHORIZED_RESPONSE = {
    "401": openapi.Response(
        description="Unauthorized",
        examples={"application/json": {"detail": "Authentication credentials were not provided."}}
    ),
    "403": openapi.Response(
        description="Forbidden",
        examples={"application/json": {"detail": "You do not have permission to perform this action."}}
    ),
}

# Common request bodies
CONNECTION_REQUEST_BODY = openapi.Schema(
    type=openapi.TYPE_OBJECT,
    required=['to_user', 'message'],
    properties={
        'to_user': openapi.Schema(type=openapi.TYPE_INTEGER, description='ID of the user to connect with'),
        'message': openapi.Schema(type=openapi.TYPE_STRING, description='Optional message to include with the connection request'),
    },
)

MESSAGE_REQUEST_BODY = openapi.Schema(
    type=openapi.TYPE_OBJECT,
    required=['recipient', 'content'],
    properties={
        'recipient': openapi.Schema(type=openapi.TYPE_INTEGER, description='ID of the message recipient'),
        'content': openapi.Schema(type=openapi.TYPE_STRING, description='Message content'),
    },
)

# Response schemas for documentation
CONNECTION_SCHEMA = {
    "type": "object",
    "properties": {
        "id": {"type": "integer"},
        "from_user": {"$ref": "#/components/schemas/UserBasic"},
        "to_user": {"$ref": "#/components/schemas/UserBasic"},
        "status": {"type": "string", "enum": ["pending", "accepted", "declined", "blocked"]},
        "message": {"type": "string", "nullable": True},
        "created_at": {"type": "string", "format": "date-time"},
        "updated_at": {"type": "string", "format": "date-time"},
    }
}

FOLLOW_SCHEMA = {
    "type": "object",
    "properties": {
        "id": {"type": "integer"},
        "follower": {"$ref": "#/components/schemas/UserBasic"},
        "following": {"$ref": "#/components/schemas/UserBasic"},
        "created_at": {"type": "string", "format": "date-time"},
    }
}

MESSAGE_SCHEMA = {
    "type": "object",
    "properties": {
        "id": {"type": "integer"},
        "sender": {"$ref": "#/components/schemas/UserBasic"},
        "recipient": {"$ref": "#/components/schemas/UserBasic"},
        "content": {"type": "string"},
        "is_read": {"type": "boolean"},
        "created_at": {"type": "string", "format": "date-time"},
        "read_at": {"type": "string", "format": "date-time", "nullable": True},
    }
}

NOTIFICATION_SCHEMA = {
    "type": "object",
    "properties": {
        "id": {"type": "integer"},
        "notification_type": {"type": "string"},
        "title": {"type": "string"},
        "message": {"type": "string"},
        "is_read": {"type": "boolean"},
        "created_at": {"type": "string", "format": "date-time"},
        "read_at": {"type": "string", "format": "date-time", "nullable": True},
        "data": {"type": "object", "additionalProperties": True},
    }
}

# Add components to the schema
components = {
    "schemas": {
        "Connection": CONNECTION_SCHEMA,
        "Follow": FOLLOW_SCHEMA,
        "Message": MESSAGE_SCHEMA,
        "Notification": NOTIFICATION_SCHEMA,
        "Error": error_response_schema,
    }
}

# Update the schema view with components
try:
    schema_view.get_serializer = lambda *args, **kwargs: None  # Prevent schema generation errors
    if hasattr(schema_view, 'schema') and hasattr(schema_view.schema, 'components'):
        schema_view.schema.components = openapi.ReferenceResolver(
            openapi.SCHEMA_DEFINITIONS, 
            force_init=True
        )
        for name, schema in components["schemas"].items():
            if not hasattr(schema_view.schema, 'definitions'):
                schema_view.schema.definitions = {}
            schema_view.schema.definitions[name] = schema
except Exception as e:
    import warnings
    warnings.warn(f"Failed to initialize API documentation: {str(e)}")
    # Continue without API documentation if there's an error
