/**
 * API Configuration and Utilities
 * Shared configuration and helper functions for all service modules
 */

export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api';

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
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'API request failed');
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

  const baseUrl = 'http://127.0.0.1:8000';
  
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

  const baseUrl = 'http://127.0.0.1:8000';
  
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
