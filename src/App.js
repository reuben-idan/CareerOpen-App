// app.js
import React from 'react';
import { Route, Routes, Link } from 'react-router-dom';
import RegisterForm from './components/RegisterForm';
import LoginForm from './components/LoginForm';
import UserProfile from './components/UserProfile';
import JobList from './components/JobList';
import JobForm from './components/JobForm';
import JobDetails from './components/JobDetails';

import logo from './logo.jpeg';

function App() {
  return (
    <div className="container my-5">
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary mb-4">
        <div className="container">
          <Link to="/" className="navbar-brand d-flex align-items-center">
            <img src={logo} alt="CareerOpen Logo" className="mr-2" style={{ height: '35px' }} />
           {/* <span>CareerOpen</span>*/}
          </Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link to="/register" className="nav-link">Register</Link>
              </li>
              <li className="nav-item">
                <Link to="/login" className="nav-link">Login</Link>
              </li>
              <li className="nav-item">
                <Link to="/profile" className="nav-link">Profile</Link>
              </li>
              <li className="nav-item">
                <Link to="/jobs" className="nav-link">Jobs</Link>
              </li>
              <li className="nav-item">
                <Link to="/jobs/new" className="nav-link">Post Job</Link>
              </li>
           
            </ul>
          </div>
        </div>
      </nav>

      <Routes>
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/jobs" element={<JobList />} />
        <Route path="/jobs/:id" element={<JobDetails />} />
        <Route path="/jobs/new" element={<JobForm />} />
      
      </Routes>
    </div>
  );
}

export default App;