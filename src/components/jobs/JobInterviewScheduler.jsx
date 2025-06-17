import React, { useState, useEffect } from "react";
import {
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  UserGroupIcon,
  VideoCameraIcon,
  PhoneIcon,
  BuildingOfficeIcon,
  DocumentTextIcon,
  BellIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import { analytics } from "../../services/analytics";

const INTERVIEW_TYPES = {
  PHONE: {
    label: "Phone",
    icon: PhoneIcon,
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  },
  VIDEO: {
    label: "Video",
    icon: VideoCameraIcon,
    color:
      "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  },
  ONSITE: {
    label: "On-site",
    icon: BuildingOfficeIcon,
    color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  },
};

const JobInterviewScheduler = ({
  interviews = [],
  onScheduleInterview,
  onUpdateInterview,
  onCancelInterview,
}) => {
  const [filteredInterviews, setFilteredInterviews] = useState(interviews);
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [dateFilter, setDateFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const processInterviews = () => {
      try {
        let filtered = [...interviews];

        // Apply type filter
        if (typeFilter !== "ALL") {
          filtered = filtered.filter(
            (interview) => interview.type === typeFilter
          );
        }

        // Apply date filter
        const now = new Date();
        if (dateFilter === "TODAY") {
          filtered = filtered.filter((interview) => {
            const interviewDate = new Date(interview.date);
            return (
              interviewDate.getDate() === now.getDate() &&
              interviewDate.getMonth() === now.getMonth() &&
              interviewDate.getFullYear() === now.getFullYear()
            );
          });
        } else if (dateFilter === "THIS_WEEK") {
          const startOfWeek = new Date(
            now.setDate(now.getDate() - now.getDay())
          );
          const endOfWeek = new Date(now.setDate(now.getDate() + 6));
          filtered = filtered.filter((interview) => {
            const interviewDate = new Date(interview.date);
            return interviewDate >= startOfWeek && interviewDate <= endOfWeek;
          });
        }

        // Sort by date
        filtered.sort((a, b) => new Date(a.date) - new Date(b.date));

        setFilteredInterviews(filtered);
        analytics.track("view_interview_scheduler", {
          totalInterviews: interviews.length,
          filteredCount: filtered.length,
        });
      } catch (err) {
        console.error("Error processing interviews:", err);
        setError("Failed to process interviews");
        analytics.track("error_processing_interviews", {
          error: err.message,
        });
      } finally {
        setLoading(false);
      }
    };

    processInterviews();
  }, [interviews, typeFilter, dateFilter]);

  const handleScheduleInterview = (interview) => {
    onScheduleInterview(interview);
    analytics.track("schedule_interview", {
      interviewId: interview.id,
      type: interview.type,
    });
  };

  const handleUpdateInterview = (interviewId, updates) => {
    onUpdateInterview(interviewId, updates);
    analytics.track("update_interview", {
      interviewId,
    });
  };

  const handleCancelInterview = (interviewId) => {
    onCancelInterview(interviewId);
    analytics.track("cancel_interview", {
      interviewId,
    });
  };

  const getInterviewStats = () => {
    return Object.keys(INTERVIEW_TYPES).reduce((stats, type) => {
      stats[type] = interviews.filter(
        (interview) => interview.type === type
      ).length;
      return stats;
    }, {});
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-card p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
          <div className="space-y-3">
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
          <p className="text-red-500 dark:text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  const interviewStats = getInterviewStats();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-card">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">
            Interview Scheduler
          </h2>
          <div className="flex items-center space-x-4">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="block w-40 rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-sm focus:border-primary-500 focus:ring-primary-500"
            >
              <option value="ALL">All Types</option>
              {Object.entries(INTERVIEW_TYPES).map(([key, { label }]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="block w-40 rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-sm focus:border-primary-500 focus:ring-primary-500"
            >
              <option value="ALL">All Dates</option>
              <option value="TODAY">Today</option>
              <option value="THIS_WEEK">This Week</option>
            </select>
          </div>
        </div>

        {/* Interview Type Overview */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {Object.entries(INTERVIEW_TYPES).map(
            ([key, { label, icon: Icon, color }]) => (
              <div
                key={key}
                className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Icon className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {label}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {interviewStats[key]}
                  </span>
                </div>
              </div>
            )
          )}
        </div>

        {/* Interviews List */}
        <div className="space-y-4">
          {filteredInterviews.map((interview) => (
            <div
              key={interview.id}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        INTERVIEW_TYPES[interview.type].color
                      }`}
                    >
                      {INTERVIEW_TYPES[interview.type].label}
                    </span>
                    <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                      {interview.company}
                    </span>
                  </div>
                  <h3 className="mt-2 text-base font-medium text-gray-900 dark:text-white">
                    {interview.position}
                  </h3>
                  <div className="mt-2 grid grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <CalendarIcon className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(interview.date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <ClockIcon className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {interview.time}
                      </span>
                    </div>
                    {interview.location && (
                      <div className="flex items-center">
                        <MapPinIcon className="h-5 w-5 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {interview.location}
                        </span>
                      </div>
                    )}
                    {interview.interviewers && (
                      <div className="flex items-center">
                        <UserGroupIcon className="h-5 w-5 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {interview.interviewers.join(", ")}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {interview.link && (
                    <a
                      href={interview.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-primary-700 dark:text-primary-400 bg-primary-100 dark:bg-primary-900 hover:bg-primary-200 dark:hover:bg-primary-800"
                    >
                      Join Meeting
                    </a>
                  )}
                  <button
                    onClick={() => handleCancelInterview(interview.id)}
                    className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-900 hover:bg-red-200 dark:hover:bg-red-800"
                  >
                    Cancel
                  </button>
                </div>
              </div>

              {interview.notes && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Notes
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {interview.notes}
                  </p>
                </div>
              )}

              {interview.prepMaterials && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Preparation Materials
                  </h4>
                  <div className="flex items-center space-x-4">
                    {interview.prepMaterials.map((material, index) => (
                      <a
                        key={index}
                        href={material.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-sm text-primary-600 dark:text-primary-400 hover:text-primary-500"
                      >
                        <DocumentTextIcon className="h-4 w-4 mr-1" />
                        {material.name}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}

          {filteredInterviews.length === 0 && (
            <div className="text-center py-12">
              <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                No interviews scheduled
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Get started by scheduling your interviews
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobInterviewScheduler;
