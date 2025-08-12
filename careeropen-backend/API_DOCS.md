# CareerOpen API Documentation

## Table of Contents
- [Authentication](#authentication)
  - [Obtain JWT Token](#obtain-jwt-token)
  - [Refresh JWT Token](#refresh-jwt-token)
  - [Verify JWT Token](#verify-jwt-token)
  - [Error Handling](#error-handling)
- [Protected Endpoints](#protected-endpoints)
- [Job Applications](#job-applications)
  - [List User's Job Applications](#list-users-job-applications)
  - [Apply for a Job](#apply-for-a-job)
  - [Get Application Details](#get-application-details)

## Authentication

### Obtain JWT Token

**Endpoint**: `POST /api/v1/token/`

**Description**: Authenticate a user and obtain JWT access and refresh tokens.

**Request Body**:
```json
{
    "email": "user@example.com",
    "password": "yourpassword"
}
```

**Response (Success - 200 OK)**:
```json
{
    "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (Error - 401 Unauthorized)**:
```json
{
    "detail": "No active account found with the given credentials"
}
```

### Refresh JWT Token

**Endpoint**: `POST /api/v1/token/refresh/`

**Description**: Obtain a new access token using a valid refresh token.

**Request Body**:
```json
{
    "refresh": "your-refresh-token"
}
```

**Response (Success - 200 OK)**:
```json
{
    "access": "new-access-token"
}
```

### Verify JWT Token

**Endpoint**: `POST /api/v1/token/verify/`

**Description**: Verify if an access token is valid.

**Request Body**:
```json
{
    "token": "your-access-token"
}
```

**Response (Valid Token - 200 OK)**:
```json
{}
```

**Response (Invalid Token - 401 Unauthorized)**:
```json
{
    "detail": "Token is invalid or expired",
    "code": "token_not_valid"
}
```

### Error Handling

#### Common Authentication Errors

| Status Code | Error Message | Description |
|-------------|---------------|-------------|
| 400 | Email and password are required | Missing required fields in request |
| 401 | No active account found | Invalid credentials |
| 401 | Token is invalid or expired | Invalid or expired token |
| 403 | CSRF Failed: CSRF token missing or incorrect | Missing or invalid CSRF token (for session-based auth) |

## Protected Endpoints

All endpoints except the following require authentication:
- `POST /api/v1/token/`
- `POST /api/v1/token/refresh/`
- `POST /api/v1/token/verify/`
- `GET /api/v1/health/`

To access protected endpoints, include the JWT token in the Authorization header:
```
Authorization: Bearer your-access-token
```

**Example Request**:
```http
GET /api/v1/auth/me/ HTTP/1.1
Host: your-domain.com
Authorization: Bearer your-access-token
Content-Type: application/json
```

**Example Response (200 OK)**:
```json
{
    "id": 1,
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "is_active": true,
    "is_employer": false,
    "is_staff": false
}
```

## Job Applications

### List User's Job Applications

**Endpoint**: `GET /api/jobs/applications/`

**Headers**:
- `Authorization: Bearer <access-token>`

**Query Parameters**:
- `page` (optional): Page number for pagination
- `page_size` (optional): Number of items per page (default: 10, max: 100)

**Response**:
```json
{
    "count": 1,
    "next": null,
    "previous": null,
    "results": [
        {
            "id": 3,
            "job": 1,
            "applicant": 6,
            "cover_letter": "",
            "resume": "/media/resumes/example.pdf",
            "status": "applied",
            "applied_at": "2025-08-01T23:20:00Z"
        }
    ]
}
```

### Apply for a Job

**Endpoint**: `POST /api/jobs/{job_id}/apply/`

**Headers**:
- `Content-Type: multipart/form-data`
- `Authorization: Bearer <access-token>`

**Form Data**:
- `cover_letter` (optional): Cover letter text
- `resume` (required): Resume file (PDF, DOC, DOCX)

**Response (Success - 201 Created)**:
```json
{
    "id": 4,
    "job": 1,
    "applicant": 6,
    "cover_letter": "I'm excited to apply for this position...",
    "resume": "/media/resumes/example_updated.pdf",
    "status": "applied",
    "applied_at": "2025-08-01T23:45:00Z"
}
```

**Response (Error - 400 Bad Request)**:
```json
{
    "detail": "You have already applied to this job."
}
```

### Get Application Details

**Endpoint**: `GET /api/jobs/applications/{application_id}/`

**Headers**:
- `Authorization: Bearer <access-token>`

**Response (Success - 200 OK)**:
```json
{
    "id": 3,
    "job": {
        "id": 1,
        "title": "Senior Software Engineer",
        "company": "Tech Corp",
        "location": "Remote"
    },
    "applicant": 6,
    "cover_letter": "I'm excited to apply for this position...",
    "resume": "/media/resumes/example.pdf",
    "status": "applied",
    "applied_at": "2025-08-01T23:20:00Z"
}
```

## Error Responses

### 400 Bad Request
```json
{
    "field_name": ["Error message"]
}
```

### 401 Unauthorized
```json
{
    "detail": "Authentication credentials were not provided."
}
```

### 403 Forbidden
```json
{
    "detail": "You do not have permission to perform this action."
}
```

### 404 Not Found
```json
{
    "detail": "Not found."
}
```
