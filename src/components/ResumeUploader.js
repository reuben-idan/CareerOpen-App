import React, { useState } from 'react';
import axios from 'axios';

const ResumeUploader = () => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('resume', file);

    try {
      await axios.post('/api/resumes', formData);
      // Reset the file input
      setFile(null);
      // Update the resume list component
    } catch (err) {
      setError(err.response.data.message);
    }
  };

  return (
    <form onSubmit={handleUpload}>
      <div>
        <label htmlFor="resume">Upload Resume:</label>
        <input
          type="file"
          id="resume"
          accept=".pdf,.doc,.docx"
          onChange={handleFileChange}
        />
      </div>
      {error && <div className="error">{error}</div>}
      <button type="submit">Upload</button>
    </form>
  );
};

export default ResumeUploader;