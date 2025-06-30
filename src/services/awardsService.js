/**
 * Awards Service - Awards management operations
 */

import { 
  API_BASE_URL, 
  getAuthHeaders, 
  handleApiResponse, 
  handleNetworkError 
} from './apiConfig';

/**
 * Add a new award
 */
export const addAward = async (awardData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/awards`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(awardData)
    });

    return await handleApiResponse(response);
  } catch (error) {
    handleNetworkError(error);
  }
};

/**
 * Update an existing award
 */
export const updateAward = async (awardId, awardData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/awards/${awardId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(awardData)
    });

    return await handleApiResponse(response);
  } catch (error) {
    handleNetworkError(error);
  }
};

/**
 * Delete an award
 */
export const deleteAward = async (awardId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/awards/${awardId}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'X-Requested-With': 'XMLHttpRequest'
      }
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to delete award');
    }

    return {
      success: true,
      message: result.message || 'Award deleted successfully'
    };
  } catch (error) {
    handleNetworkError(error);
  }
};
