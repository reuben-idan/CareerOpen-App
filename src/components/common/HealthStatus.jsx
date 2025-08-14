import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { 
  CheckCircleIcon, 
  ExclamationTriangleIcon, 
  ExclamationCircleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { checkHealth } from '../../services/api/healthService';

/**
 * HealthStatus component displays the current status of the backend API
 * @param {Object} props - Component props
 * @param {boolean} [props.showDetails=false] - Whether to show detailed status information
 * @param {string} [props.className] - Additional CSS classes
 * @returns {JSX.Element} The rendered component
 */
const HealthStatus = ({ showDetails = false, className = '' }) => {
  const [status, setStatus] = useState({
    status: 'checking',
    timestamp: null,
    details: {}
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Temporarily disabled health checks
  useEffect(() => {
    const fetchHealthStatus = async () => {
      try {
        setIsLoading(true);
        console.log('Health checks are temporarily disabled');
        
        // Mock response data
        const mockResponse = {
          status: 'healthy',
          timestamp: new Date().toISOString(),
          details: {
            message: 'Health checks are temporarily disabled',
            environment: 'development',
            version: '1.0.0'
          }
        };
        
        setStatus(mockResponse);
        setError(null);
      } catch (err) {
        console.error('Error in health check:', err);
        setError('Error checking system status');
        setStatus({
          status: 'error',
          timestamp: new Date().toISOString(),
          details: { 
            error: 'Failed to check system status',
            message: err.message
          }
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    // Initial check
    fetchHealthStatus();
    
    // Disable polling for now
    // const intervalId = setInterval(fetchHealthStatus, 30000);
    // return () => clearInterval(intervalId);
  }, []);
  
  // Status indicator colors and icons
  const statusConfig = {
    healthy: {
      icon: CheckCircleIcon,
      iconColor: 'text-green-500',
      bgColor: 'bg-green-100 dark:bg-green-900/30',
      textColor: 'text-green-800 dark:text-green-200',
      label: 'All systems operational'
    },
    unhealthy: {
      icon: ExclamationTriangleIcon,
      iconColor: 'text-yellow-500',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
      textColor: 'text-yellow-800 dark:text-yellow-200',
      label: 'Service disruption'
    },
    unreachable: {
      icon: ExclamationCircleIcon,
      iconColor: 'text-red-500',
      bgColor: 'bg-red-100 dark:bg-red-900/30',
      textColor: 'text-red-800 dark:text-red-200',
      label: 'Service unavailable'
    },
    error: {
      icon: ExclamationCircleIcon,
      iconColor: 'text-red-500',
      bgColor: 'bg-red-100 dark:bg-red-900/30',
      textColor: 'text-red-800 dark:text-red-200',
      label: 'Error checking status'
    },
    checking: {
      icon: ArrowPathIcon,
      iconColor: 'text-gray-500 animate-spin',
      bgColor: 'bg-gray-100 dark:bg-gray-800',
      textColor: 'text-gray-800 dark:text-gray-200',
      label: 'Checking status...'
    }
  };
  
  const currentStatus = statusConfig[status.status] || statusConfig.error;
  const StatusIcon = currentStatus.icon;
  
  // Format timestamp
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'Just now';
    
    const date = new Date(timestamp);
    return `Last checked: ${date.toLocaleString()}`;
  };
  
  // Handle manual refresh
  const handleRefresh = async () => {
    try {
      setIsLoading(true);
      const healthData = await healthService.checkHealth();
      setStatus({
        status: healthData.status,
        timestamp: healthData.timestamp,
        details: healthData
      });
      setError(null);
    } catch (err) {
      console.error('Failed to refresh health status:', err);
      setError('Failed to refresh status');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className={`rounded-md p-4 ${currentStatus.bgColor} ${className}`}>
      <div className="flex items-start">
        <div className={`flex-shrink-0 ${currentStatus.iconColor} mt-0.5`}>
          <StatusIcon className={`h-5 w-5 ${status.status === 'checking' ? 'animate-spin' : ''}`} />
        </div>
        <div className="ml-3 flex-1">
          <div className={`text-sm font-medium ${currentStatus.textColor}`}>
            {currentStatus.label}
            {status.timestamp && (
              <span className="ml-2 text-xs opacity-80">
                {formatTimestamp(status.timestamp)}
              </span>
            )}
          </div>
          
          {showDetails && status.details && (
            <div className={`mt-2 text-sm ${currentStatus.textColor} opacity-90`}>
              {status.status === 'healthy' ? (
                <p>All services are operating normally.</p>
              ) : status.status === 'unhealthy' ? (
                <div>
                  <p>We're experiencing issues with our service. Our team has been notified.</p>
                  {status.details.error?.message && (
                    <p className="mt-1 text-sm">{status.details.error.message}</p>
                  )}
                </div>
              ) : status.status === 'unreachable' ? (
                <p>Unable to connect to the server. Please check your internet connection.</p>
              ) : status.status === 'error' ? (
                <p>An error occurred while checking the system status.</p>
              ) : null}
              
              {status.details.version && (
                <p className="mt-1 text-xs opacity-80">
                  API Version: {status.details.version}
                </p>
              )}
            </div>
          )}
          
          {error && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {error}
            </p>
          )}
        </div>
        <div className="ml-4 flex-shrink-0">
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isLoading}
            className={`inline-flex items-center rounded-md text-sm font-medium ${currentStatus.textColor} hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-${currentStatus.bgColor.split('-')[1]}-100 dark:focus:ring-offset-${currentStatus.bgColor.split('-')[1]}-900`}
          >
            <ArrowPathIcon 
              className={`h-4 w-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} 
              aria-hidden="true" 
            />
            Refresh
          </button>
        </div>
      </div>
    </div>
  );
};

HealthStatus.propTypes = {
  showDetails: PropTypes.bool,
  className: PropTypes.string,
};

export default HealthStatus;
