/**
 * Education Service - Education CRUD operations
 */

import { 
  API_BASE_URL, 
  getAuthHeaders, 
  handleApiResponse, 
  handleNetworkError 
} from './apiConfig';

/**
 * Add new education entry
 */
export const addEducation = async (educationData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/education/add`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(educationData)
    });

    return await handleApiResponse(response);
  } catch (error) {
    handleNetworkError(error);
  }
};

/**
 * Update an existing education entry
 */
export const updateEducation = async (educationId, educationData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/education/${educationId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(educationData)
    });

    return await handleApiResponse(response);
  } catch (error) {
    handleNetworkError(error);
  }
};

/**
 * Delete an education entry
 */
export const deleteEducation = async (educationId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/education/${educationId}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'X-Requested-With': 'XMLHttpRequest'
      }
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to delete education');
    }

    return {
      success: true,
      message: result.message || 'Education deleted successfully'
    };
  } catch (error) {
    handleNetworkError(error);
  }
};
