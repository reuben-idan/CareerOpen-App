import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { BriefcaseIcon, PlusIcon, MapPinIcon, LinkIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ErrorBoundary } from 'react-error-boundary';
import ApplicationList from './applications/ApplicationList';
import ApplicationForm from './applications/ApplicationForm';
import ApplicationFilters from './applications/ApplicationFilters';
import useApplications from '../../hooks/useApplications';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';

// Memoized status configurations
export const statuses = Object.freeze({
  applied: { label: 'Applied', icon: '📝', color: 'bg-blue-100 text-blue-800' },
  viewed: { label: 'Viewed', icon: '👀', color: 'bg-purple-100 text-purple-800' },
  interview: { label: 'Interview', icon: '🎯', color: 'bg-yellow-100 text-yellow-800' },
  offer: { label: 'Offer', icon: '🏆', color: 'bg-green-100 text-green-800' },
  rejected: { label: 'Rejected', icon: '❌', color: 'bg-red-100 text-red-800' },
});

// Filter stages
export const stages = Object.freeze([
  { id: 'all', name: 'All' },
  { id: 'applied', name: 'Applied' },
  { id: 'viewed', name: 'Viewed' },
  { id: 'interview', name: 'Interview' },
  { id: 'offer', name: 'Offer' },
  { id: 'rejected', name: 'Rejected' },
]);

// Sort options
export const sortOptions = Object.freeze([
  { name: 'Most Recent', value: 'newest', current: true },
  { name: 'Oldest', value: 'oldest', current: false },
  { name: 'Status (A-Z)', value: 'status-asc', current: false },
  { name: 'Status (Z-A)', value: 'status-desc', current: false },
  { name: 'Company (A-Z)', value: 'company-asc', current: false },
  { name: 'Company (Z-A)', value: 'company-desc', current: false },
]);

// Error boundary fallback component
const ErrorFallback = ({ error, resetErrorBoundary }) => (
  <div className="p-4">
    <ErrorMessage 
      message={`Something went wrong: ${error.message}`}
      onRetry={resetErrorBoundary}
    />
  </div>
);

