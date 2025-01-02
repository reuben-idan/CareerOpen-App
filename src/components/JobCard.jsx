// src/components/JobCard.js

import "react";
import PropTypes from "prop-types"; // Import PropTypes for validation
import { FaBriefcase } from "react-icons/fa"; // Import FaBriefcase

const JobCard = ({ job }) => {
  return (
    <div className="bg-white p-4 shadow-lg rounded-lg mb-4">
      <div className="flex items-center mb-2">
        <FaBriefcase className="text-gray-600 mr-2" />{" "}
        {/* Using FaBriefcase icon */}
        <h3 className="text-xl font-semibold">{job.title}</h3>
      </div>
      <p className="text-gray-600">{job.company}</p>
      <p className="text-gray-500">{job.location}</p>
      <button className="bg-blue-600 text-white px-4 py-2 rounded mt-4">
        Apply Now
      </button>
    </div>
  );
};

// PropTypes validation for JobCard component
JobCard.propTypes = {
  job: PropTypes.shape({
    title: PropTypes.string.isRequired,
    company: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
  }).isRequired,
};

export default JobCard;
