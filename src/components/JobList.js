import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function JobListings({ searchParams }) {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch(`/api/jobs?${new URLSearchParams(searchParams)}`);
        const data = await response.json();
        setJobs(data);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      }
    };
    fetchJobs();
  }, [searchParams]);

  return (
    <div className="container my-4">
      <div className="row">
        {jobs.map((job) => (
          <div key={job.id} className="col-12 col-md-6 col-lg-4 mb-4">
            <div className="card h-100">
              <div className="card-body">
                <Link to={`/jobs/${job.id}`} className="text-decoration-none text-dark">
                  <h5 className="card-title">{job.title}</h5>
                  <p className="card-text">{job.company}</p>
                  <p className="card-text">{job.location}</p>
                  <p className="card-text">{job.salary}</p>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default JobListings;