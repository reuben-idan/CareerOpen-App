/**
 * Standardizes API error handling across the application
 * @param {Error} error - The error object from the API call
 * @returns {Object} - Standardized error object with message and details
 */
export const handleApiError = (error) => {
  // Default error message
  let errorMessage = 'An unexpected error occurred';
  let errorDetails = {};
  let statusCode = null;

  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    statusCode = error.response.status;
    const { data } = error.response;

    // Handle different status codes
    switch (statusCode) {
      case 400: // Bad Request
        errorMessage = 'Invalid request';
        errorDetails = data;
        break;
      case 401: // Unauthorized
        errorMessage = 'You are not authorized to perform this action';
        // Optionally clear auth state here if needed
        break;
      case 403: // Forbidden
        errorMessage = 'You do not have permission to access this resource';
        break;
      case 404: // Not Found
        errorMessage = 'The requested resource was not found';
        break;
      case 409: // Conflict
        errorMessage = 'A conflict occurred';
        errorDetails = data;
        break;
      case 422: // Unprocessable Entity (validation errors)
        errorMessage = 'Validation failed';
        errorDetails = data;
        break;
      case 429: // Too Many Requests
        errorMessage = 'Too many requests. Please try again later.';
        break;
      case 500: // Internal Server Error
        errorMessage = 'An internal server error occurred';
        break;
      default:
        errorMessage = data?.message || errorMessage;
    }
  } else if (error.request) {
    // The request was made but no response was received
    errorMessage = 'No response from server. Please check your connection.';
  } else {
    // Something happened in setting up the request that triggered an Error
    errorMessage = error.message || errorMessage;
  }

  // Log the error for debugging
  if (process.env.NODE_ENV === 'development') {
    console.error('API Error:', {
      message: errorMessage,
      details: errorDetails,
      status: statusCode,
      originalError: error
    });
  }

  return {
    message: errorMessage,
    details: errorDetails,
    status: statusCode,
    originalError: error
  };
};

/**
 * Handles API errors and shows toast notifications
 * @param {Error} error - The error object from the API call
 * @param {Function} showToast - Function to show toast notification
 * @param {string} defaultMessage - Default error message to show if none is provided
 */
export const handleErrorWithToast = (error, showToast, defaultMessage = 'An error occurred') => {
  const { message, details } = handleApiError(error);
  
  // If we have field-specific errors, show them in the toast
  if (details && typeof details === 'object' && Object.keys(details).length > 0) {
    const fieldErrors = Object.entries(details)
      .map(([field, errors]) => {
        const errorText = Array.isArray(errors) ? errors.join(' ') : errors;
        return `${field}: ${errorText}`;
      })
      .join('\n');
    
    showToast(fieldErrors || message || defaultMessage, 'error');
  } else {
    showToast(message || defaultMessage, 'error');
  }
};
