import React from 'react';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';

const ErrorMessage = ({ 
  message = 'An error occurred', 
  onRetry, 
  className = '' 
}) => {
  return (
    <div className={`bg-red-50 dark:bg-red-900/20 p-4 rounded-md ${className}`}>
      <div className="flex">
        <div className="flex-shrink-0">
          <ExclamationCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
            {message}
          </h3>
          {onRetry && (
            <div className="mt-2">
              <button
                type="button"
                onClick={onRetry}
                className="text-sm font-medium text-red-700 dark:text-red-300 hover:text-red-600 dark:hover:text-red-200"
              >
                Try again<span aria-hidden="true"> &rarr;</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage;
