// components/ConnectionCard.jsx
import React from "react";
import { Link } from "react-router-dom";
import {
  UserCircleIcon,
  ChatBubbleLeftRightIcon,
  EllipsisHorizontalIcon,
  MapPinIcon,
  BriefcaseIcon,
} from "@heroicons/react/24/outline";
import PropTypes from "prop-types";

const ConnectionCard = ({ connection, onMessage, onRemove }) => {
  const {
    id,
    name,
    title,
    company,
    location,
    avatar,
    mutualConnections = 0,
    skills = [],
  } = connection;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-card p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <Link to={`/profile/${id}`} className="flex-shrink-0">
            {avatar ? (
              <img
                src={avatar}
                alt={name}
                className="h-12 w-12 rounded-full object-cover"
              />
            ) : (
              <UserCircleIcon className="h-12 w-12 text-gray-400" />
            )}
          </Link>
          <div>
            <Link
              to={`/profile/${id}`}
              className="text-sm font-medium text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400"
            >
              {name}
            </Link>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {title} at {company}
            </p>
            {location && (
              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1">
                <MapPinIcon className="h-4 w-4 mr-1" />
                {location}
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onMessage(id)}
            className="text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
          >
            <ChatBubbleLeftRightIcon className="h-5 w-5" />
          </button>
          <button
            onClick={() => onRemove(id)}
            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
          >
            <EllipsisHorizontalIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      {mutualConnections > 0 && (
        <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
          {mutualConnections} mutual connection
          {mutualConnections !== 1 ? "s" : ""}
        </div>
      )}

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

      <div className="mt-4 flex items-center justify-between text-sm">
        <button
          onClick={() => onMessage(id)}
          className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 mr-2"
        >
          <ChatBubbleLeftRightIcon className="h-4 w-4 mr-2" />
          Message
        </button>
        <button
          onClick={() => onRemove(id)}
          className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Remove
        </button>
      </div>
    </div>
  );
};

ConnectionCard.propTypes = {
  connection: PropTypes.object.isRequired,
  onMessage: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
};

export default ConnectionCard;
