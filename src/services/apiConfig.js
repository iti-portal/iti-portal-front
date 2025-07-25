/**
 * API Configuration and Utilities
 * Shared configuration and helper functions for all service modules
 */

export const API_BASE_URL = process.env.REACT_APP_API_URL ;
export const REACT_APP_API_ASSET_URL= process.env.REACT_APP_API_ASSET_URL;

/**
 * Get authentication headers for API requests
 */
export const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    throw new Error('No authentication token found');
  }

  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': `Bearer ${token}`,
    'X-Requested-With': 'XMLHttpRequest'
  };
};

/**
 * Get headers for file upload requests
 */
export const getFileUploadHeaders = () => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    throw new Error('No authentication token found');
  }

  return {
    'Accept': 'application/json',
    'Authorization': `Bearer ${token}`,
    'X-Requested-With': 'XMLHttpRequest'
  };
};

/**
 * Handle API response and errors
 */
export const handleApiResponse = async (response) => {
  if (response.status === 204 || response.headers.get('Content-Length') === '0') {
    return { success: true, data: null, message: 'Operation successful.' };
  }

  const result = await response.json();

  if (!response.ok) {
    // Handle validation errors (422) by showing all error details
    if (response.status === 422 && result.errors) {
      console.error('📛 Validation errors:', result.errors);
      
      const errorMessages = [];
      
      // Collect all validation error messages
      for (const field in result.errors) {
        if (Array.isArray(result.errors[field])) {
          result.errors[field].forEach(error => {
            // Format field names to be more user-friendly
            const fieldName = field.charAt(0).toUpperCase() + field.slice(1).replace('_', ' ');
            errorMessages.push(`${fieldName}: ${error}`);
          });
        } else {
          const fieldName = field.charAt(0).toUpperCase() + field.slice(1).replace('_', ' ');
          errorMessages.push(`${fieldName}: ${result.errors[field]}`);
        }
      }
      
      const errorMessage = errorMessages.length > 0 
        ? errorMessages.join('\n') 
        : (result.message || 'Validation failed');
      
      throw new Error(errorMessage);
    } else {
      console.error('❌ API error:', result);
      throw new Error(result.message || 'API request failed');
    }
  }

  return {
    success: true,
    data: result.data,
    message: result.message
  };
};

/**
 * Handle network errors
 */
export const handleNetworkError = (error) => {
  if (error.name === 'TypeError' && error.message.includes('fetch')) {
    throw new Error('Network error occurred. Please check your connection and try again.');
  }
  throw error;
};

/**
 * Helper function to construct profile picture URL with multiple fallbacks
 */
export const constructProfilePictureUrl = (picturePath) => {
  if (!picturePath || picturePath.startsWith('http')) {
    return picturePath;
  }

  // Use environment variable, removing /api for storage URLs
  const baseUrl = (process.env.REACT_APP_API_URL).replace('/api', '');
  
  // Return the most likely URL pattern for Laravel
  if (picturePath.startsWith('storage/')) {
    return `${baseUrl}/${picturePath}`;
  } else if (picturePath.startsWith('media/')) {
    return `${baseUrl}/${picturePath}`;
  } else {
    // Default: try storage path first (Laravel standard)
    return `${baseUrl}/storage/${picturePath}`;
  }
};

/**
 * Helper function to construct certificate image URL
 */
export const constructCertificateImageUrl = (imagePath) => {
  if (!imagePath || imagePath.startsWith('http')) {
    return imagePath;
  }

  const baseUrl = `${process.env.REACT_APP_API_URL_WITHOUT_API}`;
  
  // Return the most likely URL pattern for Laravel
  if (imagePath.startsWith('storage/')) {
    return `${baseUrl}/${imagePath}`;
  } else if (imagePath.startsWith('media/')) {
    return `${baseUrl}/${imagePath}`;
  } else {
    // Default: try storage path first (Laravel standard)
    return `${baseUrl}/storage/${imagePath}`;
  }
};
