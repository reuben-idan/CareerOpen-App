// Core API instance
import api from './api';

// Service modules
import authService from './auth';
import userService from './user';
import jobsService from './jobs';
import companyService from './company';
import categoryService from './category';
import applicationService from './application';

// Export all services
export {
  api,
  authService,
  userService,
  jobsService,
  companyService,
  categoryService,
  applicationService
};

// Export all services as default
export default {
  api,
  auth: authService,
  user: userService,
  jobs: jobsService,
  companies: companyService,
  categories: categoryService,
  applications: applicationService
};
