/**
 * Project Service - Project management operations
 */

import { 
  API_BASE_URL, 
  getAuthHeaders, 
  handleApiResponse, 
  handleNetworkError 
} from './apiConfig';

/**
 * Add a new project with images
 */
export const addProject = async (projectData) => {
  try {
    const formData = new FormData();
    
    // Add project fields
    formData.append('title', projectData.title || '');
    formData.append('technologies_used', projectData.technologiesUsed || projectData.technologies_used || '');
    formData.append('description', projectData.description || '');
    formData.append('project_url', projectData.projectUrl || projectData.project_url || '');
    formData.append('github_url', projectData.githubUrl || projectData.github_url || '');
    formData.append('start_date', projectData.startDate || projectData.start_date || '');
    formData.append('end_date', projectData.endDate || projectData.end_date || '');
    formData.append('is_featured', projectData.isFeatured || projectData.is_featured || false);

    // Add images with alt texts and orders
    if (projectData.images && projectData.images.length > 0) {
      projectData.images.forEach((imageData, index) => {
        if (imageData.file) {
          formData.append(`images[${index}]`, imageData.file);
          formData.append(`alt_texts[${index}]`, imageData.altText || '');
          formData.append(`orders[${index}]`, imageData.order || index + 1);
        }
      });
    }

    const response = await fetch(`${API_BASE_URL}/projects`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: formData
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to add project');
    }

    return {
      success: true,
      data: result.data,
      message: result.message || 'Project added successfully'
    };
  } catch (error) {
    console.error('Error adding project:', error);
    throw error;
  }
};

/**
 * Update an existing project
 */
export const updateProject = async (projectId, projectData) => {
  try {
    const formData = new FormData();
    formData.append('_method', 'PUT');
    
    // Add project fields
    formData.append('title', projectData.title || '');
    formData.append('technologies_used', projectData.technologiesUsed || projectData.technologies_used || '');
    formData.append('description', projectData.description || '');
    formData.append('project_url', projectData.projectUrl || projectData.project_url || '');
    formData.append('github_url', projectData.githubUrl || projectData.github_url || '');
    formData.append('start_date', projectData.startDate || projectData.start_date || '');
    formData.append('end_date', projectData.endDate || projectData.end_date || '');
    formData.append('is_featured', projectData.isFeatured || projectData.is_featured || false);

    // Add new images if provided
    if (projectData.images && projectData.images.length > 0) {
      projectData.images.forEach((imageData, index) => {
        if (imageData.file) {
          formData.append(`images[${index}]`, imageData.file);
          formData.append(`alt_texts[${index}]`, imageData.altText || '');
          formData.append(`orders[${index}]`, imageData.order || index + 1);
        }
      });
    }

    const response = await fetch(`${API_BASE_URL}/projects/${projectId}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: formData
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to update project');
    }

    return {
      success: true,
      data: result.data,
      message: result.message || 'Project updated successfully'
    };
  } catch (error) {
    console.error('Error updating project:', error);
    throw error;
  }
};

/**
 * Delete a project
 */
export const deleteProject = async (projectId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/projects/${projectId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
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
    console.error('Error deleting project:', error);
    throw error;
  }
};

/**
 * Get all projects for current user
 */
export const getUserProjects = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/projects`, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    return await handleApiResponse(response);
  } catch (error) {
    handleNetworkError(error);
  }
};
