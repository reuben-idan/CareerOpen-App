// components/NotificationFilter.jsx
import  "react";
import PropTypes from "prop-types"; // Import PropTypes

const NotificationFilter = ({ selectedFilter, onFilterChange }) => {
  return (
    <div className="flex justify-between mb-6 px-4">
      <button
        onClick={() => onFilterChange("all")}
        className={`text-sm ${
          selectedFilter === "all" ? "text-blue-600" : "text-gray-600"
        } hover:underline`}
      >
        All Notifications
      </button>
      <button
        onClick={() => onFilterChange("job_updates")}
        className={`text-sm ${
          selectedFilter === "job_updates" ? "text-blue-600" : "text-gray-600"
        } hover:underline`}
      >
        Job Updates
      </button>
      <button
        onClick={() => onFilterChange("connection_requests")}
        className={`text-sm ${
          selectedFilter === "connection_requests"
            ? "text-blue-600"
            : "text-gray-600"
        } hover:underline`}
      >
        Connection Requests
      </button>
      <button
        onClick={() => onFilterChange("messages")}
        className={`text-sm ${
          selectedFilter === "messages" ? "text-blue-600" : "text-gray-600"
        } hover:underline`}
      >
        Messages
      </button>
    </div>
  );
};

// PropTypes validation
NotificationFilter.propTypes = {
  selectedFilter: PropTypes.string.isRequired, // selectedFilter should be a string
  onFilterChange: PropTypes.func.isRequired, // onFilterChange should be a function
};

export default NotificationFilter;
