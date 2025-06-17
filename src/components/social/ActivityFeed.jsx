import React from "react";
import PropTypes from "prop-types";
import {
  UserPlusIcon,
  ChatBubbleLeftRightIcon,
  HeartIcon,
  BriefcaseIcon,
  CheckCircleIcon,
  ClockIcon,
  TrophyIcon,
  DocumentTextIcon,
  LinkIcon,
  StarIcon,
} from "@heroicons/react/24/outline";

const ActivityFeed = ({ activities }) => {
  const getActivityIcon = (type) => {
    switch (type) {
      case "connection":
        return <UserPlusIcon className="h-5 w-5 text-blue-500" />;
      case "message":
        return <ChatBubbleLeftRightIcon className="h-5 w-5 text-green-500" />;
      case "like":
        return <HeartIcon className="h-5 w-5 text-red-500" />;
      case "job":
        return <BriefcaseIcon className="h-5 w-5 text-purple-500" />;
      case "achievement":
        return <TrophyIcon className="h-5 w-5 text-yellow-500" />;
      case "post":
        return <DocumentTextIcon className="h-5 w-5 text-indigo-500" />;
      case "endorsement":
        return <StarIcon className="h-5 w-5 text-orange-500" />;
      default:
        return <CheckCircleIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case "connection":
        return "bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800";
      case "message":
        return "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800";
      case "like":
        return "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800";
      case "job":
        return "bg-purple-50 border-purple-200 dark:bg-purple-900/20 dark:border-purple-800";
      case "achievement":
        return "bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800";
      case "post":
        return "bg-indigo-50 border-indigo-200 dark:bg-indigo-900/20 dark:border-indigo-800";
      case "endorsement":
        return "bg-orange-50 border-orange-200 dark:bg-orange-900/20 dark:border-orange-800";
      default:
        return "bg-gray-50 border-gray-200 dark:bg-gray-900/20 dark:border-gray-800";
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) {
      return "Just now";
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
    } else if (diffInSeconds < 2592000) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} ${days === 1 ? "day" : "days"} ago`;
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }
  };

  const getActivityTitle = (type) => {
    switch (type) {
      case "connection":
        return "New Connection";
      case "message":
        return "New Message";
      case "like":
        return "Post Liked";
      case "job":
        return "Job Update";
      case "achievement":
        return "Achievement Unlocked";
      case "post":
        return "New Post";
      case "endorsement":
        return "Skill Endorsed";
      default:
        return "Activity";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Recent Activity
        </h3>
        <button className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
          View All
        </button>
      </div>

      <div className="space-y-3">
        {activities.map((activity, index) => (
          <div
            key={activity.id || index}
            className={`p-4 rounded-lg border ${getActivityColor(
              activity.type
            )} hover:shadow-sm transition-shadow`}
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 mt-1">
                {getActivityIcon(activity.type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                    {getActivityTitle(activity.type)}
                  </h4>
                  <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                    <ClockIcon className="h-3 w-3" />
                    <span>{formatTimestamp(activity.timestamp)}</span>
                  </div>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {activity.message}
                </p>

                {/* Activity Details */}
                {activity.details && (
                  <div className="mt-2 p-2 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {activity.details}
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                {activity.actions && (
                  <div className="mt-3 flex space-x-2">
                    {activity.actions.map((action, idx) => (
                      <button
                        key={idx}
                        onClick={action.onClick}
                        className={`text-xs px-2 py-1 rounded transition-colors ${
                          action.primary
                            ? "bg-blue-600 text-white hover:bg-blue-700"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                        }`}
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {activities.length === 0 && (
        <div className="text-center py-8">
          <div className="text-gray-400 dark:text-gray-500 mb-2">
            <ClockIcon className="h-12 w-12 mx-auto" />
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            No recent activity to show
          </p>
        </div>
      )}

      {/* Activity Stats */}
      <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
          Activity Summary
        </h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-gray-600 dark:text-gray-400">This Week</div>
            <div className="font-medium text-gray-900 dark:text-white">
              {
                activities.filter((a) => {
                  const activityDate = new Date(a.timestamp);
                  const weekAgo = new Date();
                  weekAgo.setDate(weekAgo.getDate() - 7);
                  return activityDate > weekAgo;
                }).length
              }{" "}
              activities
            </div>
          </div>
          <div>
            <div className="text-gray-600 dark:text-gray-400">This Month</div>
            <div className="font-medium text-gray-900 dark:text-white">
              {
                activities.filter((a) => {
                  const activityDate = new Date(a.timestamp);
                  const monthAgo = new Date();
                  monthAgo.setMonth(monthAgo.getMonth() - 1);
                  return activityDate > monthAgo;
                }).length
              }{" "}
              activities
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

ActivityFeed.propTypes = {
  activities: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      type: PropTypes.string.isRequired,
      message: PropTypes.string.isRequired,
      timestamp: PropTypes.string.isRequired,
      details: PropTypes.string,
      actions: PropTypes.arrayOf(
        PropTypes.shape({
          label: PropTypes.string.isRequired,
          onClick: PropTypes.func.isRequired,
          primary: PropTypes.bool,
        })
      ),
    })
  ).isRequired,
};

export default ActivityFeed;
