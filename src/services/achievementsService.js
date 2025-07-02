/**
 * Achievements Service
 * API service for managing achievements
 */

import { API_BASE_URL, getAuthHeaders, handleApiResponse } from './apiConfig';

/**
 * Get all achievements (public feed)
 */
export const getAchievements = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page);
    if (params.per_page) queryParams.append('per_page', params.per_page);
    if (params.type) queryParams.append('type', params.type);
    if (params.search) queryParams.append('search', params.search);

    const url = `${API_BASE_URL}/achievements${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    return await handleApiResponse(response);
  } catch (error) {
    throw new Error(`Failed to fetch achievements: ${error.message}`);
  }
};

/**
 * Get user's own achievements
 */
export const getMyAchievements = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page);
    if (params.per_page) queryParams.append('per_page', params.per_page);
    if (params.type) queryParams.append('type', params.type);
    if (params.search) queryParams.append('search', params.search);

    const url = `${API_BASE_URL}/my-achievements${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    return await handleApiResponse(response);
  } catch (error) {
    throw new Error(`Failed to fetch my achievements: ${error.message}`);
  }
};

/**
 * Get all achievements (alias for getAchievements for compatibility)
 */
export const getAllAchievements = async (page = 1, perPage = 25) => {
  return getAchievements({ page, per_page: perPage });
};

/**
 * Get achievements from user's connections/network
 */
export const getConnectionsAchievements = async (page = 1, perPage = 25) => {
  try {
    const queryParams = new URLSearchParams();
    queryParams.append('page', page);
    queryParams.append('per_page', perPage);

    const url = `${API_BASE_URL}/connections-achievements?${queryParams.toString()}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    return await handleApiResponse(response);
  } catch (error) {
    throw new Error(`Failed to fetch connections achievements: ${error.message}`);
  }
};

/**
 * Get popular achievements
 */
export const getPopularAchievements = async (page = 1, perPage = 25) => {
  try {
    const queryParams = new URLSearchParams();
    queryParams.append('page', page);
    queryParams.append('per_page', perPage);

    const url = `${API_BASE_URL}/popular-achievements?${queryParams.toString()}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    return await handleApiResponse(response);
  } catch (error) {
    throw new Error(`Failed to fetch popular achievements: ${error.message}`);
  }
};

/**
 * Create a new achievement
 */
