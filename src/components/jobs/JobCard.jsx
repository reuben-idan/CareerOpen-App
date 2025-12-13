import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { 
  MapPinIcon, 
  CurrencyDollarIcon, 
  ClockIcon,
  BookmarkIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkSolidIcon } from '@heroicons/react/24/solid';
import GlassCard from '../ui/GlassCard';
import GlassButton from '../ui/GlassButton';

const JobCard = ({ job, onSave, onApply, isSaved = false, hasApplied = false }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatSalary = (min, max, currency = 'USD') => {
    if (!min && !max) return 'Salary not specified';
    
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });

    if (min && max) {
      return `${formatter.format(min)} - ${formatter.format(max)}`;
    }
    return min ? `From ${formatter.format(min)}` : `Up to ${formatter.format(max)}`;
  };

  const getJobTypeColor = (type) => {
    const colors = {
      full_time: 'bg-green-500/20 text-green-200 border-green-500/30',
      part_time: 'bg-blue-500/20 text-blue-200 border-blue-500/30',
      contract: 'bg-purple-500/20 text-purple-200 border-purple-500/30',
      internship: 'bg-orange-500/20 text-orange-200 border-orange-500/30',
      temporary: 'bg-gray-500/20 text-gray-200 border-gray-500/30',
    };
    return colors[type] || colors.full_time;
  };

  return (
    <GlassCard className="p-6 hover:scale-[1.01] transition-all duration-300">
      {/* Job Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            {job.company?.logo ? (
              <img
                src={job.company.logo}
                alt={job.company.name}
                className="w-12 h-12 rounded-lg border border-white/20 object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center">
                <BuildingOfficeIcon className="w-6 h-6 text-white/60" />
              </div>
            )}
            
            <div>
              <h3 className="text-xl font-semibold text-white hover:text-blue-200 cursor-pointer transition-colors">
                {job.title}
              </h3>
              <p className="text-white/70">{job.company?.name || 'Company'}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-sm text-white/60">
            <div className="flex items-center">
              <MapPinIcon className="w-4 h-4 mr-1" />
              {job.location}
              {job.is_remote && (
                <span className="ml-1 px-2 py-0.5 bg-blue-500/20 text-blue-200 rounded-full text-xs">
                  Remote
                </span>
              )}
            </div>
            
            <div className="flex items-center">
              <ClockIcon className="w-4 h-4 mr-1" />
              {formatDistanceToNow(new Date(job.created_at), { addSuffix: true })}
            </div>
            
            <span className={`px-2 py-1 rounded-full text-xs border ${getJobTypeColor(job.job_type)}`}>
              {job.job_type.replace('_', ' ').toUpperCase()}
            </span>
          </div>
        </div>

        <button
          onClick={() => onSave(job.id)}
          className="p-2 rounded-lg hover:bg-white/10 transition-colors"
        >
          {isSaved ? (
            <BookmarkSolidIcon className="w-6 h-6 text-yellow-400" />
          ) : (
            <BookmarkIcon className="w-6 h-6 text-white/60 hover:text-white" />
          )}
        </button>
      </div>

      {/* Salary */}
      {(job.salary_min || job.salary_max) && (
        <div className="flex items-center mb-4 text-green-200">
          <CurrencyDollarIcon className="w-5 h-5 mr-2" />
          <span className="font-medium">
            {formatSalary(job.salary_min, job.salary_max, job.salary_currency)}
          </span>
        </div>
      )}

      {/* Job Description */}
      <div className="mb-4">
        <p className="text-white/80 leading-relaxed">
          {isExpanded ? job.description : `${job.description?.slice(0, 200)}...`}
        </p>
        
        {job.description?.length > 200 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-blue-300 hover:text-blue-200 text-sm mt-2 transition-colors"
          >
            {isExpanded ? 'Show less' : 'Show more'}
          </button>
        )}
      </div>

      {/* Skills/Requirements Preview */}
      {job.requirements && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-white/80 mb-2">Requirements:</h4>
          <p className="text-sm text-white/60 line-clamp-2">
            {job.requirements.slice(0, 150)}...
          </p>
        </div>
      )}

      {/* Categories */}
      {job.categories && job.categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {job.categories.slice(0, 3).map((category) => (
            <span
              key={category.id}
              className="px-3 py-1 bg-white/10 text-white/80 rounded-full text-xs border border-white/20"
            >
              {category.name}
            </span>
          ))}
          {job.categories.length > 3 && (
            <span className="px-3 py-1 bg-white/10 text-white/60 rounded-full text-xs border border-white/20">
              +{job.categories.length - 3} more
            </span>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex space-x-3">
        <GlassButton
          variant="primary"
          className="flex-1"
          onClick={() => onApply(job)}
          disabled={hasApplied}
        >
          {hasApplied ? 'Applied' : 'Apply Now'}
        </GlassButton>
        
        <GlassButton
          variant="ghost"
          onClick={() => window.open(`/jobs/${job.id}`, '_blank')}
        >
          View Details
        </GlassButton>
      </div>

      {/* Application Deadline */}
      {job.application_deadline && (
        <div className="mt-3 text-xs text-white/50 text-center">
          Apply by {new Date(job.application_deadline).toLocaleDateString()}
        </div>
      )}
    </GlassCard>
  );
};

export default JobCard;