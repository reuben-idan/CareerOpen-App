import React from 'react';

const EmployerProfile = ({ onLogout }) => {
  return (
    <div className="employer-profile">
      <h2>Employer Profile</h2>
      <div className="profile-content">
        {/* Employer profile content goes here */}
        <p>Company Name: Acme Inc.</p>
        <p>Industry: Technology</p>
        <p>Employees: 500+</p>
      </div>
      <button className="logout-button" onClick={onLogout}>
        Logout
      </button>
    </div>
  );
};

export default EmployerProfile;