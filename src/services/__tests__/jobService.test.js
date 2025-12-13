import jobService from '../jobService';
import authService from '../authService';

// Mock the authService
jest.mock('../authService');

const { api } = authService;

describe('jobService', () => {
  const mockResponse = (data, status = 200) => ({
    data,
    status,
    statusText: status === 200 ? 'OK' : 'Error',
  });

  const mockError = (message, status = 500) => {
    const error = new Error(message);
    error.response = {
      status,
      data: { detail: message },
    };
    return error;
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getUserApplications', () => {
    const mockApplications = [
      {
        id: 1,
        job: {
          id: 101,
          title: 'Frontend Developer',
          company: { name: 'Tech Corp' },
        },
        status: 'applied',
        applied_at: '2025-08-01T12:00:00Z',
      },
    ];

    it('should fetch user applications successfully', async () => {
      api.get.mockResolvedValueOnce(mockResponse(mockApplications));
      
      const result = await jobService.getUserApplications();
      
      expect(api.get).toHaveBeenCalledWith('/jobs/applications/');
      expect(result).toEqual(mockApplications);
    });

    it('should handle API errors', async () => {
      const errorMessage = 'Failed to fetch applications';
      api.get.mockRejectedValueOnce(mockError(errorMessage, 500));
      
      await expect(jobService.getUserApplications()).rejects.toThrow(errorMessage);
    });
  });

  describe('getApplicationDetails', () => {
    const applicationId = 1;
    const mockApplication = {
      id: applicationId,
      job: { id: 101, title: 'Frontend Developer' },
      status: 'applied',
      applied_at: '2025-08-01T12:00:00Z',
    };

    it('should fetch application details successfully', async () => {
      api.get.mockResolvedValueOnce(mockResponse(mockApplication));
      
      const result = await jobService.getApplicationDetails(applicationId);
      
      expect(api.get).toHaveBeenCalledWith(`/jobs/applications/${applicationId}/`);
      expect(result).toEqual(mockApplication);
    });

    it('should handle 404 errors for non-existent applications', async () => {
      const errorMessage = 'Application not found';
      api.get.mockRejectedValueOnce(mockError(errorMessage, 404));
      
      await expect(jobService.getApplicationDetails(999)).rejects.toThrow(errorMessage);
    });
  });

  describe('applyForJob', () => {
    const jobId = 101;
    const applicationData = {
      cover_letter: 'I am excited to apply for this position.',
      resume: new File(['resume'], 'resume.pdf', { type: 'application/pdf' }),
    };

    it('should submit a job application successfully', async () => {
      const mockResponseData = {
        id: 1,
        job: jobId,
        status: 'applied',
        ...applicationData,
      };
      
      api.post.mockResolvedValueOnce(mockResponse(mockResponseData, 201));
      
      const result = await jobService.applyForJob(jobId, applicationData);
      
      expect(api.post).toHaveBeenCalledWith(
        `/jobs/${jobId}/apply/`,
        expect.any(FormData),
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      expect(result).toEqual(mockResponseData);
    });

    it('should handle validation errors', async () => {
      const errorMessage = 'Invalid application data';
      api.post.mockRejectedValueOnce(mockError(errorMessage, 400));
      
      await expect(jobService.applyForJob(jobId, {})).rejects.toThrow(errorMessage);
    });
  });
});
