// Import services
import authService from './authService';
import { api } from './authService';
import jobService from './jobService';

// Export the API instance and services
export { api };

export {
  authService,
  jobService
};

// Default export with all services
export default {
  api,
  authService,
  jobService
};
