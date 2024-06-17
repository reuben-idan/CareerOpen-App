import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CompanyProfile = ({ companyId }) => {
  const [company, setCompany] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCompanyProfile = async () => {
      try {
        const response = await axios.get(`/api/companies/${companyId}`);
        setCompany(response.data);
      } catch (err) {
        setError(err.response.data.message);
      }
    };
    fetchCompanyProfile();
  }, [companyId]);

  if (!company) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div>
      <h2>{company.name}</h2>
      <p>{company.description}</p>
      <p>Industry: {company.industry}</p>
      <p>Headquarters: {company.headquarters}</p>
      <p>Website: <a href={company.website}>{company.website}</a></p>
      <p>Employees: {company.employeeCount}</p>
    </div>
  );
};

export default CompanyProfile;