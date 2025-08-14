import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useNetwork } from '../../contexts/NetworkContext';
import { 
  UserGroupIcon, 
  ChatBubbleLeftRightIcon, 
  BellIcon, 
  UserPlusIcon,
  UserMinusIcon,
  EnvelopeIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Connections', href: '/network/connections', icon: UserGroupIcon, count: 'connections' },
  { name: 'Messages', href: '/network/messages', icon: ChatBubbleLeftRightIcon, count: 'unreadMessages' },
  { name: 'Notifications', href: '/network/notifications', icon: BellIcon, count: 'unreadCount' },
  { name: 'Sent Requests', href: '/network/requests/sent', icon: UserPlusIcon },
  { name: 'Received Requests', href: '/network/requests/received', icon: EnvelopeIcon, count: 'pendingConnections' },
  { name: 'Following', href: '/network/following', icon: UserPlusIcon },
  { name: 'Followers', href: '/network/followers', icon: UserMinusIcon },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const NetworkLayout = () => {
  const location = useLocation();
  const { 
    unreadCount, 
    pendingConnections,
    connections,
    isLoading
  } = useNetwork();

  // Get count for navigation items
  const getCount = (countType) => {
    switch (countType) {
      case 'unreadCount':
        return unreadCount;
      case 'pendingConnections':
        return pendingConnections?.length || 0;
      case 'connections':
        return connections?.length || 0;
      case 'unreadMessages':
        // This would be implemented when we have message counts
        return 0;
      default:
        return null;
    }
  };

  if (isLoading.connections || isLoading.pendingConnections) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile navigation */}
      <div className="lg:hidden bg-white shadow">
        <div className="flex overflow-x-auto">
          <nav className="flex space-x-4 px-4 py-3">
            {navigation.map((item) => {
              const isCurrent = location.pathname.startsWith(item.href);
              const count = getCount(item.count);
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={classNames(
                    isCurrent
                      ? 'bg-primary-50 text-primary-600 border-primary-500'
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700 border-transparent',
                    'inline-flex items-center px-3 py-1.5 border-b-2 text-sm font-medium rounded-t-md'
                  )}
                  aria-current={isCurrent ? 'page' : undefined}
                >
                  <item.icon 
                    className={classNames(
                      isCurrent ? 'text-primary-500' : 'text-gray-400',
                      'flex-shrink-0 -ml-1 mr-2 h-5 w-5'
                    )} 
                    aria-hidden="true" 
                  />
                  <span>{item.name}</span>
                  {count > 0 && (
                    <span
                      className={classNames(
                        isCurrent ? 'bg-primary-100 text-primary-800' : 'bg-gray-100 text-gray-800',
                        'ml-2 py-0.5 px-2 rounded-full text-xs font-medium'
                      )}
                    >
                      {count}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Sidebar navigation */}
          <aside className="hidden lg:block lg:col-span-3 lg:pr-8">
            <nav className="space-y-1">
              {navigation.map((item) => {
                const isCurrent = location.pathname.startsWith(item.href);
                const count = getCount(item.count);
                
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={classNames(
                      isCurrent
                        ? 'bg-primary-50 border-primary-500 text-primary-700 hover:bg-primary-50 hover:text-primary-700'
                        : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                      'group border-l-4 px-3 py-2 flex items-center text-sm font-medium rounded-r-md'
                    )}
                    aria-current={isCurrent ? 'page' : undefined}
                  >
                    <item.icon
                      className={classNames(
                        isCurrent ? 'text-primary-500' : 'text-gray-400 group-hover:text-gray-500',
                        'flex-shrink-0 -ml-1 mr-3 h-6 w-6'
                      )}
                      aria-hidden="true"
                    />
                    <span className="truncate">{item.name}</span>
                    {count > 0 && (
                      <span
                        className={classNames(
                          isCurrent ? 'bg-primary-100 text-primary-800' : 'bg-gray-100 text-gray-800',
                          'ml-auto inline-block py-0.5 px-3 rounded-full text-xs font-medium'
                        )}
                      >
                        {count}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Network stats */}
            <div className="mt-8 bg-white p-4 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500">Your Network</h3>
              <dl className="mt-2 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-1">
                <div className="relative overflow-hidden rounded-lg bg-white px-4 pt-5 pb-5 shadow sm:px-6 sm:pt-6">
                  <dt>
                    <div className="absolute rounded-md bg-primary-500 p-3">
                      <UserGroupIcon className="h-6 w-6 text-white" aria-hidden="true" />
                    </div>
                    <p className="ml-16 truncate text-sm font-medium text-gray-500">Connections</p>
                  </dt>
                  <dd className="ml-16 flex items-baseline">
                    <p className="text-2xl font-semibold text-gray-900">
                      {connections?.length || 0}
                    </p>
                  </dd>
                </div>

                <div className="relative overflow-hidden rounded-lg bg-white px-4 pt-5 pb-5 shadow sm:px-6 sm:pt-6">
                  <dt>
                    <div className="absolute rounded-md bg-yellow-500 p-3">
                      <ClockIcon className="h-6 w-6 text-white" aria-hidden="true" />
                    </div>
                    <p className="ml-16 truncate text-sm font-medium text-gray-500">Pending Requests</p>
                  </dt>
                  <dd className="ml-16 flex items-baseline">
                    <p className="text-2xl font-semibold text-gray-900">
                      {pendingConnections?.length || 0}
                    </p>
                  </dd>
                </div>
              </dl>
            </div>
          </aside>

          {/* Main content */}
          <main className="lg:col-span-9">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default NetworkLayout;
