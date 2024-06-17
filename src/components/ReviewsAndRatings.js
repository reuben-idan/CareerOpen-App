import React from 'react';
import { FaStar } from 'react-icons/fa';

const ReviewsAndRatings = ({ reviews }) => {
  return (
    <div>
      <h2>User Reviews and Ratings</h2>
      {reviews.map((review) => (
        <div key={review.id} className="review-card">
          <div className="review-header">
            <div className="reviewer-info">
              <h3>{review.reviewer}</h3>
              <div className="rating">
                {[...Array(review.rating)].map((_, index) => (
                  <FaStar key={index} className="star" />
                ))}
              </div>
            </div>
            <div className="review-date">{review.date}</div>
          </div>
          <p className="review-content">{review.content}</p>
        </div>
      ))}
    </div>
  );
};

export default ReviewsAndRatings;