import React from "react";
import PropTypes from "prop-types";
import {
  BriefcaseIcon,
  CheckCircleIcon,
  ClockIcon,
  EyeIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { analytics } from "../../services/analytics";

const JobStats = ({ stats }) => {
  // Provide default values if stats is undefined or incomplete
  const {
    totalJobs = 0,
    activeApplications = 0,
    savedJobs = 0,
    views = 0,
    connections = 0,
  } = stats || {};

  const statItems = [
    {
      name: "Total Jobs",
      value: totalJobs,
      icon: BriefcaseIcon,
      color: "text-blue-500",
      bgColor: "bg-blue-100 dark:bg-blue-900",
    },
    {
      name: "Active Applications",
      value: activeApplications,
      icon: CheckCircleIcon,
      color: "text-green-500",
      bgColor: "bg-green-100 dark:bg-green-900",
    },
    {
      name: "Saved Jobs",
      value: savedJobs,
      icon: ClockIcon,
      color: "text-yellow-500",
      bgColor: "bg-yellow-100 dark:bg-yellow-900",
    },
    {
      name: "Profile Views",
      value: views,
      icon: EyeIcon,
      color: "text-purple-500",
      bgColor: "bg-purple-100 dark:bg-purple-900",
    },
    {
      name: "Connections",
      value: connections,
      icon: UserGroupIcon,
      color: "text-pink-500",
      bgColor: "bg-pink-100 dark:bg-pink-900",
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-card">
      <div className="p-6">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
          Your Job Stats
        </h2>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {statItems.map((item) => (
            <div
              key={item.name}
              className="relative overflow-hidden rounded-lg bg-white dark:bg-gray-800 px-4 py-5 shadow sm:px-6 sm:py-6"
            >
              <dt>
                <div className={`absolute rounded-md p-3 ${item.bgColor}`}>
                  <item.icon
                    className={`h-6 w-6 ${item.color}`}
                    aria-hidden="true"
                  />
                </div>
                <p className="ml-16 truncate text-sm font-medium text-gray-500 dark:text-gray-400">
                  {item.name}
                </p>
              </dt>
              <dd className="ml-16 flex items-baseline">
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {item.value}
                </p>
              </dd>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <div className="relative">
            <div
              className="absolute inset-0 flex items-center"
              aria-hidden="true"
            >
              <div className="w-full border-t border-gray-300 dark:border-gray-600" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white dark:bg-gray-800 px-3 text-sm text-gray-500 dark:text-gray-400">
                Last updated {new Date().toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

JobStats.propTypes = {
  stats: PropTypes.shape({
    totalJobs: PropTypes.number,
    activeApplications: PropTypes.number,
    savedJobs: PropTypes.number,
    views: PropTypes.number,
    connections: PropTypes.number,
  }),
};

export default JobStats;
