# CareerOpen — Connecting Talent with Opportunity

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/frontend-React.js-61dafb?logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/backend-Node.js-3c873a?logo=node.js)](https://nodejs.org/)
![License](https://img.shields.io/github/license/reuben-idan/CareerOpen-App)
![Build Status](https://img.shields.io/github/actions/workflow/status/reuben-idan/CareerOpen-App/backend.yml?branch=main)
![Last Commit](https://img.shields.io/github/last-commit/reuben-idan/CareerOpen-App)
![Open Issues](https://img.shields.io/github/issues/reuben-idan/CareerOpen-App)
![Repo Size](https://img.shields.io/github/repo-size/reuben-idan/CareerOpen-App)

---

## Overview

CareerOpen is a modern job board platform engineered to seamlessly connect top talent with leading employers. With a focus on intuitive user experience, advanced job-matching, and robust analytics, CareerOpen empowers users to discover opportunities and employers to find the perfect fit.
The **CareerOpen Backend** is a Django-based RESTful API powering a modern job board platform. It supports dynamic job posting, search, and application features with secure, role-based access for administrators and job seekers. Designed for scalability, performance, and seamless frontend integration.

---

## Project Goals

- RESTful API with CRUD operations for jobs, users, and categories
- Role-based access control for admins and job seekers
- PostgreSQL database with optimized queries and indexing
- JWT authentication and secure permissions
- Swagger/OpenAPI documentation
- Production-grade deployment on AWS (EC2 + NGINX + Gunicorn)

---

## Features

- User Registration: Secure sign-up for employers and job seekers
- Advanced Job Search: Powerful filters by location, job type, and more
- Resume Uploads: Effortless document management
- Job Alerts: Personalized email notifications
- Company Profiles: Rich employer branding
- Application Tracking: Real-time status updates
- Responsive Design: Mobile-friendly UI
- Secure Payments: For premium listings and services
- Analytics Dashboard: Actionable insights for employers
- User Reviews and Ratings: Community-driven feedback
- Career Resources: Guidance and tips for job seekers
- JWT-based user authentication and registration
- Role-based access control (Admin, Recruiter, Candidate)
- CRUD operations for job postings, applications, and categories
- Search and filter jobs by location, industry, and type
- Admin dashboard for job and user management
- RESTful API with Swagger and ReDoc documentation


---
## Tech Stack

| Technology         | Purpose                             |
|--------------------|--------------------------------------|
| Django             | Backend framework                    |
| Django REST Framework | API development framework        |
| PostgreSQL         | Relational database (RDS or EC2)     |
| JWT (SimpleJWT)    | Secure user authentication           |
| Swagger / ReDoc    | API documentation                    |
| AWS EC2 / RDS / S3 | Deployment and cloud infrastructure  |

## Design

CareerOpen offers a sleek, professional interface with interactive elements for an efficient and enjoyable user journey across all devices.

---


careeropen-backend/
├── config/              # Django project settings
├── jobs/                # Job-related models, views, serializers
├── users/               # Authentication and user roles
├── core/                # Reusable utilities
├── requirements.txt     # Dependencies
├── manage.py            # Django CLI
└── README.md
```

## Contribution Guidelines

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add feature X'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a pull request

## License

This project is licensed under the [MIT License](LICENSE).

## Author

**Reuben Idan**  
[LinkedIn](https://www.linkedin.com/in/reuben-idan/) | [GitHub](https://github.com/reuben-idan)

---

> Backend system for CareerOpen – a modern platform that connects job seekers with opportunities through an accessible, secure, and performant API-first architecture.

## Resources

- [Create React App Documentation](https://facebook.github.io/create-react-app/docs/getting-started)
- [React Documentation](https://reactjs.org/)
- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)

---
