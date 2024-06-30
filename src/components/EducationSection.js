import React from 'react';

const EducationSection = ({ education }) => {
  return (
    <div className="education-section">
      <h3>Education</h3>
      {education.map((item) => (
        <div key={item.id} className="education-item">
          <h4>{item.degree}</h4>
          <p>{item.institution}</p>
          <p>{item.graduationYear}</p>
        </div>
      ))}
    </div>
  );
};

export default EducationSection;
