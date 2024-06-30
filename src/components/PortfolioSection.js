import React from 'react';

const PortfolioSection = ({ portfolio }) => {
  return (
    <div className="portfolio-section">
      <h3>Portfolio</h3>
      {portfolio.length > 0 ? (
        <div className="portfolio-items">
          {portfolio.map((item) => (
            <a
              key={item.id}
              href={item.url}
              className="portfolio-item"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={item.thumbnail} alt={item.name} />
              <h4>{item.name}</h4>
            </a>
          ))}
        </div>
      ) : (
        <p>No portfolio items available</p>
      )}
    </div>
  );
};

export default PortfolioSection;