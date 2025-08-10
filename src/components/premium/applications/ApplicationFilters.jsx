import React, { useState } from 'react';
import { FunnelIcon, MagnifyingGlassIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

const ApplicationFilters = ({
  searchQuery,
  setSearchQuery,
  selectedStatus,
  setSelectedStatus,
  selectedSort,
  setSelectedSort,
  statuses,
  sortOptions,
  getStatusCount,
  stages,
}) => {
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 border border-white/20 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
        {/* Search */}
        <div className="flex-1">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white/50 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Search applications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Status Filter - Mobile */}
        <div className="md:hidden">
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 w-full justify-center"
            onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
          >
            <FunnelIcon className="h-5 w-5 mr-2 text-gray-500" />
            Filter
          </button>
        </div>

        {/* Status Filter - Desktop */}
        <div className="hidden md:flex space-x-1 p-1 bg-gray-100 rounded-lg">
          {stages.map((stage) => (
            <button
              key={stage.id}
              type="button"
              className={`px-3 py-1.5 text-sm font-medium rounded-md whitespace-nowrap ${
                selectedStatus === stage.id
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
              onClick={() => setSelectedStatus(stage.id)}
            >
              {stage.name}
              <span
                className={`ml-1.5 inline-flex items-center justify-center h-5 w-5 rounded-full text-xs font-medium ${
                  selectedStatus === stage.id ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-200 text-gray-700'
                }`}
              >
                {getStatusCount(stage.id)}
              </span>
            </button>
          ))}
        </div>

        {/* Sort */}
        <div className="relative">
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={() => setIsSortOpen(!isSortOpen)}
          >
            Sort
            <ChevronDownIcon className="ml-2 -mr-1 h-5 w-5 text-gray-500" aria-hidden="true" />
          </button>

          {/* Sort dropdown */}
          {isSortOpen && (
            <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
              <div className="py-1">
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    className={`block px-4 py-2 text-sm w-full text-left ${
                      selectedSort.value === option.value ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                    }`}
                    onClick={() => {
                      setSelectedSort(option);
                      setIsSortOpen(false);
                    }}
                  >
                    {option.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile filters */}
      {isMobileFiltersOpen && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-2">
            {stages.map((stage) => (
              <button
                key={stage.id}
                type="button"
                className={`px-3 py-2 text-sm font-medium rounded-md text-center ${
                  selectedStatus === stage.id
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => {
                  setSelectedStatus(stage.id);
                  setIsMobileFiltersOpen(false);
                }}
              >
                {stage.name} ({getStatusCount(stage.id)})
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationFilters;
