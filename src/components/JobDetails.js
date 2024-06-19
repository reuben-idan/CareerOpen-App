import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function JobDetails() {
  const { id } = useParams();
  const [job, setJob] = useState(null);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await fetch(`/api/jobs/${id}`);
        const data = await response.json();
        setJob(data);
      } catch (error) {
        console.error('Error fetching job details:', error);
      }
    };
    fetchJobDetails();
  }, [id]);

  if (!job) {
    return <div className="container my-4">Loading...</div>;
  }

  return (
    <div className="container my-4">
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title">{job.title}</h2>
              <p className="card-text">{job.company}</p>
              <p className="card-text">{job.location}</p>
              <p className="card-text">{job.salary}</p>
              <p className="card-text">{job.description}</p>
              <p className="card-text">Job Type: {job.jobType}</p>
              <button className="btn btn-primary">Apply</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JobDetails;