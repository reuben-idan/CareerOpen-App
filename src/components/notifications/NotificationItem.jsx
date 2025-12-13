// components/NotificationItem.jsx
import React from "react";
import { Link } from "react-router-dom";
import {
  UserCircleIcon,
  UserPlusIcon,
  ChatBubbleLeftIcon,
  HeartIcon,
  BriefcaseIcon,
  BellIcon,
} from "@heroicons/react/24/outline";
import PropTypes from "prop-types"; // Import PropTypes

const NotificationItem = ({ notification, onMarkAsRead }) => {
  const getIcon = () => {
    switch (notification.type) {
      case "connection_request":
        return <UserPlusIcon className="h-6 w-6 text-blue-500" />;
      case "message":
        return <ChatBubbleLeftIcon className="h-6 w-6 text-green-500" />;
      case "like":
        return <HeartIcon className="h-6 w-6 text-red-500" />;
      case "job":
        return <BriefcaseIcon className="h-6 w-6 text-yellow-500" />;
      default:
        return <BellIcon className="h-6 w-6 text-gray-500" />;
    }
  };

  const getMessage = () => {
    switch (notification.type) {
      case "connection_request":
        return `${notification.sender.name} sent you a connection request`;
      case "message":
        return `${notification.sender.name} sent you a message`;
      case "like":
        return `${notification.sender.name} liked your post`;
      case "job":
        return `New job matching your profile: ${notification.job.title}`;
      default:
        return notification.message;
    }
  };

  const getLink = () => {
    switch (notification.type) {
      case "connection_request":
        return `/profile/${notification.sender.id}`;
      case "message":
        return `/messages/${notification.sender.id}`;
      case "like":
        return `/posts/${notification.postId}`;
      case "job":
        return `/jobs/${notification.job.id}`;
      default:
        return "#";
    }
  };

  return (
    <Link
      to={getLink()}
      onClick={() => onMarkAsRead(notification.id)}
      className={`block p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 ${
        !notification.read ? "bg-blue-50 dark:bg-blue-900/20" : ""
      }`}
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          {notification.sender?.avatar ? (
            <img
              src={notification.sender.avatar}
              alt={notification.sender.name}
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : (
            <UserCircleIcon className="h-10 w-10 text-gray-400" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {getIcon()}
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {getMessage()}
              </p>
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {notification.time}
            </span>
          </div>
          {notification.preview && (
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
              {notification.preview}
            </p>
          )}
        </div>
      </div>
    </Link>
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
