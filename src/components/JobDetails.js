import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const JobDetails = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await axios.get(`/api/jobs/${id}`);
        setJob(response.data);
      } catch (err) {
        setError(err.response.data.message);
      }
    };
    fetchJobDetails();
  }, [id]);

  if (!job) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {error && <div className="error">{error}</div>}
      <h1>{job.title}</h1>
      <p>{job.company}</p>
      <p>{job.location}</p>
      <p>{job.category}</p>
      <p>{job.experience}</p>
      <p>{job.description}</p>
      <p>Salary: {job.salary}</p>
      <p>Posted: {new Date(job.createdAt).toLocaleDateString()}</p>
      <button>Apply</button>
    </div>
  );
};

export default JobDetails;