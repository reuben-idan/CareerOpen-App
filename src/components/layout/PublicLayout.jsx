import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import HealthStatus from '../common/HealthStatus';

/**
 * Public layout component for unauthenticated pages like sign-in/sign-up.
 * Does not include any navigation elements.
 */
const PublicLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Simple header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="text-xl font-bold text-primary-600 dark:text-primary-400">
              CareerOpen
            </Link>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center p-4">
        {children}
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
  );
};

PublicLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PublicLayout;
