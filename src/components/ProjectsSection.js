import React from 'react';

const ProjectsSection = ({ projects }) => {
  return (
    <div className="projects-section">
      <h3>Projects</h3>
      {projects.map((item) => (
        <div key={item.id} className="project-item">
          <h4>{item.name}</h4>
          <p>{item.description}</p>
          <p>
            <strong>Technologies:</strong> {item.technologies.join(', ')}
          </p>
        </div>
      ))}
    </div>
  );
};

export default ProjectsSection;