export const createAchievement = async (achievementData) => {
  try {
    
    
    // Map 'certificate' type to 'certification' for backend compatibility
    const mappedType = mapFrontendTypeToBackend(achievementData.type);

    // Transform the data to match API expectations based on achievement type
    const baseData = {
      type: mappedType,
      title: achievementData.title,
    };

    // Add fields based on achievement type and map frontend fields to backend
    switch (achievementData.type) {
      case 'project':
        // Projects: title, description, project_url(nullable), achieved_at, end_date(nullable), image(nullable)
        if (!achievementData.start_date) {
          throw new Error('Start date is required for project achievements');
        }
        baseData.achieved_at = achievementData.start_date;
        baseData.description = achievementData.description || '';
        if (achievementData.url) baseData.project_url = achievementData.url;
        if (achievementData.end_date) baseData.end_date = achievementData.end_date;
        if (achievementData.image) baseData.image = achievementData.image;
        break;
        
      case 'job':
        // Job: title, description(nullable), organization, achieved_at
        if (!achievementData.organization) {
          throw new Error('Organization is required for job achievements');
        }
        if (!achievementData.start_date) {
          throw new Error('Start date is required for job achievements');
        }
        baseData.achieved_at = achievementData.start_date;
        baseData.organization = achievementData.organization;
        if (achievementData.description) baseData.description = achievementData.description;
        break;
        
      case 'certificate':
        // Certificate: title, description, organization, achieved_at, certificate_url(nullable), image(nullable)
        // Note: Frontend uses 'certificate' but backend expects 'certification' (handled in type mapping above)
        if (!achievementData.organization) {
          throw new Error('Organization is required for certificate achievements');
        }
        // Map issue_date to achieved_at for backend compatibility
        const certStartDate = achievementData.start_date || achievementData.issue_date;
        if (!certStartDate) {
          throw new Error('Start date is required for certificate achievements');
        }
        baseData.achieved_at = certStartDate;
        baseData.organization = achievementData.organization;
        baseData.description = achievementData.description || '';
        if (achievementData.url) baseData.certificate_url = achievementData.url;
        if (achievementData.image) baseData.image = achievementData.image;
        break;
        
      case 'award':
        // Award: title, description(nullable), organization, achieved_at, image(nullable)
        if (!achievementData.organization) {
          throw new Error('Organization is required for award achievements');
        }
        // Map received_date to achieved_at for backend compatibility
        const awardStartDate = achievementData.start_date || achievementData.received_date;
        if (!awardStartDate) {
          throw new Error('Start date is required for award achievements');
        }
        baseData.achieved_at = awardStartDate;
        baseData.organization = achievementData.organization;
        if (achievementData.description) baseData.description = achievementData.description;
        if (achievementData.image) baseData.image = achievementData.image;
        break;
        
      default:
        throw new Error(`Unsupported achievement type: ${achievementData.type}`);
    }



    const response = await fetch(`${API_BASE_URL}/achievements`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(baseData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API Error Response:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      throw new Error(`API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const result = await handleApiResponse(response);
    
    
    // Force refresh of achievements cache after creation
    try {
      // Clear any cached achievement data
      
    } catch (refreshError) {
      console.warn('Failed to refresh achievements after creation:', refreshError);
    }
    
    return result;
  } catch (error) {
    console.error('❌ Failed to create achievement:', error);
    throw new Error(`Failed to create achievement: ${error.message}`);
  }
};

/**
 * Update an achievement
 */
export const updateAchievement = async (id, achievementData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/achievements/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(achievementData),
    });

    return await handleApiResponse(response);
  } catch (error) {
    throw new Error(`Failed to update achievement: ${error.message}`);
  }
};

/**
 * Delete an achievement
 */
export const deleteAchievement = async (id) => {
  try {
    
    
    const response = await fetch(`${API_BASE_URL}/achievements/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    const result = await handleApiResponse(response);
    
    return result;
  } catch (error) {
    console.error('❌ Failed to delete achievement:', error);
    throw new Error(`Failed to delete achievement: ${error.message}`);
  }
};

/**
 * Get achievement details by ID
 */
export const getAchievementById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/achievements/${id}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    return await handleApiResponse(response);
  } catch (error) {
    throw new Error(`Failed to fetch achievement: ${error.message}`);
  }
};

/**
 * Like an achievement
 */
export const likeAchievement = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/achievements/${id}/like`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });

    return await handleApiResponse(response);
  } catch (error) {
    throw new Error(`Failed to like achievement: ${error.message}`);
  }
};

/**
 * Unlike an achievement
 */
export const unlikeAchievement = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/achievements/${id}/unlike`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });

    return await handleApiResponse(response);
  } catch (error) {
    throw new Error(`Failed to unlike achievement: ${error.message}`);
  }
};

/**
 * Add comment to an achievement
 */
export const addComment = async (achievementId, comment) => {
  try {
    const response = await fetch(`${API_BASE_URL}/achievements/${achievementId}/comments`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ comment }),
    });

    return await handleApiResponse(response);
  } catch (error) {
    throw new Error(`Failed to add comment: ${error.message}`);
  }
};

/**
 * Get comments for an achievement
 */
export const getComments = async (achievementId, params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page);
    if (params.per_page) queryParams.append('per_page', params.per_page);

    const url = `${API_BASE_URL}/achievements/${achievementId}/comments${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    return await handleApiResponse(response);
  } catch (error) {
    throw new Error(`Failed to fetch comments: ${error.message}`);
  }
};

/**
 * Delete a comment
 */
export const deleteComment = async (achievementId, commentId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/achievements/${achievementId}/comments/${commentId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    return await handleApiResponse(response);
  } catch (error) {
    throw new Error(`Failed to delete comment: ${error.message}`);
  }
};

/**
 * Map frontend achievement types to backend types
 * This function ensures compatibility between frontend and backend type naming
 */
export const mapFrontendTypeToBackend = (frontendType) => {
  // Map specific types that differ between frontend and backend
  const typeMap = {
    'certificate': 'certification', // Frontend uses 'certificate', backend expects 'certification'
  };
  
  return typeMap[frontendType] || frontendType;
};

/**
 * Map backend achievement types to frontend types
 * This function ensures compatibility between backend and frontend type naming
 */
export const mapBackendTypeToFrontend = (backendType) => {
  // Map specific types that differ between backend and frontend
  const typeMap = {
    'certification': 'certificate', // Backend returns 'certification', frontend uses 'certificate'
  };
  
  return typeMap[backendType] || backendType;
};
