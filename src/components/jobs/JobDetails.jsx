import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BriefcaseIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  ClockIcon,
  BookmarkIcon,
  ShareIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { BookmarkIcon as BookmarkSolidIcon } from "@heroicons/react/24/solid";
import { analytics } from "../../services/analytics";

const JobDetails = ({ job, onSave, isSaved, onApply }) => {
  const navigate = useNavigate();
  const [isApplying, setIsApplying] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const {
    id,
    title,
    company,
    location,
    type,
    salary,
    postedAt,
    description,
    requirements,
    responsibilities,
    benefits,
    skills,
    companyDescription,
    companyWebsite,
    companyLogo,
  } = job;

  const handleSave = () => {
    onSave(id);
    analytics.track("save_job", { jobId: id, jobTitle: title });
  };

  const handleApply = async () => {
    setIsApplying(true);
    try {
      await onApply(id);
      setShowSuccess(true);
      analytics.track("apply_job", { jobId: id, jobTitle: title });
      setTimeout(() => {
        navigate("/jobs");
      }, 2000);
    } catch (error) {
      console.error("Error applying for job:", error);
    } finally {
      setIsApplying(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${title} at ${company}`,
        text: `Check out this job opportunity: ${title} at ${company}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      // Show toast notification
    }
    analytics.track("share_job", { jobId: id, jobTitle: title });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-card">
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {title}
            </h1>
            <div className="flex items-center text-gray-600 dark:text-gray-400 mb-4">
              <BuildingOfficeIcon className="h-5 w-5 mr-2" />
              {company}
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleSave}
              className="p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            >
              {isSaved ? (
                <BookmarkSolidIcon className="h-6 w-6 text-primary-600" />
              ) : (
                <BookmarkIcon className="h-6 w-6" />
              )}
            </button>
            <button
              onClick={handleShare}
              className="p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            >
              <ShareIcon className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="flex items-center text-gray-600 dark:text-gray-400">
            <MapPinIcon className="h-5 w-5 mr-2" />
            {location}
          </div>
          <div className="flex items-center text-gray-600 dark:text-gray-400">
            <BriefcaseIcon className="h-5 w-5 mr-2" />
            {type}
          </div>
          <div className="flex items-center text-gray-600 dark:text-gray-400">
            <CurrencyDollarIcon className="h-5 w-5 mr-2" />
            {salary}
          </div>
          <div className="flex items-center text-gray-600 dark:text-gray-400">
            <ClockIcon className="h-5 w-5 mr-2" />
            Posted {new Date(postedAt).toLocaleDateString()}
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Job Description
          </h2>
          <p className="text-gray-600 dark:text-gray-400 whitespace-pre-line">
            {description}
          </p>
        </div>

        {responsibilities && responsibilities.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Responsibilities
            </h2>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-2">
              {responsibilities.map((resp, index) => (
                <li key={index}>{resp}</li>
              ))}
            </ul>
          </div>
        )}

        {requirements && requirements.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Requirements
            </h2>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-2">
              {requirements.map((req, index) => (
                <li key={index}>{req}</li>
              ))}
            </ul>
          </div>
        )}

        {benefits && benefits.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Benefits
            </h2>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-2">
              {benefits.map((benefit, index) => (
                <li key={index}>{benefit}</li>
              ))}
            </ul>
          </div>
        )}

        {skills && skills.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Required Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {companyDescription && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              About {company}
            </h2>
            <div className="flex items-start space-x-4">
              {companyLogo && (
                <img
                  src={companyLogo}
                  alt={`${company} logo`}
                  className="w-16 h-16 object-contain"
                />
              )}
              <div>
                <p className="text-gray-600 dark:text-gray-400">
                  {companyDescription}
                </p>
                {companyWebsite && (
                  <a
                    href={companyWebsite}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 dark:text-primary-400 hover:underline mt-2 inline-block"
                  >
                    Visit company website
                  </a>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 flex justify-end">
          <button
            onClick={handleApply}
            disabled={isApplying || showSuccess}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isApplying ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Applying...
              </>
            ) : showSuccess ? (
              <>
                <CheckCircleIcon className="h-5 w-5 mr-2" />
                Application Submitted
              </>
            ) : (
              "Apply Now"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
