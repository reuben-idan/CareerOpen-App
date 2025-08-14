import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNetwork } from '../../contexts/NetworkContext';
import { 
  UserGroupIcon, 
  SearchIcon, 
  UserAddIcon, 
  UserRemoveIcon,
  MailIcon,
  DotsVerticalIcon
} from '@heroicons/react/outline';
import { Menu, Transition } from '@headlessui/react';

const ConnectionsList = () => {
  const { 
    connections, 
    pendingConnections, 
    isLoading, 
    refreshConnections 
  } = useNetwork();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [filteredConnections, setFilteredConnections] = useState([]);

  // Filter connections based on search term and active tab
  useEffect(() => {
    if (isLoading.connections) return;
    
    let result = [];
    
    // Determine which connections to show based on active tab
    if (activeTab === 'all') {
      result = [...(connections || [])];
    } else if (activeTab === 'pending') {
      result = [...(pendingConnections || [])];
    } else {
      result = [];
    }
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(conn => {
        const user = conn.from_user || conn.to_user;
        if (!user) return false;
        
        return (
          user.first_name?.toLowerCase().includes(term) ||
          user.last_name?.toLowerCase().includes(term) ||
          user.email?.toLowerCase().includes(term) ||
          user.headline?.toLowerCase().includes(term)
        );
      });
    }
    
    setFilteredConnections(result);
  }, [connections, pendingConnections, searchTerm, activeTab, isLoading]);

  // Connection action handlers
  const handleRemoveConnection = async (connectionId) => {
    if (window.confirm('Are you sure you want to remove this connection?')) {
      try {
        // TODO: Implement remove connection API call
        console.log('Removing connection:', connectionId);
        await refreshConnections();
      } catch (error) {
        console.error('Error removing connection:', error);
      }
    }
  };

  const handleAcceptRequest = async (connectionId) => {
    try {
      // TODO: Implement accept connection API call
      console.log('Accepting connection request:', connectionId);
      await refreshConnections();
    } catch (error) {
      console.error('Error accepting connection request:', error);
    }
  };

  const handleDeclineRequest = async (connectionId) => {
    if (window.confirm('Are you sure you want to decline this connection request?')) {
      try {
        // TODO: Implement decline connection API call
        console.log('Declining connection request:', connectionId);
        await refreshConnections();
      } catch (error) {
        console.error('Error declining connection request:', error);
      }
    }
  };

  // Loading state
  if (isLoading.connections) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  // Empty state
  if (filteredConnections.length === 0) {
    return (
      <div className="text-center py-12">
        <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">
          {activeTab === 'pending' 
            ? 'No pending connection requests' 
            : 'No connections found'}
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          {searchTerm 
            ? 'Try adjusting your search or filter to find what you\'re looking for.'
            : activeTab === 'pending'
            ? 'When you receive connection requests, they\'ll appear here.'
            : 'Get started by connecting with colleagues or friends.'}
        </p>
        <div className="mt-6">
          <Link
            to="/network/connect"
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <UserAddIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Connect with people
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      {/* Search and filter */}
      <div className="bg-white px-4 py-5 border-b border-gray-200 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="relative rounded-md shadow-sm w-full sm:max-w-xs mb-4 sm:mb-0">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input
              type="text"
              name="search"
              id="search"
              className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
              placeholder="Search connections..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex space-x-2">
            <button
              type="button"
              className={`inline-flex items-center px-3 py-2 border rounded-md text-sm font-medium ${
                activeTab === 'all'
                  ? 'bg-primary-50 border-primary-500 text-primary-700'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => setActiveTab('all')}
            >
              <UserGroupIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              All Connections
              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                {connections?.length || 0}
              </span>
            </button>
            
            <button
              type="button"
              className={`inline-flex items-center px-3 py-2 border rounded-md text-sm font-medium ${
                activeTab === 'pending'
                  ? 'bg-yellow-50 border-yellow-500 text-yellow-700'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => setActiveTab('pending')}
            >
              <MailIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              Pending
              {pendingConnections?.length > 0 && (
                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  {pendingConnections.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Connection list */}
      <ul className="divide-y divide-gray-200">
        {filteredConnections.map((connection) => {
          // Determine the other user in the connection
          const otherUser = connection.from_user || connection.to_user;
          const isPending = connection.status === 'pending';
          const isIncoming = isPending && connection.to_user?.id === connection.to_user?.id;
          
          if (!otherUser) return null;
          
          return (
            <li key={connection.id} className="hover:bg-gray-50">
              <div className="px-4 py-4 flex items-center sm:px-6">
                <div className="min-w-0 flex-1 flex items-center">
                  <div className="flex-shrink-0">
                    <img
                      className="h-12 w-12 rounded-full"
                      src={otherUser.profile_image || '/default-avatar.png'}
                      alt={`${otherUser.first_name} ${otherUser.last_name}`}
                    />
                  </div>
                  <div className="min-w-0 flex-1 px-4">
                    <div>
                      <p className="text-sm font-medium text-primary-600 truncate">
                        {`${otherUser.first_name} ${otherUser.last_name}`}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        {otherUser.headline || 'No headline'}
                      </p>
                      {isPending && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 mt-1">
                          {isIncoming ? 'Pending your response' : 'Request sent'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="ml-5 flex-shrink-0">
                  {isPending && isIncoming ? (
                    <div className="flex space-x-2">
                      <button
                        type="button"
                        onClick={() => handleAcceptRequest(connection.id)}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      >
                        Accept
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeclineRequest(connection.id)}
                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      >
                        Decline
                      </button>
                    </div>
                  ) : (
                    <Menu as="div" className="relative inline-block text-left">
                      <div>
                        <Menu.Button className="rounded-full flex items-center text-gray-400 hover:text-gray-600 focus:outline-none">
                          <span className="sr-only">Open options</span>
                          <DotsVerticalIcon className="h-5 w-5" aria-hidden="true" />
                        </Menu.Button>
                      </div>

                      <Transition
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                          <div className="py-1">
                            <Menu.Item>
                              {({ active }) => (
                                <Link
                                  to={`/messages/${otherUser.id}`}
                                  className={`${
                                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                                  } group flex items-center px-4 py-2 text-sm`}
                                >
                                  <ChatBubbleLeftRightIcon className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" aria-hidden="true" />
                                  Send Message
                                </Link>
                              )}
                            </Menu.Item>
                            <Menu.Item>
                              {({ active }) => (
                                <button
                                  type="button"
                                  onClick={() => handleRemoveConnection(connection.id)}
                                  className={`${
                                    active ? 'bg-red-50 text-red-700' : 'text-red-600'
                                  } group flex items-center w-full px-4 py-2 text-sm`}
                                >
                                  <UserRemoveIcon className="mr-3 h-5 w-5 text-red-400 group-hover:text-red-500" aria-hidden="true" />
                                  Remove Connection
                                </button>
                              )}
                            </Menu.Item>
                          </div>
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ConnectionsList;
