import React, { useState, useEffect } from "react";
import analytics from "../services/analytics";
import JobCard from "../components/jobs/JobCard";
import JobSearch from "../components/jobs/JobSearch";
import JobFilter from "../components/jobs/JobFilter";
import JobStats from "../components/jobs/JobStats";
import JobTrends from "../components/jobs/JobTrends";
import LoadingSpinner from "../components/common/LoadingSpinner";
import Sidebar from "../components/layout/Sidebar";
import { EmployerLogos, PeopleGrid, GlassCard } from "../components";
import { BriefcaseIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";

const Feed = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    location: "",
    type: "",
    experience: "",
    salary: "",
  });

  // Mock stats data
  const [stats, setStats] = useState({
    totalJobs: 0,
    activeApplications: 0,
    savedJobs: 0,
    views: 0,
    connections: 0,
  });

  useEffect(() => {
    fetchJobs();
    fetchStats();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      // Mock job data
      const mockJobs = [
        {
          id: 1,
          title: "Senior React Developer",
          company: "Tech Corp",
          location: "San Francisco, CA",
          type: "Full-time",
          salary: "$120,000 - $150,000",
          postedAt: "2024-01-15",
          description:
            "We're looking for a senior React developer to join our team...",
          requirements: {
            experience: "5+ years",
            education: "Bachelor's degree",
          },
          skills: ["React", "TypeScript", "Node.js"],
          benefits: {
            healthInsurance: true,
            remoteWork: true,
          },
        },
        {
          id: 2,
          title: "Frontend Engineer",
          company: "Startup Inc",
          location: "Remote",
          type: "Full-time",
          salary: "$90,000 - $120,000",
          postedAt: "2024-01-14",
          description:
            "Join our fast-growing startup as a frontend engineer...",
          requirements: {
            experience: "3+ years",
            education: "Bachelor's degree",
          },
          skills: ["JavaScript", "React", "CSS"],
          benefits: {
            healthInsurance: true,
            remoteWork: true,
          },
        },
      ];

      setJobs(mockJobs);
      analytics.track("view_job_feed", { jobCount: mockJobs.length });
    } catch (err) {
      setError("Failed to load jobs");
      analytics.track("job_feed_error", { error: err.message });
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      // Mock stats data
      const mockStats = {
        totalJobs: 1250,
        activeApplications: 8,
        savedJobs: 23,
        views: 156,
        connections: 342,
      };
      setStats(mockStats);
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    analytics.track("search_jobs", { query });
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    analytics.track("filter_jobs", { filters: newFilters });
  };

  const handleSaveJob = (jobId) => {
    analytics.track("save_job", { jobId });
    // TODO: Implement save job functionality
  };

  const handleApplyJob = (jobId) => {
    analytics.track("apply_job", { jobId });
    // TODO: Implement apply job functionality
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 px-4">
        <GlassCard className="max-w-md w-full text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Error Loading Jobs
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={fetchJobs} 
            className="px-6 py-3 rounded-xl font-medium bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
          >
            Try Again
          </button>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex">
      <Sidebar />
      <div className="flex-1 ml-0 md:ml-64">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-3 bg-blue-600 rounded-2xl">
                    <BriefcaseIcon className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                      Job Feed
                    </h1>
                    <p className="text-xl text-gray-600">
                      Discover your next career opportunity
                    </p>
                  </div>
                </div>
                
                {/* Search Bar */}
                <div className="relative max-w-2xl">
                  <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="Search for jobs, companies, or skills..."
                    className="w-full pl-12 pr-4 py-4 text-lg border-0 rounded-2xl shadow-lg bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>
              
              {/* People Grid */}
              <div className="hidden lg:block">
                <PeopleGrid maxImages={4} />
              </div>
            </div>
          </div>

          {/* Employer Logos */}
          <div className="mb-8">
            <p className="text-center text-gray-600 mb-4">Trusted by top companies worldwide</p>
            <EmployerLogos />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3 space-y-6">
              {/* Search and Filter */}
              <GlassCard>
                <JobSearch onSearch={handleSearch} />
                <JobFilter
                  filters={filters}
                  onFilterChange={handleFilterChange}
                />
              </GlassCard>

              {/* Job Stats */}
              <JobStats stats={stats} />

              {/* Job Listings */}
              <div className="space-y-4">
                {jobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    onSave={handleSaveJob}
                    onApply={handleApplyJob}
                  />
                ))}
              </div>

              {jobs.length === 0 && (
                <GlassCard className="text-center py-12">
                  <div className="max-w-md mx-auto">
                    <div className="text-6xl mb-4">🔍</div>
                    <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                      No jobs found
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Try adjusting your search criteria or filters.
                    </p>
                    <button
                      onClick={() => {
                        setSearchQuery("");
                        setFilters({
                          location: "",
                          type: "",
                          experience: "",
                          salary: "",
                        });
                      }}
                      className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors"
                    >
                      Clear Filters
                    </button>
                  </div>
                </GlassCard>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Job Trends */}
              <JobTrends jobs={jobs} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feed;
