import { apiService } from './apiService';

/**
 * Fetches a list of jobs from the API with pagination support
 * @param {Object} params - Query parameters for filtering/sorting/pagination
 * @param {string} [params.search] - Search term for job titles/descriptions
 * @param {string} [params.location] - Location filter
 * @param {string} [params.job_type] - Job type filter (full_time, part_time, etc.)
 * @param {string} [params.company] - Company name filter
 * @param {number} [params.min_salary] - Minimum salary filter
 * @param {boolean} [params.is_remote] - Remote jobs only flag
 * @param {string} [params.ordering] - Field to order results by (prefix with - for descending)
 * @param {number} [params.page] - Page number for pagination
 * @param {number} [params.page_size] - Number of items per page
 * @returns {Promise<Object>} A promise that resolves to the API response with jobs and pagination data
 */
export const fetchJobs = async (params = {}) => {
  try {
    // Set default pagination if not provided
    const page = params.page || 1;
    const pageSize = params.page_size || 10;
    
    // Prepare query parameters
    const queryParams = {
      ...params,
      page,
      page_size: pageSize,
    };
    
    // Remove undefined or null values
    Object.keys(queryParams).forEach(key => 
      (queryParams[key] === undefined || queryParams[key] === '') && delete queryParams[key]
    );
    
    const response = await apiService.get('/jobs/', { 
      params: queryParams,
      // Include full response for pagination headers
      _fullResponse: true
    });
    
    // Return both data and headers for pagination
    return {
      data: response.data,
      headers: response.headers,
      status: response.status
    };
  } catch (error) {
    console.error('Error fetching jobs:', error);
    
    // Enhanced error handling
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
      console.error('Response headers:', error.response.headers);
      
      // Re-throw with more context
      const errorMessage = error.response.data?.detail || 
                         error.response.data?.message || 
                         'Failed to fetch jobs';
      const customError = new Error(errorMessage);
      customError.response = error.response;
      throw customError;
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
      throw new Error('No response received from the server. Please check your network connection.');
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Request setup error:', error.message);
      throw new Error(`Request failed: ${error.message}`);
    }
  }
};

/**
 * Fetches a single job by ID
 * @param {string|number} jobId - The ID of the job to fetch
 * @returns {Promise<Object>} A promise that resolves to the job object
 */
export const fetchJobById = async (jobId) => {
  if (!jobId) {
    throw new Error('Job ID is required');
  }
  
  try {
    const response = await apiService.get(`/jobs/${jobId}/`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching job ${jobId}:`, error);
    
    if (error.response) {
      // Handle different HTTP status codes
      if (error.response.status === 404) {
        throw new Error(`Job with ID ${jobId} not found`);
      }
      
      // Include server response in error
      const errorMessage = error.response.data?.detail || 
                         error.response.data?.message || 
                         `Failed to fetch job ${jobId}`;
      const customError = new Error(errorMessage);
      customError.response = error.response;
      throw customError;
    }
    
    throw error;
  }
};

/**
 * Creates a new job application
 * @param {Object} applicationData - The application data to submit
 * @param {string|number} applicationData.job - The job ID being applied to
 * @param {string} [applicationData.cover_letter] - Optional cover letter text
 * @param {File|string} [applicationData.resume] - Resume file or URL
 * @param {Object} [additionalData] - Additional form data or metadata
 * @returns {Promise<Object>} A promise that resolves to the created application
 */
export const createJobApplication = async (applicationData, additionalData = {}) => {
  if (!applicationData?.job) {
    throw new Error('Job ID is required to submit an application');
  }
  
  try {
    // Handle file upload if resume is a File object
    const formData = new FormData();
    
    // Add all application data to form data
    Object.entries({
      ...applicationData,
      ...additionalData
    }).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value);
      }
    });
    
    const response = await apiService.post('/applications/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  } catch (error) {
    console.error('Error creating job application:', error);
    
    if (error.response) {
      // Handle validation errors
      if (error.response.status === 400) {
        const errorMessage = error.response.data?.detail || 
                           Object.values(error.response.data || {}).flat().join('\n') ||
                           'Invalid application data';
        const validationError = new Error(errorMessage);
        validationError.response = error.response;
        validationError.isValidationError = true;
        throw validationError;
      }
      
      // Handle other API errors
      const errorMessage = error.response.data?.detail || 
                         error.response.data?.message || 
                         'Failed to submit application';
      const apiError = new Error(errorMessage);
      apiError.response = error.response;
      throw apiError;
    }
    
    throw error;
  }
};

/**
 * Creates a new job posting
 * @param {Object} jobData - The job data to post
 * @returns {Promise<Object>} A promise that resolves to the created job
 */
const createJob = async (jobData) => {
  try {
    const response = await apiService.post('/jobs/', jobData);
    return response.data;
  } catch (error) {
    console.error('Error creating job:', error);
    throw error;
  }
};

export default {
  fetchJobs,
  fetchJobById,
  createJobApplication,
  createJob,
};
