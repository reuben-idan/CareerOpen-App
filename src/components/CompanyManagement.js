import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CompanyManagement = () => {
  const [company, setCompany] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCompanyProfile = async () => {
      try {
        const response = await axios.get('/api/companies/me');
        setCompany(response.data);
      } catch (err) {
        setError(err.response.data.message);
      }
    };
    fetchCompanyProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put('/api/companies/me', company);
    } catch (err) {
      setError(err.response.data.message);
    }
  };

  const handleInputChange = (e) => {
    setCompany({ ...company, [e.target.name]: e.target.value });
  };

  if (!company) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div>
      <h2>Manage Company Profile</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Company Name:</label>
          <input type="text" id="name" name="name" value={company.name} onChange={handleInputChange} />
        </div>
        <div>
          <label htmlFor="description">Description:</label>
          <textarea id="description" name="description" value={company.description} onChange={handleInputChange}></textarea>
        </div>
        <div>
          <label htmlFor="industry">Industry:</label>
          <input type="text" id="industry" name="industry" value={company.industry} onChange={handleInputChange} />
        </div>
        <div>
          <label htmlFor="headquarters">Headquarters:</label>
          <input type="text" id="headquarters" name="headquarters" value={company.headquarters} onChange={handleInputChange} />
        </div>
        <div>
          <label htmlFor="website">Website:</label>
          <input type="text" id="website" name="website" value={company.website} onChange={handleInputChange} />
        </div>
        <div>
          <label htmlFor="employeeCount">Number of Employees:</label>
          <input type="number" id="employeeCount" name="employeeCount" value={company.employeeCount} onChange={handleInputChange} />
        </div>
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default CompanyManagement;