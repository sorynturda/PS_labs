// src/utils/errorHandler.js

/**
 * Handle API errors consistently across the application
 * @param {Error} error - Error object from API call 
 * @param {String} defaultMessage - Default message to display if error doesn't have a message
 * @returns {String} Formatted error message for display
 */
export const handleApiError = (error, defaultMessage = 'An error occurred. Please try again.') => {
  // Handle axios error responses
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    if (error.response.data && error.response.data.message) {
      return error.response.data.message;
    }
    
    // Check for validation errors (often returned as an array or object of errors)
    if (error.response.data && error.response.data.errors) {
      if (Array.isArray(error.response.data.errors)) {
        return error.response.data.errors[0];
      } else if (typeof error.response.data.errors === 'object') {
        const firstKey = Object.keys(error.response.data.errors)[0];
        return error.response.data.errors[firstKey];
      }
    }
    
    // Handle specific HTTP status codes
    switch (error.response.status) {
      case 400:
        return 'Invalid request. Please check your input.';
      case 401:
        return 'You are not authorized. Please log in again.';
      case 403:
        return 'You do not have permission to perform this action.';
      case 404:
        return 'The requested resource was not found.';
      case 500:
        return 'Internal server error. Please try again later.';
      default:
        return `Error: ${error.response.status} - ${error.response.statusText}`;
    }
  } 
  // The request was made but no response was received
  else if (error.request) {
    return 'No response received from server. Please check your connection.';
  } 
  // Something happened in setting up the request that triggered an Error
  else if (error.message) {
    return error.message;
  }
  
  // Default error message
  return defaultMessage;
};

/**
 * Log errors to the console in development environment
 * @param {Error} error - Error object to log
 * @param {String} source - Source of the error (component/function name)
 */
export const logError = (error, source = '') => {
  if (process.env.NODE_ENV !== 'production') {
    console.error(`Error in ${source}:`, error);
  }
};