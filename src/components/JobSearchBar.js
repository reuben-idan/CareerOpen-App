import React, { useState } from 'react';
import axios from 'axios';

const JobSearchBar = () => {
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('');
  const [experience, setExperience] = useState('');
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.get('/api/jobs', {
        params: {
          keyword,
          location,
          category,
          experience,
        },
      });
      // Update the job listings component with the search results
    } catch (err) {
      setError(err.response.data.message);
    }
  };

  return (
    <form onSubmit={handleSearch}>
      <div>
        <label htmlFor="keyword">Keyword:</label>
        <input
          type="text"
          id="keyword"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="location">Location:</label>
        <input
          type="text"
          id="location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="category">Category:</label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All</option>
          <option value="software">Software</option>
          <option value="marketing">Marketing</option>
          <option value="finance">Finance</option>
          {/* Add more options as needed */}
        </select>
      </div>
      <div>
        <label htmlFor="experience">Experience:</label>
        <select
          id="experience"
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
        >
          <option value="">All</option>
          <option value="entry">Entry-level</option>
          <option value="mid">Mid-level</option>
          <option value="senior">Senior-level</option>
        </select>
      </div>
      {error && <div className="error">{error}</div>}
      <button type="submit">Search</button>
    </form>
  );
};

export default JobSearchBar;