const PremiumApplications = () => {
  const navigate = useNavigate();
  
  // State for UI controls
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 1024);
  const [selectedApplicationId, setSelectedApplicationId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  
  // Custom hook for application data and operations
  const {
    applications,
    currentApplication,
    loading,
    error,
    loadApplications,
    loadApplication,
    createApplication,
    updateApplication,
    deleteApplication,
    updateStatus,
    clearError,
  } = useApplications();

  // Load applications on mount
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        await loadApplications();
        setIsInitialLoad(false);
      } catch (err) {
        toast.error('Failed to load applications');
        console.error('Error loading applications:', err);
      }
    };

    fetchApplications();
  }, [loadApplications]);

  // Load selected application when ID changes
  useEffect(() => {
    if (selectedApplicationId) {
      const fetchApplication = async () => {
        try {
          await loadApplication(selectedApplicationId);
        } catch (err) {
          toast.error('Failed to load application details');
          console.error('Error loading application:', err);
        }
      };

      fetchApplication();
    }
  }, [selectedApplicationId, loadApplication]);

  // Memoized filtered and sorted applications
  const filteredApplications = useMemo(() => {
    return applications
      .filter((app) => {
        const matchesSearch = app.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           app.company.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = selectedStatus === 'all' || app.status === selectedStatus;
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'newest':
            return new Date(b.appliedDate) - new Date(a.appliedDate);
          case 'oldest':
            return new Date(a.appliedDate) - new Date(b.appliedDate);
          case 'status-asc':
            return a.status.localeCompare(b.status);
          case 'status-desc':
            return b.status.localeCompare(a.status);
          case 'company-asc':
            return a.company.localeCompare(b.company);
          case 'company-desc':
            return b.company.localeCompare(a.company);
          default:
            return 0;
        }
      });
  }, [applications, searchQuery, selectedStatus, sortBy]);

  // Get status count for filter badges
  const getStatusCount = (status) => {
    if (status === 'all') return applications.length;
    return applications.filter((app) => app.status === status).length;
  };

  // Format date
  const formatDate = useCallback((dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }, []);

  // State for editable application
  const [editableApplication, setEditableApplication] = useState(null);

  // Handle application selection
  const handleSelectApplication = useCallback(async (applicationId) => {
    try {
      setSelectedApplicationId(applicationId);
    } catch (err) {
      console.error('Failed to load application details:', err);
      toast.error('Failed to load application details');
    }
  }, []);

  // Handle input change for editing
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditableApplication({
      ...editableApplication,
      [name]: value,
    });
  };

  // Handle status change
  const handleStatusChange = (status) => {
    setEditableApplication({
      ...editableApplication,
      status,
    });
  };

  // Handle save
  const handleSave = async () => {
    try {
      let savedApplication;
      if (editableApplication.id) {
        // Update existing application
        savedApplication = await updateApplication(editableApplication.id, editableApplication);
        toast.success('Application updated successfully');
      } else {
        // Create new application
        savedApplication = await createApplication(editableApplication);
        toast.success('Application created successfully');
      }
      setEditableApplication({ ...savedApplication });
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to save application:', err);
      toast.error('Failed to save application. Please try again.');
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this application?')) {
      try {
        await deleteApplication(id);
        toast.success('Application deleted successfully');
        if (currentApplication?.id === id) {
          setEditableApplication(null);
        }
      } catch (err) {
        console.error('Failed to delete application:', err);
        toast.error('Failed to delete application. Please try again.');
      }
    }
  };

  // Handle new application
  const handleNewApplication = () => {
    const newApp = {
      position: '',
      company: '',
      location: '',
      type: 'Full-time',
      status: 'applied',
      appliedDate: new Date().toISOString().split('T')[0],
      notes: '',
      jobDescription: '',
      companyWebsite: '',
      contacts: [],
      tasks: [],
    };
    setEditableApplication(newApp);
    setIsEditing(true);
  };

  // Set current application when it changes
  useEffect(() => {
    if (currentApplication) {
      setEditableApplication({ ...currentApplication });
    }
  }, [currentApplication]);

  // Show loading state
  if (isInitialLoad || (loading && !applications.length)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" text="Loading applications..." />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-4">
        <ErrorMessage message={error} onRetry={loadApplications} />
      </div>
    );
  }

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        setSelectedApplicationId(null);
        loadApplications();
      }}
    >
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left sidebar with filters */}
            <div className="w-full lg:w-1/4">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Applications</h2>
                
                <ApplicationFilters
                  searchQuery={searchQuery}
                  onSearchChange={(e) => setSearchQuery(e.target.value)}
                  selectedStatus={selectedStatus}
                  onStatusChange={(status) => setSelectedStatus(status)}
                  sortBy={sortBy}
                  onSortChange={(sort) => setSortBy(sort)}
                />
                
                <button
                  onClick={() => setSelectedApplicationId('new')}
                  className="mt-4 w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                  aria-label="Add new application"
                >
                  <PlusIcon className="h-5 w-5 mr-2" />
                  Add Application
                </button>
              </div>
            </div>
            
            {/* Main content */}
            <div className="flex-1">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
                {selectedApplicationId ? (
                  <ApplicationForm
                    application={currentApplication}
                    onSave={handleSave}
                    onCancel={() => setSelectedApplicationId(null)}
                    onDelete={handleDelete}
                    onStatusChange={handleStatusChange}
                    isNew={selectedApplicationId === 'new'}
                    loading={loading}
                  />
                ) : (
                  <ApplicationList
                    applications={filteredApplications}
                    onSelect={handleSelectApplication}
                    selectedId={selectedApplicationId}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default PremiumApplications;
