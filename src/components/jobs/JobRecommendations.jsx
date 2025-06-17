import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  BriefcaseIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  ClockIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import { analytics } from "../../services/analytics";

const JobRecommendations = ({ userId }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      const response = await fetch(`/api/jobs/recommendations/${userId}`);
      const data = await response.json();
      setRecommendations(data);
      analytics.track("view_job_recommendations", { userId });
    } catch (err) {
      setError("Failed to load job recommendations");
      analytics.track("error", {
        action: "fetch_job_recommendations",
        error: err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, [userId]);

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-card p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-card p-6">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400">{error}</p>
          <button
            onClick={fetchRecommendations}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <ArrowPathIcon className="h-4 w-4 mr-2" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!recommendations.length) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-card p-6">
        <div className="text-center">
          <BriefcaseIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
            No recommendations yet
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            We'll show you personalized job recommendations based on your
            profile and preferences.
          </p>
          <div className="mt-6">
            <Link
              to="/jobs"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Browse All Jobs
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-card">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">
            Recommended for You
          </h2>
          <button
            onClick={fetchRecommendations}
            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
          >
            <ArrowPathIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          {recommendations.map((job) => (
            <Link
              key={job.id}
              to={`/jobs/${job.id}`}
              className="block p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-base font-medium text-gray-900 dark:text-white">
                    {job.title}
                  </h3>
                  <div className="mt-1 flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <BuildingOfficeIcon className="flex-shrink-0 mr-1.5 h-5 w-5" />
                    {job.company}
                  </div>
                </div>
                <div className="ml-4 flex-shrink-0">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200">
                    {job.matchScore}% Match
                  </span>
                </div>
              </div>

              <div className="mt-2 grid grid-cols-2 gap-4">
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <MapPinIcon className="flex-shrink-0 mr-1.5 h-5 w-5" />
                  {job.location}
                </div>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <BriefcaseIcon className="flex-shrink-0 mr-1.5 h-5 w-5" />
                  {job.type}
                </div>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <CurrencyDollarIcon className="flex-shrink-0 mr-1.5 h-5 w-5" />
                  {job.salary}
                </div>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <ClockIcon className="flex-shrink-0 mr-1.5 h-5 w-5" />
                  {new Date(job.postedAt).toLocaleDateString()}
                </div>
              </div>

              {job.skills && job.skills.length > 0 && (
                <div className="mt-3">
                  <div className="flex flex-wrap gap-2">
                    {job.skills.slice(0, 3).map((skill, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                      >
                        {skill}
                      </span>
                    ))}
                    {job.skills.length > 3 && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                        +{job.skills.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              )}
            </Link>
          ))}
        </div>

        <div className="mt-6 text-center">
          <Link
            to="/jobs"
            className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-500"
          >
            View all recommendations
            <span aria-hidden="true"> &rarr;</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default JobRecommendations;
