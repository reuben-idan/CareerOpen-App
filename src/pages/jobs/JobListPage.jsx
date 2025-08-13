import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useJobsStore } from '../../stores/jobsStore';
import JobCard from '../../components/jobs/JobCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import Pagination from '../../components/common/Pagination';
import { 
  FunnelIcon, 
  XMarkIcon, 
  MagnifyingGlassIcon,
  MapPinIcon,
  BriefcaseIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';

/**
 * JobListPage - Displays a list of jobs with search and filtering capabilities
 */
const JobListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  
  // Get jobs and actions from the store
  const { 
    jobs, 
    isLoading, 
    error, 
    fetchJobs, 
    currentPage, 
    totalPages, 
    totalCount 
  } = useJobsStore();
  
  // Initialize filters from URL or use defaults
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    location: searchParams.get('location') || '',
    job_type: searchParams.get('job_type') || '',
    company: searchParams.get('company') || '',
    min_salary: searchParams.get('min_salary') || '',
    is_remote: searchParams.get('is_remote') === 'true' || false,
    ordering: searchParams.get('ordering') || '-created_at',
    page: parseInt(searchParams.get('page') || '1'),
    page_size: 10,
  });
  
  // Fetch jobs when filters change
  useEffect(() => {
    const loadJobs = async () => {
      await fetchJobs(filters);
    };
    
    loadJobs();
    
    // Update URL with current filters
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== '' && value !== false) {
        params.append(key, value);
      }
    });
    setSearchParams(params);
    
  }, [filters, fetchJobs, setSearchParams]);
  
  // Handle search input changes
  const handleSearch = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value,
      page: 1 // Reset to first page on new search
    }));
  };
  
  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
      page: 1 // Reset to first page on filter change
    }));
  };
  
  // Handle pagination
  const handlePageChange = (newPage) => {
    setFilters(prev => ({
      ...prev,
      page: newPage
    }));
    window.scrollTo(0, 0);
  };
  
  // Clear all filters
  const clearFilters = () => {
    setFilters({
      search: '',
      location: '',
      job_type: '',
      company: '',
      min_salary: '',
      is_remote: false,
      ordering: '-created_at',
      page: 1,
      page_size: 10,
    });
  };
  
  // Job type options
  const jobTypes = [
    { value: '', label: 'All Types' },
    { value: 'full_time', label: 'Full-time' },
    { value: 'part_time', label: 'Part-time' },
    { value: 'contract', label: 'Contract' },
    { value: 'internship', label: 'Internship' },
    { value: 'temporary', label: 'Temporary' },
  ];
  
  // Sort options
  const sortOptions = [
    { value: '-created_at', label: 'Most Recent' },
    { value: 'created_at', label: 'Oldest' },
    { value: '-salary', label: 'Highest Salary' },
    { value: 'salary', label: 'Lowest Salary' },
  ];
  
  // Format salary for display
  const formatSalary = (amount) => {
    if (!amount) return 'Not specified';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };
  
  // Handle job save (to be implemented)
  const handleSaveJob = (jobId) => {
    console.log('Save job:', jobId);
    // TODO: Implement job save functionality
  };
  
  // Handle job apply (to be implemented)
  const handleApplyJob = (jobId) => {
    console.log('Apply to job:', jobId);
    // TODO: Implement job apply functionality
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {totalCount} {totalCount === 1 ? 'Job' : 'Jobs'} Available
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Find your dream job today
        </p>
      </div>
      
      {/* Search and Filter Bar */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              type="text"
              name="search"
              placeholder="Search by job title, company, or keywords"
              value={filters.search}
              onChange={handleSearch}
              className="pl-10 w-full"
            />
          </div>
          
          <div className="flex items-center">
            <Button 
              variant="outline" 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <FunnelIcon className="h-5 w-5" />
              {showFilters ? 'Hide Filters' : 'Filters'}
            </Button>
          </div>
        </div>
        
        {/* Advanced Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Location
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPinIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    type="text"
                    name="location"
                    placeholder="City, state, or remote"
                    value={filters.location}
                    onChange={handleFilterChange}
                    className="pl-10 w-full"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Job Type
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <BriefcaseIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <Select
                    name="job_type"
                    value={filters.job_type}
                    onChange={handleFilterChange}
                    className="pl-10 w-full"
                  >
                    {jobTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </Select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Min. Salary
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <CurrencyDollarIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    type="number"
                    name="min_salary"
                    placeholder="Min. salary"
                    value={filters.min_salary}
                    onChange={handleFilterChange}
                    min="0"
                    step="1000"
                    className="pl-10 w-full"
                  />
                </div>
              </div>
              
              <div className="flex items-end">
                <div className="flex items-center">
                  <Checkbox
                    id="is_remote"
                    name="is_remote"
                    checked={filters.is_remote}
                    onChange={handleFilterChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label 
                    htmlFor="is_remote" 
                    className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                  >
                    Remote Only
                  </label>
                </div>
                
                <Button 
                  variant="ghost" 
                  onClick={clearFilters}
                  className="ml-auto text-sm"
                >
                  Clear all
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Job List */}
        <div className="lg:w-2/3">
          {/* Sort and Results Count */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 sm:mb-0">
              Showing {jobs.length} of {totalCount} jobs
            </p>
            
            <div className="flex items-center">
              <label htmlFor="sort" className="mr-2 text-sm text-gray-600 dark:text-gray-400">
                Sort by:
              </label>
              <Select
                id="sort"
                name="ordering"
                value={filters.ordering}
                onChange={handleFilterChange}
                className="text-sm"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </div>
          </div>
          
          {/* Loading State */}
          {isLoading && (
            <div className="flex justify-center items-center py-12">
              <LoadingSpinner size="lg" />
              <span className="ml-2 text-gray-600 dark:text-gray-400">Loading jobs...</span>
            </div>
          )}
          
          {/* Error State */}
          {error && !isLoading && (
            <ErrorMessage 
              message={error} 
              onRetry={() => fetchJobs(filters)}
              className="my-8"
            />
          )}
          
          {/* No Results */}
          {!isLoading && !error && jobs.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No jobs found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Try adjusting your search or filter to find what you're looking for.
              </p>
              <Button 
                variant="outline" 
                onClick={clearFilters}
                className="mt-4"
              >
                Clear all filters
              </Button>
            </div>
          )}
          
          {/* Job List */}
          {!isLoading && !error && jobs.length > 0 && (
            <div className="space-y-4">
              {jobs.map((job) => (
                <JobCard 
                  key={job.id}
                  job={job}
                  onSave={handleSaveJob}
                  onApply={handleApplyJob}
                  isSaved={false} // TODO: Implement saved jobs functionality
                />
              ))}
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8 flex justify-center">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Sidebar */}
        <div className="lg:w-1/3">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 sticky top-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Job Alerts
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Get notified when new jobs match your search criteria.
            </p>
            <Button variant="primary" className="w-full">
              Create Job Alert
            </Button>
            
            <div className="mt-8">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Save Your Search
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Save this search to get notified when new jobs are posted.
              </p>
              <Button variant="outline" className="w-full">
                Save Search
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobListPage;
