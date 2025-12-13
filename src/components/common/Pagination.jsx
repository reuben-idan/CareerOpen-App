import React from 'react';
import PropTypes from 'prop-types';
import { ChevronLeftIcon, ChevronRightIcon, ChevronDoubleLeftIcon, ChevronDoubleRightIcon } from '@heroicons/react/24/outline';

/**
 * Pagination component for navigating through paginated data
 * @param {Object} props - Component props
 * @param {number} props.currentPage - Current page number (1-based)
 * @param {number} props.totalPages - Total number of pages
 * @param {number} [props.pageNeighbours=2] - Number of page buttons to show on each side of the current page
 * @param {Function} props.onPageChange - Callback when page changes
 * @param {string} [props.className] - Additional CSS classes
 * @returns {JSX.Element} Pagination component
 */
const Pagination = ({
  currentPage,
  totalPages,
  pageNeighbours = 2,
  onPageChange,
  className = '',
  ...rest
}) => {
  // Don't render if there's only one page
  if (totalPages <= 1) {
    return null;
  }

  // Calculate the range of page numbers to show
  const range = (start, end) => {
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  // Calculate the range of page numbers to display
  const getPageRange = () => {
    // Always show first and last page, and current page with pageNeighbours on each side
    const totalNumbers = pageNeighbours * 2 + 3; // Current page + neighbours on both sides
    const totalButtons = Math.min(totalPages, totalNumbers);

    if (totalPages <= totalNumbers) {
      return range(1, totalPages);
    }

    const leftBound = Math.max(2, currentPage - pageNeighbours);
    const rightBound = Math.min(totalPages - 1, currentPage + pageNeighbours);
    const showLeftDots = leftBound > 2;
    const showRightDots = rightBound < totalPages - 1;

    if (!showLeftDots && showRightDots) {
      const leftRange = range(1, 3 + 2 * pageNeighbours);
      return [...leftRange, '...', totalPages];
    }

    if (showLeftDots && !showRightDots) {
      const rightRange = range(totalPages - (3 + 2 * pageNeighbours) + 1, totalPages);
      return [1, '...', ...rightRange];
    }

    if (showLeftDots && showRightDots) {
      const middleRange = range(leftBound, rightBound);
      return [1, '...', ...middleRange, '...', totalPages];
    }

    return range(1, totalPages);
  };

  const pages = getPageRange();
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  return (
    <nav 
      className={`flex items-center justify-between px-4 sm:px-0 ${className}`}
      aria-label="Pagination"
      {...rest}
    >
      <div className="flex-1 flex justify-between sm:justify-end space-x-2">
        {/* First Page Button */}
        <button
          onClick={() => onPageChange(1)}
          disabled={isFirstPage}
          className={`relative inline-flex items-center px-2 py-2 rounded-md text-sm font-medium ${
            isFirstPage
              ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
          }`}
          aria-label="First page"
        >
          <span className="sr-only">First</span>
          <ChevronDoubleLeftIcon className="h-5 w-5" aria-hidden="true" />
        </button>

        {/* Previous Page Button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={isFirstPage}
          className={`relative inline-flex items-center px-2 py-2 rounded-md text-sm font-medium ${
            isFirstPage
              ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
          }`}
          aria-label="Previous"
        >
          <span className="sr-only">Previous</span>
          <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
        </button>

        {/* Page Numbers */}
        <div className="hidden sm:flex space-x-1">
          {pages.map((page, index) => {
            if (page === '...') {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-500"
                >
                  ...
                </span>
              );
            }

            const isCurrent = page === currentPage;
            return (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`relative inline-flex items-center px-4 py-2 text-sm font-medium ${
                  isCurrent
                    ? 'bg-indigo-600 text-white dark:bg-indigo-700'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                } rounded-md`}
                aria-current={isCurrent ? 'page' : undefined}
              >
                {page}
              </button>
            );
          })}
        </div>

        {/* Next Page Button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={isLastPage}
          className={`relative inline-flex items-center px-2 py-2 rounded-md text-sm font-medium ${
            isLastPage
              ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
          }`}
          aria-label="Next"
        >
          <span className="sr-only">Next</span>
          <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
        </button>

        {/* Last Page Button */}
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={isLastPage}
          className={`relative inline-flex items-center px-2 py-2 rounded-md text-sm font-medium ${
            isLastPage
              ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
          }`}
          aria-label="Last page"
        >
          <span className="sr-only">Last</span>
          <ChevronDoubleRightIcon className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
    </nav>
  );
};

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  pageNeighbours: PropTypes.number,
  onPageChange: PropTypes.func.isRequired,
  className: PropTypes.string,
};

export default Pagination;
