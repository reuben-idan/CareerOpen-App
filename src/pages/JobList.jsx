import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { jobService } from "../services";
import JobCard from "../components/jobs/JobCard";
import JobSearch from "../components/jobs/JobSearch";
import Sidebar from "../components/layout/Sidebar";
import { EmployerLogos, GlassCard, LoadingSpinner } from "../components";
import { FunnelIcon, XMarkIcon } from "@heroicons/react/24/outline";

const JobList = () => {
  const [jobs, setJobs] = useState({ results: [], count: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  
  // Search and filter states
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    location: searchParams.get('location') || '',
    job_type: searchParams.get('job_type') || '',
    company: searchParams.get('company') || '',
    min_salary: searchParams.get('min_salary') || '',
    max_salary: searchParams.get('max_salary') || '',
    is_remote: searchParams.get('is_remote') === 'true' || false,
    skills: searchParams.get('skills') || '',
    ordering: searchParams.get('ordering') || '-created_at',
    page: parseInt(searchParams.get('page') || '1'),
    page_size: 10,
  });

  // Fetch jobs when filters change
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Convert filters to query params
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== '' && value !== false) {
            params.append(key, value);
          }
        });
        
        // Update URL with current filters
        setSearchParams(params);
        
        // Fetch jobs using the jobService
        const response = await jobService.searchJobs(params.toString());
        setJobs(response.data);
      } catch (err) {
        console.error("Error fetching jobs", err);
        setError("Failed to load jobs. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [filters, setSearchParams]);

  const handleSearch = (searchTerm) => {
    setFilters(prev => ({
      ...prev,
      search: searchTerm,
      page: 1 // Reset to first page on new search
    }));
  };

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
      page: 1 // Reset to first page on filter change
    }));
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({
      ...prev,
      page: newPage
    }));
    window.scrollTo(0, 0);
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      location: '',
      job_type: '',
      company: '',
      min_salary: '',
      max_salary: '',
      is_remote: false,
      skills: '',
      ordering: '-created_at',
      page: 1,
      page_size: 10,
    });
  };

  const hasActiveFilters = Object.entries(filters).some(
    ([key, value]) => 
      value && 
      !['page', 'page_size', 'ordering'].includes(key) && 
      value !== (key === 'is_remote' ? false : '')
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
                <p className="text-lg text-gray-600">
                  Browse through {jobs.count || 0} job listings and find the perfect match for your skills
                </p>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-card p-6">
              {/* Search Bar */}
              <div className="mb-6">
                <JobSearch 
                  initialQuery={filters.search}
                  onSearch={handleSearch}
                />
              </div>

              {/* Filter Toggle */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-medium text-gray-700 dark:text-gray-300">
                  Filters
                </h2>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  <FunnelIcon className="h-5 w-5" />
                  {showFilters ? 'Hide Filters' : 'Show Filters'}
                </button>
              </div>

              {/* Filters Panel */}
              {showFilters && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                  {/* Job Type Filter */}
                  <div>
                    <label htmlFor="job_type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Job Type
                    </label>
                    <select
                      id="job_type"
                      name="job_type"
                      value={filters.job_type}
                      onChange={handleFilterChange}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    >
                      <option value="">All Types</option>
                      <option value="full_time">Full Time</option>
                      <option value="part_time">Part Time</option>
                      <option value="contract">Contract</option>
                      <option value="internship">Internship</option>
                      <option value="temporary">Temporary</option>
                    </select>
                  </div>

                  {/* Location Filter */}
                  <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={filters.location}
                      onChange={handleFilterChange}
                      placeholder="City, State, or Remote"
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>

                  {/* Salary Range */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Salary Range
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        id="min_salary"
                        name="min_salary"
                        value={filters.min_salary}
                        onChange={handleFilterChange}
                        placeholder="Min"
                        className="w-1/2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                      <input
                        type="number"
                        id="max_salary"
                        name="max_salary"
                        value={filters.max_salary}
                        onChange={handleFilterChange}
                        placeholder="Max"
                        className="w-1/2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </div>
                  </div>

                  {/* Remote Work Toggle */}
                  <div className="flex items-end">
                    <div className="flex items-center">
                      <input
                        id="is_remote"
                        name="is_remote"
                        type="checkbox"
                        checked={filters.is_remote}
                        onChange={handleFilterChange}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                      />
                      <label htmlFor="is_remote" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                        Remote Only
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Active Filters */}
              {hasActiveFilters && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {Object.entries(filters).map(([key, value]) => {
                    if (!value || key === 'page' || key === 'page_size' || key === 'ordering') return null;
                    if (key === 'is_remote' && !value) return null;
                    
                    let displayValue = value;
                    if (key === 'is_remote') displayValue = 'Remote';
                    if (key === 'job_type') {
                      displayValue = value.split('_').map(word => 
                        word.charAt(0).toUpperCase() + word.slice(1)
                      ).join(' ');
                    }
                    
                    return (
                      <span 
                        key={key}
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
                      >
                        {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}: {displayValue}
                        <button 
                          onClick={() => {
                            setFilters(prev => ({
                              ...prev,
                              [key]: key === 'is_remote' ? false : '',
                              page: 1
                            }));
                          }}
                          className="ml-2 text-blue-500 hover:text-blue-700"
                        >
                          <XMarkIcon className="h-3 w-3" />
                        </button>
                      </span>
                    );
                  })}
                  <button
                    onClick={clearFilters}
                    className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Job Listings */}
          <div className="mb-8">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <LoadingSpinner size="lg" />
              </div>
            ) : error ? (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-center">
                <p className="text-red-700 dark:text-red-300">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  Retry
                </button>
              </div>
            ) : jobs.results && jobs.results.length > 0 ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Showing <span className="font-medium">{(filters.page - 1) * filters.page_size + 1}</span> to{' '}
                    <span className="font-medium">
                      {Math.min(filters.page * filters.page_size, jobs.count)}
                    </span>{' '}
                    of <span className="font-medium">{jobs.count}</span> jobs
                  </p>
                  <div className="flex items-center">
                    <label htmlFor="sort" className="mr-2 text-sm text-gray-600 dark:text-gray-400">
                      Sort by:
                    </label>
                    <select
                      id="sort"
                      name="ordering"
                      value={filters.ordering}
                      onChange={handleFilterChange}
                      className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
                    >
                      <option value="-created_at">Newest</option>
                      <option value="created_at">Oldest</option>
                      <option value="-salary_max">Salary: High to Low</option>
                      <option value="salary_min">Salary: Low to High</option>
                      <option value="title">Title: A-Z</option>
                      <option value="-title">Title: Z-A</option>
                    </select>
                  </div>
                </div>

                {/* Job Cards */}
                <div className="space-y-4">
                  {jobs.results.map((job) => (
                    <JobCard 
                      key={job.id}
                      job={job}
                      onSave={null} // TODO: Implement save functionality
                      isSaved={false} // TODO: Implement saved jobs check
                    />
                  ))}
                </div>

                {/* Pagination */}
                {jobs.count > filters.page_size && (
                  <div className="flex justify-center mt-8">
                    <nav className="flex items-center gap-2" aria-label="Pagination">
                      <button
                        onClick={() => handlePageChange(Math.max(1, filters.page - 1))}
                        disabled={filters.page === 1}
                        className={`px-3 py-1 rounded-md ${filters.page === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-50 dark:hover:bg-gray-700'}`}
                      >
                        Previous
                      </button>
                      
                      {Array.from({ length: Math.ceil(jobs.count / filters.page_size) }, (_, i) => i + 1)
                        .filter(page => 
                          page === 1 || 
                          page === filters.page || 
                          page === filters.page - 1 || 
                          page === filters.page + 1 ||
                          page === Math.ceil(jobs.count / filters.page_size)
                        )
                        .map((page, index, array) => {
                          // Add ellipsis if there's a gap
                          if (index > 0 && array[index - 1] !== page - 1) {
                            return (
                              <span key={`ellipsis-${page}`} className="px-3 py-1">
                                ...
                              </span>
                            );
                          }
                          return (
                            <button
                              key={page}
                              onClick={() => handlePageChange(page)}
                              className={`px-3 py-1 rounded-md ${
                                filters.page === page
                                  ? 'bg-blue-600 text-white'
                                  : 'text-blue-600 hover:bg-blue-50 dark:hover:bg-gray-700'
                              }`}
                            >
                              {page}
                            </button>
                          );
                        })}
                      
                      <button
                        onClick={() => handlePageChange(Math.min(Math.ceil(jobs.count / filters.page_size), filters.page + 1))}
                        disabled={filters.page >= Math.ceil(jobs.count / filters.page_size)}
                        className={`px-3 py-1 rounded-md ${filters.page >= Math.ceil(jobs.count / filters.page_size) ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-50 dark:hover:bg-gray-700'}`}
                      >
                        Next
                      </button>
                    </nav>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No jobs found</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  {hasActiveFilters 
                    ? 'Try adjusting your search or filter criteria.'
                    : 'There are currently no job listings available. Please check back later.'}
                </p>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Featured Companies */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Featured Companies</h2>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-card p-6">
              <EmployerLogos />
            </div>
          </div>

          {/* Testimonials */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">What Our Users Say</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <GlassCard className="p-6">
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl">
                    JD
                  </div>
                  <div className="ml-4">
                    <h4 className="font-medium text-gray-900 dark:text-white">John Doe</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Senior Developer</p>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  "Found my dream job within a week of using CareerOpen. The application process was seamless!"
                </p>
              </GlassCard>
              <GlassCard className="p-6">
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold text-xl">
                    AS
                  </div>
                  <div className="ml-4">
                    <h4 className="font-medium text-gray-900 dark:text-white">Alex Smith</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Product Manager</p>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  "The job matching algorithm is spot on. I received offers that perfectly matched my skills and experience."
                </p>
              </GlassCard>
              <GlassCard className="p-6">
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-xl">
                    MJ
                  </div>
                  <div className="ml-4">
                    <h4 className="font-medium text-gray-900 dark:text-white">Maria Johnson</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">UX Designer</p>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  "The application tracking system is a game-changer. I could easily keep track of all my applications in one place."
                </p>
              </GlassCard>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-8 md:p-12 text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to find your next opportunity?</h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Join thousands of professionals who found their dream jobs through CareerOpen
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-6 py-3 bg-white text-blue-700 font-medium rounded-lg hover:bg-blue-50 transition-colors">
                Browse Jobs
              </button>
              <button className="px-6 py-3 border-2 border-white text-white font-medium rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors">
                Create Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobList;
