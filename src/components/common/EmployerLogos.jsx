import React from 'react';
import '../../../src/styles/glassmorphism.css';

const EmployerLogos = ({ title = "Trusted by leading companies", companies = [] }) => {
  // Default company logos (can be replaced with actual company logos)
  const defaultCompanies = [
    { name: 'Company 1', logo: 'https://via.placeholder.com/150x60?text=Company+1' },
    { name: 'Company 2', logo: 'https://via.placeholder.com/150x60?text=Company+2' },
    { name: 'Company 3', logo: 'https://via.placeholder.com/150x60?text=Company+3' },
    { name: 'Company 4', logo: 'https://via.placeholder.com/150x60?text=Company+4' },
  ];

  const companyList = companies.length > 0 ? companies : defaultCompanies;

  return (
    <section className="glass-container">
      <div className="glass-content">
        {title && (
          <h2 className="glass-title">
            {title}
          </h2>
        )}
        <div className="logos-grid">
          {companyList.map((company, index) => (
            <div key={index} className="logo-container">
              <div className="logo-glass">
                <img
                  src={company.logo}
                  alt={company.name}
                  loading="lazy"
                  className="company-logo"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EmployerLogos;
