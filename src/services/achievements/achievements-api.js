/**
 * Achievements API Service
 * Core CRUD operations for achievements
 */

import { API_BASE_URL, getAuthHeaders, handleApiResponse } from '../apiConfig';
import { mapFrontendTypeToBackend, transformAchievementData } from './achievements-utils';

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
 * Get a single achievement with full details
 */
export const getAchievementDetails = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/achievements/${id}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    return await handleApiResponse(response);
  } catch (error) {
    throw new Error(`Failed to fetch achievement details: ${error.message}`);
  }
};

/**
 * Create a new achievement
 */
export const createAchievement = async (achievementData) => {
  try {
    // Transform and validate the data
    const transformedData = transformAchievementData(achievementData);

    const response = await fetch(`${API_BASE_URL}/achievements`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(transformedData),
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
