// Import the API instance and services
import authService from './authService';
const { api } = authService;
import jobService from './jobService';

// Create a services object that includes everything
const services = {
  api,
  authService,
  jobService
};

// Export the API instance and services
export { api, authService, jobService };

// Default export with all services
export default services;
