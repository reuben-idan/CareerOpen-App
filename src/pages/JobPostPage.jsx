import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Button, 
  Input, 
  TextArea, 
  Select, 
  Checkbox,
  LoadingSpinner,
  ErrorMessage
} from '../components/common';
import useJobsStore from '../stores/jobsStore';

/**
 * JobPostPage - A page component for posting new job listings
 */
const JobPostPage = () => {
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    description: '',
    requirements: '',
    jobType: 'full-time',
    experienceLevel: 'mid-level',
    salaryMin: '',
    salaryMax: '',
    isRemote: false,
    applicationUrl: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const { createJob } = useJobsStore();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await createJob(formData);
      navigate('/jobs'); // Redirect to jobs list after successful submission
    } catch (err) {
      console.error('Error creating job:', err);
      setError(err.message || 'Failed to post job. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Post a New Job</h1>
      
      {error && (
        <ErrorMessage message={error} className="mb-4" />
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Job Title *
            </label>
            <Input
              id="title"
              name="title"
              type="text"
              required
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Senior Software Engineer"
            />
          </div>

          <div>
            <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
              Company *
            </label>
            <Input
              id="company"
              name="company"
              type="text"
              required
              value={formData.company}
              onChange={handleChange}
              placeholder="Company name"
            />
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
              Location *
            </label>
            <Input
              id="location"
              name="location"
              type="text"
              required={!formData.isRemote}
              disabled={formData.isRemote}
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g. New York, NY or Remote"
            />
          </div>

          <div className="flex items-end">
            <div className="flex items-center">
              <Checkbox
                id="isRemote"
                name="isRemote"
                checked={formData.isRemote}
                onChange={handleChange}
                className="mr-2"
              />
              <label htmlFor="isRemote" className="text-sm font-medium text-gray-700">
                This is a remote position
              </label>
            </div>
          </div>

          <div>
            <label htmlFor="jobType" className="block text-sm font-medium text-gray-700 mb-1">
              Job Type *
            </label>
            <Select
              id="jobType"
              name="jobType"
              value={formData.jobType}
              onChange={handleChange}
              required
            >
              <option value="full-time">Full-time</option>
              <option value="part-time">Part-time</option>
              <option value="contract">Contract</option>
              <option value="temporary">Temporary</option>
              <option value="internship">Internship</option>
            </Select>
          </div>

          <div>
            <label htmlFor="experienceLevel" className="block text-sm font-medium text-gray-700 mb-1">
              Experience Level *
            </label>
            <Select
              id="experienceLevel"
              name="experienceLevel"
              value={formData.experienceLevel}
              onChange={handleChange}
              required
            >
              <option value="internship">Internship</option>
              <option value="entry-level">Entry Level</option>
              <option value="mid-level">Mid Level</option>
              <option value="senior">Senior</option>
              <option value="lead">Lead</option>
              <option value="manager">Manager</option>
              <option value="executive">Executive</option>
            </Select>
          </div>

          <div>
            <label htmlFor="salaryMin" className="block text-sm font-medium text-gray-700 mb-1">
              Salary Range (Min)
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">$</span>
              </div>
              <Input
                id="salaryMin"
                name="salaryMin"
                type="number"
                value={formData.salaryMin}
                onChange={handleChange}
                placeholder="0.00"
                className="pl-7"
              />
            </div>
          </div>

          <div>
            <label htmlFor="salaryMax" className="block text-sm font-medium text-gray-700 mb-1">
              Salary Range (Max)
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">$</span>
              </div>
              <Input
                id="salaryMax"
                name="salaryMax"
                type="number"
                value={formData.salaryMax}
                onChange={handleChange}
                placeholder="0.00"
                className="pl-7"
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Job Description *
            </label>
            <TextArea
              id="description"
              name="description"
              rows={6}
              required
              value={formData.description}
              onChange={handleChange}
              placeholder="Detailed job description..."
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="requirements" className="block text-sm font-medium text-gray-700 mb-1">
              Requirements *
            </label>
            <TextArea
              id="requirements"
              name="requirements"
              rows={4}
              required
              value={formData.requirements}
              onChange={handleChange}
              placeholder="List the requirements for this position..."
            />
            <p className="mt-1 text-sm text-gray-500">
              Separate requirements with bullet points or new lines.
            </p>
          </div>

          <div className="md:col-span-2">
            <label htmlFor="applicationUrl" className="block text-sm font-medium text-gray-700 mb-1">
              Application URL or Email *
            </label>
            <Input
              id="applicationUrl"
              name="applicationUrl"
              type="url"
              required
              value={formData.applicationUrl}
              onChange={handleChange}
              placeholder="https://your-company.com/careers/apply or jobs@example.com"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate(-1)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <LoadingSpinner className="mr-2" />
                Posting...
              </>
            ) : 'Post Job'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default JobPostPage;
