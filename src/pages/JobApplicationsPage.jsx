import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../context/auth';
import jobService from '../services/jobService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { 
  BriefcaseIcon, 
  CalendarIcon, 
  CheckCircleIcon, 
  ClockIcon, 
  DocumentTextIcon, 
  ExclamationCircleIcon,
  ArrowPathIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

const JobApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const { user } = useUser();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const data = await jobService.getUserApplications();
        setApplications(Array.isArray(data) ? data : data?.results || []);
      } catch (err) {
        console.error('Error fetching applications:', err);
        setError('Failed to load job applications. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchApplications();
    }
  }, [user]);

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.job?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.job?.company?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    const statusMap = {
      'applied': { color: 'bg-blue-100 text-blue-800', icon: ClockIcon },
      'review': { color: 'bg-yellow-100 text-yellow-800', icon: DocumentTextIcon },
      'interview': { color: 'bg-purple-100 text-purple-800', icon: CalendarIcon },
      'offered': { color: 'bg-green-100 text-green-800', icon: CheckCircleIcon },
      'rejected': { color: 'bg-red-100 text-red-800', icon: ExclamationCircleIcon },
      'withdrawn': { color: 'bg-gray-100 text-gray-800', icon: ExclamationCircleIcon },
    };

    const statusConfig = statusMap[status] || { color: 'bg-gray-100 text-gray-800', icon: DocumentTextIcon };
    const StatusIcon = statusConfig.icon;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig.color} capitalize`}>
        <StatusIcon className="h-3 w-3 mr-1" />
        {status.replace(/-/g, ' ')}
      </span>
    );
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <ExclamationCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Job Applications</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Track the status of your job applications in one place
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative rounded-lg shadow-sm md:col-span-2">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm text-gray-900 dark:text-white placeholder-gray-500"
              placeholder="Search by job title or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative">
            <select
              className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm text-gray-900 dark:text-white"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="applied">Applied</option>
              <option value="review">Under Review</option>
              <option value="interview">Interview</option>
              <option value="offered">Offered</option>
              <option value="rejected">Rejected</option>
              <option value="withdrawn">Withdrawn</option>
            </select>
          </div>
        </div>

        {/* Applications List */}
        <div className="space-y-4">
          {filteredApplications.length > 0 ? (
            filteredApplications.map((application) => (
              <div 
                key={application.id} 
                className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-white/20 dark:border-gray-700/50"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0 h-12 w-12 rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/50 dark:to-indigo-900/50 flex items-center justify-center">
                        <BriefcaseIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                          <Link 
                            to={`/job/${application.job?.id}`} 
                            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                          >
                            {application.job?.title || 'Job Title N/A'}
                          </Link>
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {application.job?.company?.name || 'Company N/A'}
                          {application.job?.location && ` • ${application.job.location}`}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 md:mt-0 md:ml-4 flex flex-col items-start md:items-end space-y-2">
                    <div className="flex items-center">
                      <span className="text-sm text-gray-500 dark:text-gray-400 mr-2">Applied on:</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {formatDate(application.applied_at)}
                      </span>
                    </div>
                    {getStatusBadge(application.status)}
                  </div>
                </div>
                
                {application.cover_letter && (
                  <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Cover Letter</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {application.cover_letter}
                    </p>
                  </div>
                )}

                <div className="mt-4 flex flex-wrap gap-3">
                  <Link
                    to={`/job/${application.job?.id}`}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full text-blue-700 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  >
                    View Job
                  </Link>
                  {application.resume && (
                    <a
                      href={application.resume}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full text-purple-700 bg-purple-100 hover:bg-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:hover:bg-purple-900/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
                    >
                      View Resume
                    </a>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg rounded-2xl shadow-inner">
              <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No applications found</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filter criteria.'
                  : 'You haven\'t applied to any jobs yet.'}
              </p>
              <div className="mt-6">
                <Link
                  to="/jobs"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Browse Jobs
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobApplicationsPage;
