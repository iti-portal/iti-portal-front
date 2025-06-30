/**
 * Projects Service - Projects management operations
 */

import { 
  API_BASE_URL, 
  getAuthHeaders, 
  handleApiResponse, 
  handleNetworkError 
} from './apiConfig';

/**
 * Add a new project
 */
export const addProject = async (formData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/projects/new-project`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'X-Requested-With': 'XMLHttpRequest'
        // DO NOT set 'Content-Type' here!
      },
      body: formData
    });

    return await handleApiResponse(response);
  } catch (error) {
    handleNetworkError(error);
  }
};

/**
 * Update an existing project
 */
export const updateProject = async (projectId, projectData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/projects/${projectId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(projectData)
    });

    return await handleApiResponse(response);
  } catch (error) {
    handleNetworkError(error);
  }
};

/**
 * Delete a project
 */
export const deleteProject = async (projectId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/projects/${projectId}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'X-Requested-With': 'XMLHttpRequest'
      }
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to delete project');
    }

    return {
      success: true,
      message: result.message || 'Project deleted successfully'
    };
  } catch (error) {
    handleNetworkError(error);
  }
};
