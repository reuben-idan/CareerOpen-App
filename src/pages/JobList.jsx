import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import JobCard from "../components/jobs/JobCard";
import Sidebar from "../components/layout/Sidebar";
import { EmployerLogos, PeopleGrid, GlassCard } from "../components";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Fetch job listings from the API
    axios
      .get("/api/jobs")
      .then((response) => {
        if (Array.isArray(response.data)) {
          setJobs(response.data);
        } else {
          console.error("Expected an array of jobs, but got:", response.data);
          setJobs([]);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching jobs", error);
        setLoading(false);
      });
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredJobs = jobs.filter((job) =>
    job.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex">
      <Sidebar />
      <div className="flex-1 ml-0 md:ml-64">
        <div className="container mx-auto px-4 py-8">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="flex-1">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                  Find Your Dream Job
                </h1>
                <p className="text-xl text-gray-600 mb-6">
                  Discover opportunities from top companies and connect with
                  amazing teams
                </p>

                {/* Search Bar */}
                <div className="relative max-w-2xl">
                  <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
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
            <p className="text-center text-gray-600 mb-4">
              Trusted by top companies worldwide
            </p>
            <EmployerLogos />
          </div>

          {/* Jobs Section */}
          <div className="space-y-6">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
            ) : filteredJobs.length > 0 ? (
              <div className="grid gap-6">
                {filteredJobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            ) : (
              <GlassCard className="text-center py-12">
                <div className="max-w-md mx-auto">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                    No jobs found
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Try adjusting your search terms or browse all available
                    positions
                  </p>
                  <button
                    onClick={() => setSearchQuery("")}
                    className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors"
                  >
                    View All Jobs
                  </button>
                </div>
              </GlassCard>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobList;
