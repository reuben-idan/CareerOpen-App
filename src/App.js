import React, { useState } from 'react';
import Registration from './components/Registration';
import Login from './components/Login';
import JobSeekerProfile from './components/JobSeekerProfile';
import EmployerProfile from './components/EmployerProfile';

const App = () => {
  const [user, setUser] = useState(null);
  const [currentStep, setCurrentStep] = useState('registration');

  const handleRegistration = (userData) => {
    // Simulate user registration
    setUser({ ...userData, loggedIn: false });
    setCurrentStep('login');
  };

  const handleLogin = (loginData) => {
    // Simulate user login
    setUser({ ...user, loggedIn: true });
    setCurrentStep('profile');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentStep('registration');
  };

  return (
    <div className="app-container">
      {currentStep === 'registration' && (
        <Registration onSubmit={handleRegistration} />
      )}
      {currentStep === 'login' && <Login onLogin={handleLogin} />}
      {currentStep === 'profile' && user.userType === 'jobSeeker' && (
        <JobSeekerProfile onLogout={handleLogout} />
      )}
      {currentStep === 'profile' && user.userType === 'employer' && (
        <EmployerProfile onLogout={handleLogout} />
      )}
    </div>
  );
};

export default App;