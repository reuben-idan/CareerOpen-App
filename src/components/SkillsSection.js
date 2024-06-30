import React from 'react';

const SkillsSection = ({ skills }) => {
  return (
    <div className="skills-section">
      <h3>Skills</h3>
      <div className="skills-container">
        {skills.map((skill) => (
          <div key={skill.id} className="skill-item">
            <span>{skill.name}</span>
            <span className="skill-level">{skill.level}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillsSection;