# CareerOpen

<div align="center">
  <img src="frontend/public/CareerOpen Logo.png" alt="CareerOpen Logo" width="200" height="auto">
</div>

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18.0-blue.svg)](https://reactjs.org/)
[![Django](https://img.shields.io/badge/Django-4.2-green.svg)](https://djangoproject.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://typescriptlang.org/)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)]()

A modern professional networking platform combining career management, job marketplace, and AI-powered insights.

## Features

- **Professional Networking** - Connect with industry professionals and build your network
- **Job Marketplace** - Advanced job search with AI-powered matching algorithms
- **Company Management** - Comprehensive recruiter tools and company pages
- **Real-time Messaging** - Instant communication between users
- **AI Career Insights** - Personalized career recommendations and skill gap analysis
- **Application Tracking** - End-to-end job application management
- **Analytics Dashboard** - Career progress and market insights

## Tech Stack

### Frontend
- React 18 with TypeScript
- Vite build tool
- Tailwind CSS with glassmorphism design
- Framer Motion animations
- Zustand state management
- React Query for data fetching

### Backend
- Django 4.2 with Django REST Framework
- JWT authentication with role-based access control
- SQLite (development) / PostgreSQL (production)
- Redis for caching and real-time features
- OpenAI integration for AI services

## Quick Start

### Prerequisites
- Node.js 18+
- Python 3.9+
- Git

### Installation

1. Clone the repository
```bash
git clone https://github.com/reuben-idan/CareerOpen-App.git
cd CareerOpen-App
```

2. Setup Frontend
```bash
cd frontend
npm install
npm run dev
```

3. Setup Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
python manage.py migrate
python manage.py runserver
```

## Project Structure

```
CareerOpen-App/
├── frontend/              # React TypeScript application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Application pages
│   │   ├── stores/        # Zustand state management
│   │   └── services/      # API and external services
│   └── package.json
├── backend/               # Django REST API
│   ├── careeropen/        # Project settings
│   ├── authentication/    # User auth and JWT
│   ├── profiles/          # User profiles
│   ├── jobs/              # Job management
│   ├── applications/      # Application tracking
│   ├── messaging/         # Real-time messaging
│   ├── ai_services/       # AI integration
│   └── requirements.txt
└── README.md
```

## API Documentation

The API follows REST conventions with comprehensive endpoint coverage:

- **Authentication**: `/api/auth/` - Registration, login, token refresh
- **Profiles**: `/api/profiles/` - User profile management
- **Jobs**: `/api/jobs/` - Job listings with advanced filtering
- **Applications**: `/api/applications/` - Application tracking
- **Companies**: `/api/companies/` - Company management
- **AI Services**: `/api/ai/` - Career insights and recommendations

Full API documentation available at `/api/docs/` when running the development server.

## Development

### Environment Variables

Create `.env` files in both frontend and backend directories:

**Backend (.env)**
```
SECRET_KEY=your-secret-key
DEBUG=True
OPENAI_API_KEY=your-openai-key
DATABASE_URL=sqlite:///db.sqlite3
```

**Frontend (.env)**
```
VITE_API_URL=http://localhost:8000/api
```

### Testing

```bash
# Frontend tests
cd frontend
npm test

# Backend tests
cd backend
python manage.py test
```

## Deployment

### Production Build

```bash
# Frontend
cd frontend
npm run build

# Backend
cd backend
python manage.py collectstatic
```

### Deployment Platforms

- **Frontend**: Vercel, Netlify, AWS S3 + CloudFront
- **Backend**: Railway, Heroku, AWS EC2, DigitalOcean
- **Database**: PostgreSQL on AWS RDS, Supabase
- **File Storage**: AWS S3, Cloudinary

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support and questions:
- Create an issue on GitHub
- Contact: support@careeropen.com
- Documentation: [docs.careeropen.com](https://docs.careeropen.com)