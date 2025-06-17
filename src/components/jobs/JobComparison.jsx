import React, { useState } from 'react';
import {
  ScaleIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  ClockIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  UserGroupIcon,
  ChartBarIcon,
  HeartIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { analytics } from '../../services/analytics';

const JobComparison = ({ jobs, onSaveJob, savedJobs }) => {
  const [selectedJobs, setSelectedJobs] = useState(jobs.slice(0, 3));
  const [activeTab, setActiveTab] = useState('overview');

  const handleJobSelect = (job) => {
    if (selectedJobs.find((j) => j.id === job.id)) {
      setSelectedJobs(selectedJobs.filter((j) => j.id !== job.id));
    } else if (selectedJobs.length < 3) {
      setSelectedJobs([...selectedJobs, job]);
    }
    analytics.track('select_job_comparison', { jobId: job.id });
  };

  const handleSaveJob = (jobId) => {
    onSaveJob(jobId);
    analytics.track('save_job_from_comparison', { jobId });
  };

  const comparisonTabs = [
    { id: 'overview', name: 'Overview', icon: ScaleIcon },
    { id: 'requirements', name: 'Requirements', icon: AcademicCapIcon },
    { id: 'benefits', name: 'Benefits', icon: HeartIcon },
    { id: 'culture', name: 'Culture', icon: UserGroupIcon },
    { id: 'growth', name: 'Growth', icon: ChartBarIcon }
  ];

  const renderComparisonRow = (label, icon: any, getValue) => (
    <div className="grid grid-cols-4 gap-4 py-4 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center">
        <icon className="h-5 w-5 text-gray-400 mr-2" />
        <span className="text-sm font-medium text-gray-900 dark:text-white">
          {label}
        </span>
      </div>
      {selectedJobs.map((job) => (
        <div key={job.id} className="text-sm text-gray-500 dark:text-gray-400">
          {getValue(job)}
        </div>
      ))}
    </div>
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-card">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">
            Compare Jobs
          </h2>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Select up to 3 jobs to compare
            </span>
          </div>
        </div>

        <div className="mb-6">
          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-1" />
            {selectedJobs.map((job) => (
              <div
                key={job.id}
                className="relative bg-gray-50 dark:bg-gray-700 rounded-lg p-4"
              >
                <button
                  onClick={() => handleSaveJob(job.id)}
                  className="absolute top-2 right-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                >
                  {savedJobs.includes(job.id) ? (
                    <HeartSolidIcon className="h-5 w-5 text-red-500" />
                  ) : (
                    <HeartIcon className="h-5 w-5" />
                  )}
                </button>
                <h3 className="text-base font-medium text-gray-900 dark:text-white mb-2">
                  {job.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {job.company}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-8">
            {comparisonTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
              >
                <tab.icon className="h-5 w-5 mr-2" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-6">
          {activeTab === 'overview' && (
            <div className="space-y-4">
              {renderComparisonRow('Company', BuildingOfficeIcon, (job) => job.company)}
              {renderComparisonRow('Location', MapPinIcon, (job) => job.location)}
              {renderComparisonRow('Salary', CurrencyDollarIcon, (job) => job.salary)}
              {renderComparisonRow('Type', BriefcaseIcon, (job) => job.type)}
              {renderComparisonRow('Posted', ClockIcon, (job) =>
                new Date(job.postedAt).toLocaleDateString()
              )}
            </div>
          )}

          {activeTab === 'requirements' && (
            <div className="space-y-4">
              {renderComparisonRow('Experience', AcademicCapIcon, (job) =>
                job.requirements?.experience || 'Not specified'
              )}
              {renderComparisonRow('Education', AcademicCapIcon, (job) =>
                job.requirements?.education || 'Not specified'
              )}
              {renderComparisonRow('Skills', BriefcaseIcon, (job) =>
                job.skills?.join(', ') || 'Not specified'
              )}
            </div>
          )}

          {activeTab === 'benefits' && (
            <div className="space-y-4">
              {renderComparisonRow('Health Insurance', HeartIcon, (job) =>
                job.benefits?.healthInsurance ? 'Yes' : 'Not specified'
              )}
              {renderComparisonRow('401(k)', HeartIcon, (job) =>
                job.benefits?.retirement ? 'Yes' : 'Not specified'
              )}
              {renderComparisonRow('Remote Work', HeartIcon, (job) =>
                job.benefits?.remoteWork ? 'Yes' : 'Not specified'
              )}
            </div>
          )}

          {activeTab === 'culture' && (
            <div className="space-y-4">
              {renderComparisonRow('Team Size', UserGroupIcon, (job) =>
                job.culture?.teamSize || 'Not specified'
              )}
              {renderComparisonRow('Work Environment', UserGroupIcon, (job) =>
                job.culture?.environment || 'Not specified'
              )}
              {renderComparisonRow('Company Values', UserGroupIcon, (job) =>
                job.culture?.values?.join(', ') || 'Not specified'
              )}
            </div>
          )}

          {activeTab === 'growth' && (
            <div className="space-y-4">
              {renderComparisonRow('Career Path', ChartBarIcon, (job) =>
                job.growth?.careerPath || 'Not specified'
              )}
              {renderComparisonRow('Training', ChartBarIcon, (job) =>
                job.growth?.training ? 'Yes' : 'Not specified'
              )}
              {renderComparisonRow('Promotion Cycle', ChartBarIcon, (job) =>
                job.growth?.promotionCycle || 'Not specified'
              )}
            </div>
          )}
        </div>

        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4">
            Available Jobs
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {jobs
              .filter((job) => !selectedJobs.find((j) => j.id === job.id))
              .map((job) => (
                <button
                  key={job.id}
                  onClick={() => handleJobSelect(job)}
                  className="text-left p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary-500 dark:hover:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                    {job.title}
                  </h4>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {job.company}
                  </p>
                </button>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobComparison; 