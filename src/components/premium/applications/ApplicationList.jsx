import React from 'react';
import { BriefcaseIcon, MapPinIcon } from '@heroicons/react/24/outline';

const ApplicationList = ({ 
  applications, 
  selectedApplication, 
  onSelectApplication,
  selectedStatus,
  statuses,
  formatDate
}) => {
  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/20 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">
          {selectedStatus === 'all' ? 'All Applications' : `${statuses[selectedStatus]?.label} Applications`}
          <span className="ml-2 text-sm font-normal text-gray-500">
            ({applications.length} {applications.length === 1 ? 'result' : 'results'})
          </span>
        </h2>
      </div>
      <div className="divide-y divide-gray-200 max-h-[calc(100vh-300px)] overflow-y-auto">
        {applications.length > 0 ? (
          applications.map((application) => (
            <div
              key={application.id}
              className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                selectedApplication?.id === application.id ? 'bg-indigo-50' : ''
              }`}
              onClick={() => onSelectApplication(application)}
            >
              <div className="flex items-start">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                  <BriefcaseIcon className="h-5 w-5" />
                </div>
                <div className="ml-4 flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-indigo-600 truncate">
                      {application.position}
                    </p>
                    <div className="ml-2 flex-shrink-0 flex">
                      <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {statuses[application.status]?.label}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 truncate">{application.company}</p>
                  <div className="mt-1 flex items-center text-sm text-gray-500">
                    <MapPinIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                    <span>{application.location}</span>
                  </div>
                  <div className="mt-1 text-xs text-gray-500">
                    Applied on {formatDate(application.appliedDate)}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center">
            <BriefcaseIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No applications found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by adding a new application.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationList;
