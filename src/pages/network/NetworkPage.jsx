import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  UserGroupIcon, 
  UserPlusIcon, 
  UserMinusIcon, 
  EnvelopeIcon,
  CheckIcon,
  XMarkIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import { useNetworkStore } from '../../stores/networkStore';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import useAuth from '../../hooks/useAuth';

const NetworkPage = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  // Get network data and actions from the store
  const { 
    connections, 
    pendingRequests, 
    suggestions, 
    searchResults,
    isLoading, 
    isSearching, 
    error, 
    fetchNetworkData, 
    searchUsers, 
    sendConnectionRequest, 
    acceptConnectionRequest, 
    declineConnectionRequest, 
    removeConnection 
  } = useNetworkStore();
  
  // Local state for search query
  const [searchQuery, setSearchQuery] = useState('');
  
  // Fetch network data on component mount
  useEffect(() => {
    fetchNetworkData();
  }, [fetchNetworkData]);
  
  // Handle search input change with debounce
  useEffect(() => {
    const timerId = setTimeout(() => {
      if (searchQuery.trim()) {
        searchUsers(searchQuery);
      }
    }, 500);
    
    return () => clearTimeout(timerId);
  }, [searchQuery, searchUsers]);
  
  // Handle connection request
  const handleConnect = async (userId) => {
    try {
      await sendConnectionRequest(userId);
      // The store will update the UI automatically
    } catch (error) {
      console.error('Failed to send connection request:', error);
    }
  };
  
  // Handle accept connection request
  const handleAcceptRequest = async (requestId) => {
    try {
      await acceptConnectionRequest(requestId);
      // The store will update the UI automatically
    } catch (error) {
      console.error('Failed to accept connection request:', error);
    }
  };
  
  // Handle decline connection request
  const handleDeclineRequest = async (requestId) => {
    try {
      await declineConnectionRequest(requestId);
      // The store will update the UI automatically
    } catch (error) {
      console.error('Failed to decline connection request:', error);
    }
  };
  
  // Handle remove connection
  const handleRemoveConnection = async (connectionId) => {
    if (window.confirm('Are you sure you want to remove this connection?')) {
      try {
        await removeConnection(connectionId);
        // The store will update the UI automatically
      } catch (error) {
        console.error('Failed to remove connection:', error);
      }
    }
  };
  
  // Render a user card
  const renderUserCard = (user, type = 'suggestion') => (
    <div 
      key={user.id} 
      className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex items-center justify-between hover:shadow-md transition-shadow"
    >
      <div className="flex items-center space-x-4">
        <div className="flex-shrink-0">
          <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
            {user.profile_picture ? (
              <img 
                src={user.profile_picture} 
                alt={`${user.first_name} ${user.last_name}`}
                className="h-full w-full object-cover"
              />
            ) : (
              <UserGroupIcon className="h-6 w-6 text-gray-400" />
            )}
          </div>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-900 dark:text-white">
            {user.first_name} {user.last_name}
          </h3>
          {user.headline && (
            <p className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
              {user.headline}
            </p>
          )}
          {user.mutual_connections > 0 && (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {user.mutual_connections} mutual connection{user.mutual_connections !== 1 ? 's' : ''}
            </p>
          )}
        </div>
      </div>
      
      <div className="flex space-x-2">
        {type === 'suggestion' && (
          <button
            onClick={() => handleConnect(user.id)}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <UserPlusIcon className="h-4 w-4 mr-1" />
            Connect
          </button>
        )}
        
        {type === 'pending' && (
          <>
            <button
              onClick={() => handleAcceptRequest(user.request_id || user.id)}
              className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              title="Accept"
            >
              <CheckIcon className="h-4 w-4" />
            </button>
            <button
              onClick={() => handleDeclineRequest(user.request_id || user.id)}
              className="inline-flex items-center px-2 py-1 border border-gray-300 dark:border-gray-600 text-xs font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              title="Decline"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          </>
        )}
        
        {type === 'connection' && (
          <button
            onClick={() => handleRemoveConnection(user.connection_id || user.id)}
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 text-xs font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            title="Remove connection"
          >
            <UserMinusIcon className="h-4 w-4 mr-1" />
            Remove
          </button>
        )}
      </div>
    </div>
  );
  
  // Render a section with a title and list of users
  const renderSection = (title, users, type, emptyMessage = 'No items to display') => (
    <div className="mb-8">
      <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">{title}</h2>
      {isLoading && users.length === 0 ? (
        <div className="flex justify-center py-8">
          <LoadingSpinner size="md" />
        </div>
      ) : error && users.length === 0 ? (
        <ErrorMessage message={error} onRetry={fetchNetworkData} />
      ) : users.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {users.map(user => renderUserCard(user, type))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          {emptyMessage}
        </div>
      )}
    </div>
  );
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">My Network</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Manage your connections and grow your professional network
        </p>
      </div>
      
      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search for people to connect with..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-800 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {isSearching && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <LoadingSpinner size="sm" />
            </div>
          )}
        </div>
      </div>
      
      {/* Search Results */}
      {searchQuery.trim() && (
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Search Results for "{searchQuery}"
          </h2>
          {isSearching && searchResults.length === 0 ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner size="md" />
            </div>
          ) : searchResults.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {searchResults.map(user => renderUserCard(user, 'suggestion'))}
            </div>
          ) : searchQuery.trim() ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No users found matching "{searchQuery}"
            </div>
          ) : null}
        </div>
      )}
      
      {/* Pending Connection Requests */}
      {!searchQuery.trim() && renderSection(
        'Connection Requests',
        pendingRequests,
        'pending',
        'You have no pending connection requests.'
      )}
      
      {/* People You May Know */}
      {!searchQuery.trim() && renderSection(
        'People You May Know',
        suggestions,
        'suggestion',
        'No suggestions available at the moment.'
      )}
      
      {/* Your Connections */}
      {!searchQuery.trim() && renderSection(
        'Your Connections',
        connections,
        'connection',
        'You have not connected with anyone yet.'
      )}
    </div>
  );
};

export default NetworkPage;
