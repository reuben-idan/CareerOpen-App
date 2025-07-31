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

---

## Tech Stack

- **Frontend:** React.js
- **Backend:** Node.js
- **Database:** MongoDB
- **Testing:** Vitest, React Testing Library

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

---

## Design

CareerOpen offers a sleek, professional interface with interactive elements for an efficient and enjoyable user journey across all devices.

---

## Getting Started

To run CareerOpen locally:

1. **Clone the repository**
    ```bash
    git clone https://github.com/reuben-idan/CareerOpen-App.git
    cd CareerOpen-App
    ```

2. **Install dependencies**
    ```bash
    npm install
    ```

3. **Set up environment variables**
    - Create a `.env` file based on `.env.example`
    - Fill in required environment variables

4. **Run the development server**
    ```bash
    npm start
    ```
    Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## Scripts

- `npm start` — Launches the app in development mode.
- `npm test` — Runs unit and component tests.
- `npm run build` — Builds the app for production.

---

## Testing

This project uses [Vitest](https://vitest.dev/) and [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/).

- **To run all tests:**
    ```bash
    npm test
    ```
- **Test locations:** Test files are located next to components (e.g., `Component.test.jsx`), or in `__tests__` folders.
- **Writing tests:** Use `.test.js` or `.test.jsx` extensions.

Sample tests include:  
- `src/components/common/LoadingSpinner.test.jsx`  
- `src/components/jobs/JobCard.test.jsx`  

---

## Contributing

Contributions are welcome. Please review our [contribution guidelines](CONTRIBUTING.md) before submitting a pull request.

---

## License

This project is licensed under the [MIT License](LICENSE).

---

## Contact

Questions, feedback or support requests?  
Reach out via [GitHub Issues](https://github.com/reuben-idan/CareerOpen-App/issues) or email at [reuben.idan@gmail.com].

---

## Resources

- [Create React App Documentation](https://facebook.github.io/create-react-app/docs/getting-started)
- [React Documentation](https://reactjs.org/)
- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)

---
