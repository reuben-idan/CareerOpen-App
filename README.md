# CareerOpen — Connecting Talent with Opportunity

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Frontend](https://img.shields.io/badge/frontend-React.js-61dafb?logo=react)](https://reactjs.org/)
[![Backend](https://img.shields.io/badge/backend-Django-092E20?logo=django)](https://www.djangoproject.com/)
[![Database](https://img.shields.io/badge/database-PostgreSQL-336791?logo=postgresql)](https://www.postgresql.org/)
[![Deployment](https://img.shields.io/badge/deployment-AWS-232f3e?logo=amazonaws)](https://aws.amazon.com/)
![Build Status](https://img.shields.io/github/actions/workflow/status/reuben-idan/CareerOpen-App/backend.yml?branch=main)
![Last Commit](https://img.shields.io/github/last-commit/reuben-idan/CareerOpen-App)
![Open Issues](https://img.shields.io/github/issues/reuben-idan/CareerOpen-App)
![Repo Size](https://img.shields.io/github/repo-size/reuben-idan/CareerOpen-App)

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm 8+
- Python 3.9+
- PostgreSQL 13+
- Redis (for caching and async tasks)

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/reuben-idan/CareerOpen-App.git
   cd CareerOpen-App/careeropen-backend
   ```

2. **Set up a virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   pip install -r requirements-dev.txt  # For development
   ```

4. **Set up environment variables**
   Create a `.env` file in the `careeropen-backend` directory with:
   ```env
   DEBUG=True
   SECRET_KEY=your-secret-key-here
   DATABASE_URL=postgres://user:password@localhost:5432/careeropen
   REDIS_URL=redis://localhost:6379/0
   ALLOWED_HOSTS=localhost,127.0.0.1
   CORS_ALLOWED_ORIGINS=http://localhost:3000
   ```

5. **Run database migrations**
   ```bash
   python manage.py migrate
   ```

6. **Create a superuser**
   ```bash
   python manage.py createsuperuser
   ```

7. **Start the development server**
   ```bash
   python manage.py runserver
   ```

### Frontend Setup

1. **Navigate to the frontend directory**
   ```bash
   cd ../  # From the backend directory
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open in your browser**
   ```
   http://localhost:3000
   ```

## 🔧 Environment Variables



### Frontend (`.env` in project root)
```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_APP_NAME=CareerOpen
VITE_APP_ENV=development
```

## 🛠 Development Tools

### Backend
- **Linting**: `flake8 .`
- **Type Checking**: `mypy .`
- **Testing**: `pytest`
- **Code Formatting**: `black .`

### Frontend
- **Linting**: `npm run lint`
- **Testing**: `npm test`
- **Code Formatting**: `npx prettier --write .`

## 🏗 Project Structure

```
careeropen/
├── careeropen-backend/     # Django backend
│   ├── config/            # Project settings
│   ├── jobs/              # Job-related models/views
│   ├── users/             # User authentication
│   ├── core/              # Shared utilities
│   ├── manage.py
│   └── requirements/
│       ├── base.txt
│       └── dev.txt
│
├── src/                   # React frontend
│   ├── components/        # Reusable components
│   ├── pages/             # Page components
│   ├── services/          # API services
│   └── App.jsx            # Main App component
│
├── public/                # Static files
└── package.json           # Frontend dependencies
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Reuben Idan**  
[LinkedIn](https://www.linkedin.com/in/reuben-idan/) | [GitHub](https://github.com/reuben-idan)

## 📚 Resources

- [Django Documentation](https://docs.djangoproject.com/)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [React Documentation](https://reactjs.org/)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Query Documentation](https://tanstack.com/query/latest)
- [Vitest](https://vitest.dev/)
