import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Outlet } from 'react-router-dom';
import NavigationBar from './NavigationBar';
import Sidebar from './Sidebar';
import ErrorBoundary from '../common/ErrorBoundary';
import HealthStatus from '../common/HealthStatus';

/**
 * Main application layout for authenticated users.
 * Includes navigation bar, sidebar, and main content area.
 */
const AppLayout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleSidebarToggle = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <NavigationBar onMenuToggle={handleSidebarToggle} />
      <div className="flex flex-1">
        <Sidebar isCollapsed={isSidebarCollapsed} onToggle={handleSidebarToggle} />
        <div className="flex flex-col flex-1">
          <main className="flex-1 p-4 overflow-y-auto">
            <ErrorBoundary>
              <Outlet />
            </ErrorBoundary>
          </main>
          
          {/* Footer */}
          <footer className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
              <HealthStatus showDetails={false} className="border-0 p-2" />
              <div className="py-2 text-center text-xs text-gray-500 dark:text-gray-400">
                <p>© {new Date().getFullYear()} CareerOpen. All rights reserved.</p>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

AppLayout.propTypes = {
  children: PropTypes.node,
};

export default AppLayout;
