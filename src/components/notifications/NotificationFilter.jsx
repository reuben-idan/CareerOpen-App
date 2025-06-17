// components/NotificationFilter.jsx
import React from "react";
import {
  BellIcon,
  UserPlusIcon,
  ChatBubbleLeftIcon,
  HeartIcon,
  BriefcaseIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import PropTypes from "prop-types"; // Import PropTypes

const NotificationFilter = ({ activeFilter, onFilterChange }) => {
  const filters = [
    {
      id: "all",
      name: "All",
      icon: BellIcon,
    },
    {
      id: "connection_request",
      name: "Connection Requests",
      icon: UserPlusIcon,
    },
    {
      id: "message",
      name: "Messages",
      icon: ChatBubbleLeftIcon,
    },
    {
      id: "like",
      name: "Likes",
      icon: HeartIcon,
    },
    {
      id: "job",
      name: "Jobs",
      icon: BriefcaseIcon,
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-card p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white">
          Notifications
        </h2>
        <button
          onClick={() => onFilterChange("all")}
          className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
        >
          Mark all as read
        </button>
      </div>
      <div className="space-y-1">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => onFilterChange(filter.id)}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
              activeFilter === filter.id
                ? "bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400"
                : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            }`}
          >
            <div className="flex items-center space-x-3">
              <filter.icon className="h-5 w-5" />
              <span>{filter.name}</span>
            </div>
            {activeFilter === filter.id && (
              <CheckCircleIcon className="h-5 w-5 text-primary-600 dark:text-primary-400" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

// PropTypes validation
NotificationFilter.propTypes = {
  activeFilter: PropTypes.string.isRequired, // activeFilter should be a string
  onFilterChange: PropTypes.func.isRequired, // onFilterChange should be a function
};

export default NotificationFilter;
