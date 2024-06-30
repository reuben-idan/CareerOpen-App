import React from 'react';

const ExperienceSection = ({ experience }) => {
  return (
    <div className="experience-section">
      <h3>Experience</h3>
      {experience.map((item) => (
        <div key={item.id} className="experience-item">
          <h4>{item.role}</h4>
          <p>{item.company}</p>
          <p>{item.duration}</p>
          <p>{item.description}</p>
        </div>
      ))}
    </div>
  );
};

export default ExperienceSection;