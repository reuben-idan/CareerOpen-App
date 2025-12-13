import React from 'react';
import { BriefcaseIcon, MapPinIcon, LinkIcon } from '@heroicons/react/24/outline';

const statuses = {
  applied: { label: 'Applied', color: 'bg-blue-100 text-blue-800' },
  viewed: { label: 'Viewed', color: 'bg-purple-100 text-purple-800' },
  interview: { label: 'Interview', color: 'bg-yellow-100 text-yellow-800' },
  offer: { label: 'Offer', color: 'bg-green-100 text-green-800' },
  rejected: { label: 'Rejected', color: 'bg-red-100 text-red-800' },
};

const ApplicationForm = ({
  application,
  onInputChange,
  onStatusChange,
  onCancel,
  onSave,
  onDelete,
  isNew = false
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center">
            <input
              type="text"
              name="position"
              value={application.position}
              onChange={onInputChange}
              className="text-2xl font-bold text-gray-900 border-0 border-b-2 border-transparent focus:border-indigo-500 focus:ring-0 p-0 w-full"
              placeholder="Job Title"
              required
            />
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <div className="flex items-center">
              <input
                type="text"
                name="company"
                value={application.company}
                onChange={onInputChange}
                className="text-lg font-medium text-gray-600 border-0 border-b-2 border-transparent focus:border-indigo-500 focus:ring-0 p-0"
                placeholder="Company"
                required
              />
            </div>
            <span className="text-gray-400">•</span>
            <div className="flex items-center">
              <MapPinIcon className="h-4 w-4 text-gray-400 mr-1" />
              <input
                type="text"
                name="location"
                value={application.location}
                onChange={onInputChange}
                className="text-gray-500 border-0 border-b-2 border-transparent focus:border-indigo-500 focus:ring-0 p-0"
                placeholder="Location"
              />
            </div>
          </div>
        </div>
        <div className="flex space-x-2">
          {!isNew && (
            <button
              type="button"
              onClick={onDelete}
              className="inline-flex items-center px-3 py-1.5 border border-red-300 text-sm font-medium rounded text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Delete
            </button>
          )}
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Save
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700">
            Job Type
          </label>
          <select
            id="type"
            name="type"
            value={application.type}
            onChange={onInputChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-white/50 border border-gray-200"
            required
          >
            <option value="">Select job type</option>
            <option>Full-time</option>
            <option>Part-time</option>
            <option>Contract</option>
            <option>Internship</option>
            <option>Freelance</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <div className="flex flex-wrap gap-2">
            {Object.entries(statuses).map(([status, { label, color }]) => (
              <button
                key={status}
                type="button"
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  application.status === status
                    ? color
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                onClick={() => onStatusChange(status)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label htmlFor="appliedDate" className="block text-sm font-medium text-gray-700">
            Applied Date
          </label>
          <input
            type="date"
            name="appliedDate"
            id="appliedDate"
            value={application.appliedDate}
            onChange={onInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>
        <div>
          <label htmlFor="salary" className="block text-sm font-medium text-gray-700">
            Salary (optional)
          </label>
          <input
            type="text"
            name="salary"
            id="salary"
            value={application.salary || ''}
            onChange={onInputChange}
            placeholder="e.g. $80,000 - $100,000"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <label htmlFor="jobDescription" className="block text-sm font-medium text-gray-700">
            Job Description URL
          </label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
              <LinkIcon className="h-4 w-4" />
            </span>
            <input
              type="url"
              name="jobDescription"
              id="jobDescription"
              value={application.jobDescription || ''}
              onChange={onInputChange}
              className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
              placeholder="https://example.com/job/123"
            />
          </div>
        </div>

        <div>
          <label htmlFor="companyWebsite" className="block text-sm font-medium text-gray-700">
            Company Website
          </label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
              <LinkIcon className="h-4 w-4" />
            </span>
            <input
              type="url"
              name="companyWebsite"
              id="companyWebsite"
              value={application.companyWebsite || ''}
              onChange={onInputChange}
              className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
              placeholder="https://company.com"
            />
          </div>
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
            Notes
          </label>
          <div className="mt-1">
            <textarea
              rows={4}
              name="notes"
              id="notes"
              value={application.notes || ''}
              onChange={onInputChange}
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md"
              placeholder="Add any notes about this application..."
            />
          </div>
        </div>
      </div>
    </form>
  );
};

export default ApplicationForm;
