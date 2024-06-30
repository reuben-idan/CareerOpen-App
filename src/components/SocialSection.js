import React from 'react';

const SocialSection = ({ socialLinks }) => {
  return (
    <div className="social-section">
      <h3>Social</h3>
      <div className="social-links">
        {socialLinks.map((link) => (
          <a
            key={link.id}
            href={link.url}
            className={`social-link ${link.platform.toLowerCase()}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className={`fab fa-${link.platform.toLowerCase()}`}></i>
            <span>{link.platform}</span>
          </a>
        ))}
      </div>
    </div>
  );
};

export default SocialSection;