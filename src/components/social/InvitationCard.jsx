// components/InvitationCard.jsx
import React from "react";
import { Link } from "react-router-dom";
import {
  UserCircleIcon,
  UserPlusIcon,
  XMarkIcon,
  MapPinIcon,
  BriefcaseIcon,
} from "@heroicons/react/24/outline";
import PropTypes from "prop-types";

const InvitationCard = ({ invitation, onAccept, onDecline }) => {
  const {
    id,
    sender,
    message,
    mutualConnections = 0,
    senderSkills = [],
  } = invitation;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-card p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <Link to={`/profile/${sender.id}`} className="flex-shrink-0">
            {sender.avatar ? (
              <img
                src={sender.avatar}
                alt={sender.name}
                className="h-12 w-12 rounded-full object-cover"
              />
            ) : (
              <UserCircleIcon className="h-12 w-12 text-gray-400" />
            )}
          </Link>
          <div>
            <Link
              to={`/profile/${sender.id}`}
              className="text-sm font-medium text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400"
            >
              {sender.name}
            </Link>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {sender.title} at {sender.company}
            </p>
            {sender.location && (
              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1">
                <MapPinIcon className="h-4 w-4 mr-1" />
                {sender.location}
              </div>
            )}
          </div>
        </div>
        <button
          onClick={() => onDecline(id)}
          className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>
      </div>

      {message && (
        <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
          {message}
        </p>
      )}

      {mutualConnections > 0 && (
        <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
          {mutualConnections} mutual connection
          {mutualConnections !== 1 ? "s" : ""}
        </div>
      )}

      {senderSkills.length > 0 && (
        <div className="mt-3">
          <div className="flex flex-wrap gap-1">
            {senderSkills.slice(0, 3).map((skill, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
              >
                {skill}
              </span>
            ))}
            {senderSkills.length > 3 && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                +{senderSkills.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}

      <div className="mt-4 flex items-center justify-between">
        <button
          onClick={() => onAccept(id)}
          className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 mr-2"
        >
          <UserPlusIcon className="h-4 w-4 mr-2" />
          Accept
        </button>
        <button
          onClick={() => onDecline(id)}
          className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Decline
        </button>
      </div>
    </div>
  );
};

InvitationCard.propTypes = {
  invitation: PropTypes.object.isRequired,
  onAccept: PropTypes.func.isRequired,
  onDecline: PropTypes.func.isRequired,
};

export default InvitationCard;
