import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';

const SubmitReview = ({ onSubmitReview }) => {
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');

  const handleRatingChange = (value) => {
    setRating(value);
  };

  const handleReviewTextChange = (event) => {
    setReviewText(event.target.value);
  };

  const handleSubmit = () => {
    if (rating > 0 && reviewText.trim() !== '') {
      const newReview = {
        id: Date.now(),
        reviewer: 'John Doe',
        rating,
        date: new Date().toLocaleDateString(),
        content: reviewText
      };

      onSubmitReview(newReview);
      setRating(0);
      setReviewText('');
    }
  };

  return (
    <div className="submit-review-container">
      <h2>Submit a Review</h2>
      <div className="rating-input">
        <label htmlFor="rating">Rating:</label>
        <div className="stars">
          {[...Array(5)].map((_, index) => (
            <FaStar
              key={index}
              className={`star ${index < rating ? 'active' : ''}`}
              onClick={() => handleRatingChange(index + 1)}
            />
          ))}
        </div>
      </div>
      <div className="review-input">
        <label htmlFor="review">Review:</label>
        <textarea
          id="review"
          value={reviewText}
          onChange={handleReviewTextChange}
          placeholder="Write your review here..."
        ></textarea>
      </div>
      <button className="submit-button" onClick={handleSubmit}>
        Submit Review
      </button>
    </div>
  );
};

export default SubmitReview;