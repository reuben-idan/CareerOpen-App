// components/SuggestedConnectionCard.jsx
import React from "react";
import { UserPlusIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import PropTypes from "prop-types";

const SuggestedConnectionCard = ({ connection, onConnect, onDismiss }) => {
  const {
    id,
    name,
    title,
    company,
    avatar,
    mutualConnections = 0,
    skills = [],
  } = connection;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-card p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            {avatar ? (
              <img
                src={avatar}
                alt={name}
                className="h-12 w-12 rounded-full object-cover"
              />
            ) : (
              <UserCircleIcon className="h-12 w-12 text-gray-400" />
            )}
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">
              {name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {title} at {company}
            </p>
            {mutualConnections > 0 && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {mutualConnections} mutual connection
                {mutualConnections !== 1 ? "s" : ""}
              </p>
            )}
          </div>
        </div>
        <button
          onClick={() => onDismiss(id)}
          className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>
      </div>

      {skills.length > 0 && (
        <div className="mt-3">
          <div className="flex flex-wrap gap-1">
            {skills.slice(0, 3).map((skill, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
              >
                {skill}
              </span>
            ))}
            {skills.length > 3 && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                +{skills.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}

      <div className="mt-4">
        <button
          onClick={() => onConnect(id)}
          className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <UserPlusIcon className="h-4 w-4 mr-2" />
          Connect
        </button>
      </div>
    </div>
  );
};

SuggestedConnectionCard.propTypes = {
  connection: PropTypes.object.isRequired,
  onConnect: PropTypes.func.isRequired,
  onDismiss: PropTypes.func.isRequired,
};

export default SuggestedConnectionCard;
