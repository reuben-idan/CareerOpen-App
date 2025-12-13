import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import analytics from "../services/analytics";
import {
  BriefcaseIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  ClockIcon,
  CalendarIcon,
  UserGroupIcon,
  AcademicCapIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowLeftIcon,
  BookmarkIcon,
  ShareIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/outline";
import { BookmarkIcon as BookmarkSolidIcon } from "@heroicons/react/24/solid";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ErrorBoundary from "../components/common/ErrorBoundary";
import { useJobs } from "../contexts/JobsContext";
import JobApplicationModal from "../components/jobs/JobApplicationModal";
import Sidebar from "../components/layout/Sidebar";

const JobDetailsPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { getJobById, applyForJob, saveJob, unsaveJob } = useJobs();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const jobData = await getJobById(id);
        setJob(jobData);
        setIsSaved(jobData.isSaved);
        analytics.track("view_job", { jobId: id, jobTitle: jobData.title });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id, getJobById]);

  const handleApply = async (applicationData) => {
    try {
      await applyForJob(id, applicationData);
      analytics.track("apply_job", { jobId: id, jobTitle: job.title });
      navigate("/jobs/applications");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSaveJob = async () => {
    try {
      if (isSaved) {
        await unsaveJob(id);
        setIsSaved(false);
        analytics.track("unsave_job", { jobId: id, jobTitle: job.title });
      } else {
        await saveJob(id);
        setIsSaved(true);
        analytics.track("save_job", { jobId: id, jobTitle: job.title });
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: job.title,
        text: `Check out this job: ${job.title} at ${job.company}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      // TODO: Show toast notification
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Error Loading Job
          </h2>
          <p className="text-gray-600 dark:text-gray-400">{error}</p>
          <button
            onClick={() => navigate("/jobs")}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Jobs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Sidebar Navigation */}
      <Sidebar />
      {/* Main Content */}
      <div className="flex-1 ml-0 md:ml-64">
        <ErrorBoundary>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-6">
              <button
                onClick={() => navigate("/jobs")}
                className="inline-flex items-center text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                Back to Jobs
              </button>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-card overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      {job.title}
                    </h1>
                    <div className="flex items-center text-gray-600 dark:text-gray-400 mb-4">
                      <BuildingOfficeIcon className="h-5 w-5 mr-2" />
                      {job.company}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={handleSaveJob}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                    >
                      {isSaved ? (
                        <BookmarkSolidIcon className="h-5 w-5 text-primary-600" />
                      ) : (
                        <BookmarkIcon className="h-5 w-5" />
                      )}
                    </button>
                    <button
                      onClick={handleShare}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                    >
                      <ShareIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <MapPinIcon className="h-5 w-5 mr-2" />
                    {job.location}
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <BriefcaseIcon className="h-5 w-5 mr-2" />
                    {job.type}
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <CurrencyDollarIcon className="h-5 w-5 mr-2" />
                    {job.salary}
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <ClockIcon className="h-5 w-5 mr-2" />
                    Posted {new Date(job.postedAt).toLocaleDateString()}
                  </div>
                </div>

                <div className="prose dark:prose-invert max-w-none mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Job Description
                  </h2>
                  <div className="text-gray-600 dark:text-gray-400">
                    {job.description}
                  </div>
                </div>

                <div className="prose dark:prose-invert max-w-none mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Requirements
                  </h2>
                  <ul className="list-disc pl-5 text-gray-600 dark:text-gray-400">
                    {job.requirements.map((req, index) => (
                      <li key={index}>{req}</li>
                    ))}
                  </ul>
                </div>

                <div className="prose dark:prose-invert max-w-none mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Benefits
                  </h2>
                  <ul className="list-disc pl-5 text-gray-600 dark:text-gray-400">
                    {job.benefits.map((benefit, index) => (
                      <li key={index}>{benefit}</li>
                    ))}
                  </ul>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <UserGroupIcon className="h-5 w-5 mr-2" />
                      {job.applicants} applicants
                    </div>
                    <div className="flex space-x-4">
                      <button
                        onClick={() => navigate(`/messages/new?job=${id}`)}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                      >
                        <ChatBubbleLeftRightIcon className="h-5 w-5 mr-2" />
                        Contact Recruiter
                      </button>
                      <button
                        onClick={() => setShowApplicationModal(true)}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      >
                        Apply Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ErrorBoundary>

        <JobApplicationModal
          isOpen={showApplicationModal}
          onClose={() => setShowApplicationModal(false)}
          job={job}
          onSubmit={handleApply}
        />
      </div>
    </div>
  );
};

export default JobDetailsPage;
