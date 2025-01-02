// components/NotificationList.jsx
import "react";
import PropTypes from "prop-types"; // Import PropTypes
import NotificationItem from "./NotificationItem";

const NotificationList = ({ notifications }) => {
  return (
    <div className="space-y-4">
      {notifications.map((notification) => (
        <NotificationItem key={notification.id} notification={notification} />
      ))}
    </div>
  );
};

// PropTypes validation
NotificationList.propTypes = {
  notifications: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired, // id should be a number
      message: PropTypes.string.isRequired, // message should be a string
      timestamp: PropTypes.string.isRequired, // timestamp should be a string
    })
  ).isRequired, // notifications should be an array of notification objects
};

export default NotificationList;
