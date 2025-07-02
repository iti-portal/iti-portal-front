/**
 * Achievements Service
 * API s    });
    
    const url = `http:    });
    
    const url = `http://localhost:8000/api/achievements/popular?${params.toString()}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    
    return await handleApiResponse(response);
  } catch (error) {
    throw error;
  }0/api/achievements/connections?${params.toString()}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    
    return await handleApiResponse(response);
  } catch (error) {
    throw error;
  }ging achievements with pagination and authentication
 */

import { API_BASE_URL, getAuthHeaders, handleApiResponse } from './apiConfig';

/**
 * Get all achievements with pagination
 */
export const getAllAchievements = async (page = 1, per_page = 25) => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      per_page: per_page.toString()
    });
    
    const url = `http://localhost:8000/api/achievements?${params.toString()}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    
    return await handleApiResponse(response);
  } catch (error) {
    throw error;
  }
};

/**
 * Get achievements from connections with pagination
 */
export const getConnectionsAchievements = async (page = 1, per_page = 20) => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      per_page: per_page.toString()
    });
    
    const url = `http://localhost:8000/api/connections-achievements?${params.toString()}`;
    
    
    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    
    return await handleApiResponse(response);
  } catch (error) {
    
    throw error;
  }
};

/**
 * Get popular achievements with pagination
 */
export const getPopularAchievements = async (page = 1, per_page = 20) => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      per_page: per_page.toString()
    });
    
    const url = `http://localhost:8000/api/popular-achievements?${params.toString()}`;
    
    
    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    
    return await handleApiResponse(response);
  } catch (error) {
    
    throw error;
  }
};

/**
 * Get achievement by ID
 */
export const getAchievementById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/achievements/${id}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    
    return await handleApiResponse(response);
  } catch (error) {
    
    throw error;
  }
};

/**
 * Create new achievement
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
    
    throw error;
  }
};

/**
 * Update achievement
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
    
    throw error;
  }
};

/**
 * Delete achievement
 */
export const deleteAchievement = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/achievements/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    
    return await handleApiResponse(response);
  } catch (error) {
    
    throw error;
  }
};
