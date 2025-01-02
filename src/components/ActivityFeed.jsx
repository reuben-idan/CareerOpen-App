import  "react";
import PropTypes from "prop-types";

const ActivityFeed = ({ activities }) => {
  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="border-b pb-4">
          <p className="text-sm text-gray-600">{activity.timestamp}</p>
          <p className="text-gray-800">{activity.description}</p>
        </div>
      ))}
    </div>
  );
};

// PropTypes validation
ActivityFeed.propTypes = {
  activities: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired, // Validate `id` as string or number
      timestamp: PropTypes.string.isRequired, // Validate `timestamp` as a required string
      description: PropTypes.string.isRequired, // Validate `description` as a required string
    })
  ).isRequired,
};

export default ActivityFeed;
