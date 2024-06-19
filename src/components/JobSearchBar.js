import React, { useState } from 'react';

function JobSearchBar({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [jobType, setJobType] = useState('');
  const [salary, setSalary] = useState('');

  const handleSearch = () => {
    onSearch({
      searchTerm,
      location,
      jobType,
      salary,
    });
  };

  return (
    <div className="container my-4">
      <div className="row">
        <div className="col-12 col-md-3 mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search jobs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="col-12 col-md-3 mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        <div className="col-12 col-md-3 mb-3">
          <select
            className="form-select"
            value={jobType}
            onChange={(e) => setJobType(e.target.value)}
          >
            <option value="">Job Type</option>
            <option value="full-time">Full-time</option>
            <option value="part-time">Part-time</option>
            <option value="internship">Internship</option>
          </select>
        </div>
        <div className="col-12 col-md-3 mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Salary Range"
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
          />
        </div>
      </div>
      <div className="row">
        <div className="col-12 d-flex justify-content-end">
          <button className="btn btn-primary" onClick={handleSearch}>
            Search
          </button>
        </div>
      </div>
    </div>
  );
}

export default JobSearchBar;