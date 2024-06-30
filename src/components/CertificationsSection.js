import React from 'react';

const CertificationsSection = ({ certifications }) => {
  return (
    <div className="certifications-section">
      <h3>Certifications</h3>
      {certifications.map((item) => (
        <div key={item.id} className="certification-item">
          <h4>{item.name}</h4>
          <p>{item.issuer}</p>
          <p>{item.year}</p>
        </div>
      ))}
    </div>
  );
};

export default CertificationsSection;