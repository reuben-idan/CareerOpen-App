import React from 'react';

const ResumeSection = ({ resumeUrl }) => {
  return (
    <div className="resume-section">
      <h3>Resume</h3>
      {resumeUrl ? (
        <a href={resumeUrl} className="resume-link" target="_blank" rel="noopener noreferrer">
          Download Resume
        </a>
      ) : (
        <p>No resume available</p>
      )}
    </div>
  );
};

export default ResumeSection;