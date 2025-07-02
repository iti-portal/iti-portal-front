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
    queryParams.append('source', 'connections');

    const url = `${API_BASE_URL}/achievements?${queryParams.toString()}`;
    
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
    queryParams.append('sort', 'popular');

    const url = `${API_BASE_URL}/achievements?${queryParams.toString()}`;
    
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
    const response = await fetch(`${API_BASE_URL}/achievements`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(achievementData),
    });

    return await handleApiResponse(response);
  } catch (error) {
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

    return await handleApiResponse(response);
  } catch (error) {
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
