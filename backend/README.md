# CareerOpen Backend

Django REST API for the CareerOpen professional networking platform.

## Setup

1. Create virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Set up environment variables:
```bash
cp .env.example .env
# Uses SQLite by default - no additional configuration needed
```

4. Run migrations:
```bash
python manage.py makemigrations
python manage.py migrate
```

5. Create superuser:
```bash
python manage.py createsuperuser
```

6. Run development server:
```bash
python manage.py runserver
```

## Database

**Default**: SQLite (no setup required)
**Production**: PostgreSQL (set `USE_SQLITE=False` in .env)

## API Documentation

Visit `/api/docs/` for Swagger UI documentation.

## Architecture

- **Clean Architecture**: Separation of concerns with models, serializers, views
- **Role-based Access**: Candidate, Recruiter, Admin roles
- **JWT Authentication**: Secure token-based authentication
- **RESTful API**: Standard REST endpoints with proper HTTP methods
- **Filtering & Search**: Advanced filtering and search capabilities

## Core Modules

- **Authentication**: User registration, login, JWT tokens
- **Profiles**: User profiles with experience and education
- **Companies**: Company management for recruiters
- **Jobs**: Job postings with advanced filtering
- **Applications**: Job application management
- **Messaging**: User-to-user messaging (planned)
- **Notifications**: Real-time notifications (planned)
- **Analytics**: Usage analytics and insights (planned)