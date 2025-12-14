# CareerOpen - Next-Gen Professional Network

A modern career operating system combining professional networking, job marketplace, and AI-powered career insights.

## 🏗️ Project Structure

```
CareerOpen-App/
├── frontend/          # React + TypeScript frontend
│   ├── src/
│   ├── package.json
│   └── vite.config.ts
├── backend/           # Django REST API backend
│   ├── careeropen/    # Django project settings
│   ├── authentication/# User authentication & JWT
│   ├── profiles/      # User profiles & experience
│   ├── companies/     # Company management
│   ├── jobs/          # Job postings & search
│   ├── applications/  # Job applications
│   ├── messaging/     # User messaging (planned)
│   ├── notifications/ # Real-time notifications (planned)
│   ├── analytics/     # Usage analytics (planned)
│   └── requirements.txt
└── package.json       # Workspace root
```

## 🚀 Quick Start

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
python manage.py migrate
python manage.py runserver
```

## 🎨 Design System

- Apple-inspired glassmorphism
- Ocean-themed color palette
- Smooth animations with Framer Motion
- Responsive design with Tailwind CSS

## 🛠️ Tech Stack

**Frontend:**
- React 18 + TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- Zustand
- React Query

**Backend:**
- Python + Django
- Django REST Framework
- JWT Authentication
- PostgreSQL
- Redis (Celery)
- Role-based Access Control

## 🔐 Authentication

- JWT tokens with refresh mechanism
- Role-based permissions (Candidate, Recruiter, Admin)
- Secure password validation
- Email verification (planned)

## 📊 Features

- **User Profiles**: Comprehensive professional profiles
- **Job Marketplace**: Advanced job search and filtering
- **Company Pages**: Recruiter company management
- **Applications**: Job application tracking
- **Real-time Updates**: Live notifications and messaging
- **Analytics**: Career insights and job market data
- **AI Integration**: Smart job matching and recommendations

## 🌐 API Endpoints

- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - User login
- `GET /api/jobs/` - List jobs with filtering
- `POST /api/applications/` - Apply to jobs
- `GET /api/profiles/` - User profile management
- `GET /api/companies/` - Company listings

Visit `/api/docs/` for complete API documentation.

## 🚀 Deployment

- Frontend: Vercel/Netlify
- Backend: Railway/Heroku
- Database: PostgreSQL
- File Storage: AWS S3
- Caching: Redis