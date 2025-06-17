// src/components/JobCard.js

import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  BuildingOfficeIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  ClockIcon,
  BriefcaseIcon,
  BookmarkIcon as BookmarkOutlineIcon,
} from "@heroicons/react/24/outline";
import { BookmarkIcon as BookmarkSolidIcon } from "@heroicons/react/24/solid";
import { useUser } from "../../context/auth";
import analytics from "../../services/analytics";

const JobCard = ({ job, onSave, onApply, isSaved }) => {
  const { user } = useUser();
  const [imageError, setImageError] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (user) {
      onSave(job.id);
      analytics.track("job_save", { jobId: job.id });
    }
  };

  const handleApply = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (user) {
      onApply(job.id);
      analytics.track("job_apply", { jobId: job.id });
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const formatSalary = (salary) => {
    if (!salary) return "Not specified";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(salary);
  };

  const getTimeAgo = (date) => {
    const now = new Date();
    const posted = new Date(date);
    const diffInDays = Math.floor((now - posted) / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return `${Math.floor(diffInDays / 30)} months ago`;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-card hover:shadow-card-hover transition-all duration-200 overflow-hidden">
      <Link to={`/jobs/${job.id}`} className="block p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                {!imageError && job.companyLogo ? (
                  <img
                    src={job.companyLogo}
                    alt={job.company}
                    className="h-12 w-12 rounded-lg object-cover"
                    onError={handleImageError}
                  />
                ) : (
                  <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <BuildingOfficeIcon className="h-6 w-6 text-white" />
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                  {job.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {job.company}
                </p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                <MapPinIcon className="h-5 w-5 mr-1.5 text-gray-400" />
                <span className="truncate">{job.location}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                <CurrencyDollarIcon className="h-5 w-5 mr-1.5 text-gray-400" />
                <span>{formatSalary(job.salary)}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                <BriefcaseIcon className="h-5 w-5 mr-1.5 text-gray-400" />
                <span>{job.type}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                <ClockIcon className="h-5 w-5 mr-1.5 text-gray-400" />
                <span>{getTimeAgo(job.postedAt)}</span>
              </div>
            </div>

            <div className="mt-4">
              <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                {job.description}
              </p>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {job.skills?.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-end space-y-2">
            <button
              onClick={handleSave}
              className="p-2 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
              aria-label={isSaved ? "Unsave job" : "Save job"}
            >
              {isSaved ? (
                <BookmarkSolidIcon className="h-5 w-5 text-primary-600 dark:text-primary-400" />
              ) : (
                <BookmarkOutlineIcon className="h-5 w-5" />
              )}
            </button>
            <button
              onClick={handleApply}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
            >
              Apply Now
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default JobCard;
