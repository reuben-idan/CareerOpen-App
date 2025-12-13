import React, { useState, useEffect } from "react";
import {
  ClipboardDocumentCheckIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  EnvelopeIcon,
  PhoneIcon,
  CalendarIcon,
  DocumentTextIcon,
  ArrowPathIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import { analytics } from "../../services/analytics";

const APPLICATION_STATUSES = {
  APPLIED: {
    label: "Applied",
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    icon: ClipboardDocumentCheckIcon,
  },
  INTERVIEWING: {
    label: "Interviewing",
    color:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    icon: ClockIcon,
  },
  OFFER: {
    label: "Offer",
    color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    icon: CheckCircleIcon,
  },
  REJECTED: {
    label: "Rejected",
    color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    icon: XCircleIcon,
  },
};

const JobApplicationTracker = ({
  applications = [],
  onUpdateStatus,
  onAddNote,
}) => {
  const [filteredApplications, setFilteredApplications] =
    useState(applications);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("date");
  const [expandedApplication, setExpandedApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const processApplications = () => {
      try {
        let filtered = [...applications];

        // Apply status filter
        if (statusFilter !== "ALL") {
          filtered = filtered.filter((app) => app.status === statusFilter);
        }

        // Apply sorting
        filtered.sort((a, b) => {
          if (sortBy === "date") {
            return new Date(b.appliedDate) - new Date(a.appliedDate);
          }
          if (sortBy === "company") {
            return a.company.localeCompare(b.company);
          }
          return 0;
        });

        setFilteredApplications(filtered);
        analytics.track("view_application_tracker", {
          totalApplications: applications.length,
          filteredCount: filtered.length,
        });
      } catch (err) {
        console.error("Error processing applications:", err);
        setError("Failed to process applications");
        analytics.track("error_processing_applications", {
          error: err.message,
        });
      } finally {
        setLoading(false);
      }
    };

    processApplications();
  }, [applications, statusFilter, sortBy]);

  const handleStatusUpdate = (applicationId, newStatus) => {
    onUpdateStatus(applicationId, newStatus);
    analytics.track("update_application_status", {
      applicationId,
      newStatus,
    });
  };

  const handleAddNote = (applicationId, note) => {
    onAddNote(applicationId, note);
    analytics.track("add_application_note", {
      applicationId,
    });
  };

  const getStatusStats = () => {
    return Object.keys(APPLICATION_STATUSES).reduce((stats, status) => {
      stats[status] = applications.filter(
        (app) => app.status === status
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

  const statusStats = getStatusStats();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-card">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">
            Application Tracker
          </h2>
          <div className="flex items-center space-x-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="block w-40 rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-sm focus:border-primary-500 focus:ring-primary-500"
            >
              <option value="ALL">All Statuses</option>
              {Object.entries(APPLICATION_STATUSES).map(([key, { label }]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="block w-40 rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-sm focus:border-primary-500 focus:ring-primary-500"
            >
              <option value="date">Sort by Date</option>
              <option value="company">Sort by Company</option>
            </select>
          </div>
        </div>

        {/* Status Overview */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {Object.entries(APPLICATION_STATUSES).map(
            ([key, { label, color, icon: Icon }]) => (
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
                    {statusStats[key]}
                  </span>
                </div>
              </div>
            )
          )}
        </div>

        {/* Applications List */}
        <div className="space-y-4">
          {filteredApplications.map((application) => (
            <div
              key={application.id}
              className="border border-gray-200 dark:border-gray-700 rounded-lg"
            >
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-base font-medium text-gray-900 dark:text-white">
                      {application.jobTitle}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {application.company}
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        APPLICATION_STATUSES[application.status].color
                      }`}
                    >
                      {APPLICATION_STATUSES[application.status].label}
                    </span>
                    <button
                      onClick={() =>
                        setExpandedApplication(
                          expandedApplication === application.id
                            ? null
                            : application.id
                        )
                      }
                      className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                    >
                      <ChevronDownIcon
                        className={`h-5 w-5 transform ${
                          expandedApplication === application.id
                            ? "rotate-180"
                            : ""
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {expandedApplication === application.id && (
                  <div className="mt-4 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center">
                        <CalendarIcon className="h-5 w-5 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          Applied:{" "}
                          {new Date(
                            application.appliedDate
                          ).toLocaleDateString()}
                        </span>
                      </div>
                      {application.interviewDate && (
                        <div className="flex items-center">
                          <ClockIcon className="h-5 w-5 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            Interview:{" "}
                            {new Date(
                              application.interviewDate
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-4">
                      {application.contactEmail && (
                        <a
                          href={`mailto:${application.contactEmail}`}
                          className="flex items-center text-sm text-primary-600 dark:text-primary-400 hover:text-primary-500"
                        >
                          <EnvelopeIcon className="h-4 w-4 mr-1" />
                          Email Contact
                        </a>
                      )}
                      {application.contactPhone && (
                        <a
                          href={`tel:${application.contactPhone}`}
                          className="flex items-center text-sm text-primary-600 dark:text-primary-400 hover:text-primary-500"
                        >
                          <PhoneIcon className="h-4 w-4 mr-1" />
                          Call Contact
                        </a>
                      )}
                      {application.resumeUrl && (
                        <a
                          href={application.resumeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-sm text-primary-600 dark:text-primary-400 hover:text-primary-500"
                        >
                          <DocumentTextIcon className="h-4 w-4 mr-1" />
                          View Resume
                        </a>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      {Object.entries(APPLICATION_STATUSES).map(
                        ([key, { label }]) => (
                          <button
                            key={key}
                            onClick={() =>
                              handleStatusUpdate(application.id, key)
                            }
                            className={`px-3 py-1 text-sm rounded-md ${
                              application.status === key
                                ? "bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-300"
                                : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                            }`}
                          >
                            {label}
                          </button>
                        )
                      )}
                    </div>

                    {application.notes && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                          Notes
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {application.notes}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}

          {filteredApplications.length === 0 && (
            <div className="text-center py-12">
              <ClipboardDocumentCheckIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                No applications found
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Get started by applying to jobs
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobApplicationTracker;
