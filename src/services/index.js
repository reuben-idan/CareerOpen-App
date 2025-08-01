// Export all API services from a single entry point
import authService, { api } from './authService';
import jobService from './jobService';

export { api, authService, jobService };

export default {
  api,
  authService,
  jobService,
};
