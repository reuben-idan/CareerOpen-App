import React from 'react';

const ActionSection = ({ actions }) => {
  return (
    <div className="action-section">
      <h3>Actions</h3>
      <div className="action-buttons">
        {actions.map((action) => (
          <a
            key={action.id}
            href={action.url}
            className={`action-button ${action.type.toLowerCase()}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className={`fas fa-${action.type.toLowerCase()}`}></i>
            <span>{action.label}</span>
          </a>
        ))}
      </div>
    </div>
  );
};

export default ActionSection;