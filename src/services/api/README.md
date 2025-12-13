# CareerOpen API Services

This directory contains all the API service modules for the CareerOpen application. These services handle communication between the frontend and backend API endpoints.

## Available Services

### 1. Auth Service (`auth.js`)
Handles user authentication and authorization.

**Key Methods:**
- `login(email, password)` - Authenticate user
- `register(userData)` - Register new user
- `logout()` - Logout current user
- `refreshToken()` - Refresh access token
- `forgotPassword(email)` - Request password reset
- `resetPassword(uid, token, newPassword)` - Reset password with token

### 2. User Service (`user.js`)
Manages user profiles, preferences, and account settings.

**Key Methods:**
- `getCurrentUser()` - Get current authenticated user
- `updateProfile(userId, profileData)` - Update user profile
- `updatePreferences(userId, preferences)` - Update user preferences
- `changePassword(currentPassword, newPassword)` - Change password
- `uploadProfilePicture(userId, file)` - Upload profile picture
- `getSavedJobs(userId, filters)` - Get user's saved jobs
- `getUserApplications(userId, filters)` - Get user's job applications

### 3. Jobs Service (`jobs.js`)
Handles job postings and related operations.

**Key Methods:**
- `getJobs(filters)` - Get all jobs with optional filters
- `getJobById(jobId)` - Get job details by ID
- `createJob(jobData)` - Create new job posting
- `updateJob(jobId, jobData)` - Update job posting
- `deleteJob(jobId)` - Delete job posting
- `searchJobs(query, filters)` - Search jobs by query
- `getJobsByEmployer(employerId)` - Get jobs by employer

### 4. Company Service (`company.js`)
Manages company profiles and related operations.

**Key Methods:**
- `createCompany(companyData)` - Create new company
- `getCompany(companyId)` - Get company details
- `updateCompany(companyId, companyData)` - Update company
- `getAllCompanies(filters)` - Get all companies
- `uploadLogo(companyId, file)` - Upload company logo
- `getCompanyStats(companyId)` - Get company statistics

### 5. Category Service (`category.js`)
Handles job categories and skills.

**Key Methods:**
- `getCategories(filters)` - Get all categories
- `getCategory(categoryId)` - Get category by ID
- `createCategory(categoryData)` - Create new category (admin only)
- `getCategorySkills(categoryId)` - Get skills for a category
- `getCategoryJobs(categoryId, filters)` - Get jobs in a category
- `searchCategories(query)` - Search categories

### 6. Application Service (`application.js`)
Manages job applications and related operations.

**Key Methods:**
- `submitApplication(jobId, applicationData)` - Submit job application
- `getApplication(applicationId)` - Get application details
- `getUserApplications(userId, filters)` - Get user's applications
- `updateApplicationStatus(applicationId, status, notes)` - Update application status
- `scheduleInterview(applicationId, interviewData)` - Schedule interview
- `withdrawApplication(applicationId)` - Withdraw application

## Usage Example

```javascript
import { userService, jobsService } from './services/api';

// Get current user
const user = await userService.getCurrentUser();

// Get jobs with filters
const jobs = await jobsService.getJobs({
  location: 'Remote',
  jobType: 'full_time',
  experienceLevel: 'mid_level'
});

// Submit job application
await applicationService.submitApplication(jobId, {
  resume: resumeFile,
  coverLetter: 'I am excited to apply...'
});
```

## Error Handling

All API methods throw errors that can be caught and handled:

```javascript
try {
  const user = await userService.getCurrentUser();
} catch (error) {
  console.error('API Error:', error.message);
  // Handle error (e.g., show error message to user)
}
```

## Authentication

Most endpoints require authentication. The API service automatically includes the authentication token in requests.

## Rate Limiting

API requests are subject to rate limiting. The following headers are included in responses:

- `X-RateLimit-Limit`: Maximum number of requests allowed
- `X-RateLimit-Remaining`: Remaining number of requests
- `X-RateLimit-Reset`: Timestamp when the rate limit resets

## Development

To add a new API service:

1. Create a new file in the `services/api` directory
2. Implement the service methods following the existing patterns
3. Import and export the service in `services/api/index.js`
4. Update this documentation

## Testing

API services should be tested using the test files in the `__tests__` directory. Run tests with:

```bash
npm test
```
