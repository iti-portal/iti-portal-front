/**
 * Work Experience Service - Work experience management operations
 */

import { 
  API_BASE_URL, 
  getAuthHeaders, 
  handleApiResponse, 
  handleNetworkError 
} from './apiConfig';

/**
 * Add a new work experience
 */
export const addWorkExperience = async (experienceData) => {
  try {
    // Transform frontend data to match backend API
    const apiData = {
      company_name: experienceData.companyName || experienceData.company_name || experienceData.company,
      position: experienceData.position || experienceData.jobTitle || experienceData.title,
      start_date: experienceData.startDate || experienceData.start_date,
      end_date: experienceData.endDate || experienceData.end_date,
      is_current: experienceData.isCurrent || experienceData.is_current || false,
      description: experienceData.description || experienceData.jobDescription
    };

    // Remove undefined/null/empty values
    Object.keys(apiData).forEach(key => {
      if (apiData[key] === undefined || apiData[key] === null || apiData[key] === '') {
        delete apiData[key];
      }
    });


    const response = await fetch(`${API_BASE_URL}/user-work-experiences`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(apiData)
    });

    const result = await response.json();


    if (!response.ok) {
      throw new Error(result.message || 'Failed to add work experience');
    }

    // Transform the response data to match frontend expectations
    const transformedData = result.data ? {
      id: result.data.id,
      companyName: result.data.company_name,
      position: result.data.position,
      startDate: result.data.start_date,
      endDate: result.data.end_date,
      isCurrent: result.data.is_current,
      description: result.data.description,
      createdAt: result.data.created_at,
      updatedAt: result.data.updated_at,
      // Keep original fields for compatibility
      company_name: result.data.company_name,
      start_date: result.data.start_date,
      end_date: result.data.end_date,
      is_current: result.data.is_current,
      created_at: result.data.created_at,
      updated_at: result.data.updated_at
    } : null;

    return {
      success: true,
      data: transformedData,
      message: result.message || 'Work experience added successfully'
    };
  } catch (error) {
    handleNetworkError(error);
  }
};

/**
 * Update an existing work experience
 */
export const updateWorkExperience = async (experienceId, experienceData) => {
  try {
    // Transform frontend data to match backend API
    const apiData = {
      company_name: experienceData.companyName || experienceData.company_name || experienceData.company,
      position: experienceData.position || experienceData.jobTitle || experienceData.title,
      start_date: experienceData.startDate || experienceData.start_date,
      end_date: experienceData.endDate || experienceData.end_date,
      is_current: experienceData.isCurrent || experienceData.is_current || false,
      description: experienceData.description || experienceData.jobDescription
    };

    // Remove undefined/null/empty values
    Object.keys(apiData).forEach(key => {
      if (apiData[key] === undefined || apiData[key] === null || apiData[key] === '') {
        delete apiData[key];
      }
    });


    const response = await fetch(`${API_BASE_URL}/user-work-experiences/${experienceId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(apiData)
    });

    const result = await response.json();


    if (!response.ok) {
      throw new Error(result.message || 'Failed to update work experience');
    }

    // Transform the response data to match frontend expectations
    const transformedData = result.data ? {
      id: result.data.id,
      companyName: result.data.company_name,
      position: result.data.position,
      startDate: result.data.start_date,
      endDate: result.data.end_date,
      isCurrent: result.data.is_current,
      description: result.data.description,
      createdAt: result.data.created_at,
      updatedAt: result.data.updated_at,
      // Keep original fields for compatibility
      company_name: result.data.company_name,
      start_date: result.data.start_date,
      end_date: result.data.end_date,
      is_current: result.data.is_current,
      created_at: result.data.created_at,
      updated_at: result.data.updated_at
    } : null;

    return {
      success: true,
      data: transformedData,
      message: result.message || 'Work experience updated successfully'
    };
  } catch (error) {
    handleNetworkError(error);
  }
};

/**
 * Delete a work experience
 */
export const deleteWorkExperience = async (experienceId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/user-work-experiences/${experienceId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to delete work experience');
    }

    return {
      success: true,
      message: result.message || 'Work experience deleted successfully'
    };
  } catch (error) {
    handleNetworkError(error);
  }
};

/**
 * Get all work experiences for current user
 */
export const getUserWorkExperiences = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/user-work-experiences`, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    return await handleApiResponse(response);
  } catch (error) {
    handleNetworkError(error);
  }
};
