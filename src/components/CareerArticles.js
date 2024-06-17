import React from 'react';

const CareerArticles = () => {
  const articles = [
    {
      id: 1,
      title: 'Top 10 Resume Tips to Land Your Dream Job',
      content: 'Crafting the perfect resume can be the key to securing your dream job. In this article, we provide 10 actionable tips to help you create a standout resume...'
    },
    {
      id: 2,
      title: 'Mastering the Art of the Interview: Essential Strategies',
      content: 'Interviews can be nerve-wracking, but with the right preparation and mindset, you can ace them. This article covers essential strategies to help you master the interview process...'
    },
    {
      id: 3,
      title: 'Career Pivoting: How to Successfully Change Paths',
      content: 'Feeling stuck in your current career? Considering a change? This guide explores practical steps to help you successfully pivot to a new career path...'
    },
    {
      id: 4,
      title: 'Networking for Career Growth: Tips and Tactics',
      content: 'Networking is a powerful tool for career development. Learn effective tactics to build valuable connections and leverage your network to advance your career...'
    }
  ];

  return (
    <div>
      <h2>Career Articles and Tips</h2>
      {articles.map((article) => (
        <div key={article.id}>
          <h3>{article.title}</h3>
          <p>{article.content}</p>
        </div>
      ))}
    </div>
  );
};

export default CareerArticles;