import React from 'react';

const JobSeekerProfile = ({ onLogout }) => {
  return (
    <div className="job-seeker-profile">
      <h2>Job Seeker Profile</h2>
      <div className="profile-content">
        {/* Job seeker profile content goes here */}
        <p>Name: John Doe</p>
        <p>Occupation: Software Engineer</p>
        <p>Skills: React, Node.js, SQL</p>
      </div>
      <button className="logout-button" onClick={onLogout}>
        Logout
      </button>
    </div>
  );
};

export default JobSeekerProfile;