// components/NotificationItem.jsx
import "react";
import PropTypes from "prop-types"; // Import PropTypes

const NotificationItem = ({ notification }) => {
  return (
    <div className="flex items-center justify-between p-4 border-b hover:bg-gray-100 transition duration-200">
      <div className="flex items-center">
        <div className="bg-gray-300 rounded-full p-2">
          {/* Add an icon or user avatar here */}
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-800">
            {notification.message}
          </p>
          <span className="text-xs text-gray-500">
            {notification.timestamp}
          </span>
        </div>
      </div>
      <button className="text-blue-600 hover:underline">Mark as read</button>
    </div>
  );
};

// PropTypes validation
NotificationItem.propTypes = {
  notification: PropTypes.shape({
    message: PropTypes.string.isRequired, // message should be a string
    timestamp: PropTypes.string.isRequired, // timestamp should be a string
  }).isRequired, // notification should be an object and is required
};

export default NotificationItem;
