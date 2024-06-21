// ResumePreview.js
import React from 'react';

function ResumePreview({ resume }) {
  return (
    <div className="container my-5">
      <h2>Resume Preview</h2>
      {resume ? (
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">{resume.name}</h5>
            <p className="card-text">{resume.type}</p>
            <p className="card-text">Size: {resume.size} bytes</p>
            {/* Add additional preview details as needed */}
          </div>
        </div>
      ) : (
        <p>No resume uploaded yet.</p>
      )}
    </div>
  );
}

export default ResumePreview;