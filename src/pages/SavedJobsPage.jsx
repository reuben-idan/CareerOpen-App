import React, { useState, useEffect } from "react";
import { useUser } from "../context/auth";
import analytics from "../services/analytics";
import Sidebar from "../components/layout/Sidebar";
import JobCard from "../components/jobs/JobCard";
import LoadingSpinner from "../components/common/LoadingSpinner";
import {
  BookmarkIcon,
  TrashIcon,
  EyeIcon,
  ShareIcon,
} from "@heroicons/react/24/outline";

const SavedJobsPage = () => {
  const { user } = useUser();
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  const fetchSavedJobs = async () => {
    try {
      setLoading(true);
      // Mock saved jobs data
      const mockSavedJobs = [
        {
          id: 1,
          title: "Senior React Developer",
          company: "Tech Corp",
          location: "San Francisco, CA",
          type: "Full-time",
          salary: "$120,000 - $150,000",
          postedAt: "2024-01-15",
          description: "We're looking for a senior React developer to join our team...",
          skills: ["React", "TypeScript", "Node.js"],
          savedAt: "2024-01-16",
        },
        {
          id: 2,
          title: "Frontend Engineer",
          company: "Startup Inc",
          location: "Remote",
          type: "Full-time",
          salary: "$90,000 - $120,000",
          postedAt: "2024-01-14",
          description: "Join our fast-growing startup as a frontend engineer...",
          skills: ["JavaScript", "React", "CSS"],
          savedAt: "2024-01-15",
        },
        {
          id: 3,
          title: "Product Manager",
          company: "Enterprise Solutions",
          location: "New York, NY",
          type: "Full-time",
          salary: "$130,000 - $160,000",
          postedAt: "2024-01-13",
          description: "Lead product strategy and development...",
          skills: ["Product Management", "Agile", "User Research"],
          savedAt: "2024-01-14",
        },
      ];

      setSavedJobs(mockSavedJobs);
      analytics.track("view_saved_jobs", { count: mockSavedJobs.length });
    } catch (error) {
      console.error("Error fetching saved jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveJob = (jobId) => {
    setSavedJobs(prev => prev.filter(job => job.id !== jobId));
    analytics.track("remove_saved_job", { jobId });
  };

  const handleApplyJob = (jobId) => {
    analytics.track("apply_saved_job", { jobId });
    // TODO: Implement apply functionality
  };

  const filteredJobs = savedJobs.filter(job => {
    if (filter === "all") return true;
    if (filter === "recent") {
      const savedDate = new Date(job.savedAt);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return savedDate > weekAgo;
    }
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
        <Sidebar />
        <div className="flex-1 ml-0 md:ml-64 flex items-center justify-center">
          <LoadingSpinner />
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Saved Jobs
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  {savedJobs.length} job{savedJobs.length !== 1 ? 's' : ''} saved
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="all">All Jobs</option>
                  <option value="recent">Saved This Week</option>
                </select>
              </div>
            </div>
          </div>

          {/* Jobs List */}
          <div className="space-y-4">
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job) => (
                <div key={job.id} className="relative">
                  <JobCard
                    job={job}
                    onApply={handleApplyJob}
                    onSave={() => handleRemoveJob(job.id)}
                    isSaved={true}
                  />
                  <div className="absolute top-4 right-4 flex items-center space-x-2">
                    <button
                      onClick={() => handleRemoveJob(job.id)}
                      className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
                      title="Remove from saved"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                    <button
                      className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                      title="View job details"
                    >
                      <EyeIcon className="h-4 w-4" />
                    </button>
                    <button
                      className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                      title="Share job"
                    >
                      <ShareIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <BookmarkIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                  No saved jobs
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Start saving jobs to see them here.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SavedJobsPage; 