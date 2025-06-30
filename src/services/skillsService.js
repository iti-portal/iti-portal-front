/**
 * Skills Service - Skills management operations
 */

import { 
  API_BASE_URL, 
  getAuthHeaders, 
  handleApiResponse, 
  handleNetworkError 
} from './apiConfig';

/**
 * Add a new user skill
 */
export const addUserSkill = async (skillName) => {
  try {
    const response = await fetch(`${API_BASE_URL}/user-skills/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ skill_name: skillName })
    });

    return await handleApiResponse(response);
  } catch (error) {
    handleNetworkError(error);
  }
};

/**
 * Delete a user skill
 */
export const deleteUserSkill = async (skillId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/user-skills/${skillId}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'X-Requested-With': 'XMLHttpRequest'
      }
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to delete skill');
    }

    return {
      success: true,
      message: result.message || 'Skill deleted successfully'
    };
  } catch (error) {
    handleNetworkError(error);
  }
};
