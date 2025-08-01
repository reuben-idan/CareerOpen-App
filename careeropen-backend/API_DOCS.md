# CareerOpen API Documentation

## Authentication

### Obtain JWT Token

**Endpoint**: `POST /api/token/`

**Request Body**:
```json
{
    "email": "user@example.com",
    "password": "yourpassword"
}
```

**Response**:
```json
{
    "refresh": "<refresh-token>",
    "access": "<access-token>"
}
```

**Note**: Use the `access` token in the Authorization header for authenticated requests:
```
Authorization: Bearer <access-token>
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
