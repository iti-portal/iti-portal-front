/**
 * Achievements Service
 * API service for managing achievements with authentication
 */

import { API_BASE_URL, getAuthHeaders, handleApiResponse } from './apiConfig';

/**
 * Get all achievements
 */
export const getAllAchievements = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/achievements`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    
    return await handleApiResponse(response);
  } catch (error) {
    console.error('Error fetching all achievements:', error);
    throw error;
  }
};

/**
 * Get achievements from connections
 */
export const getConnectionsAchievements = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/connections-achievements`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    
    return await handleApiResponse(response);
  } catch (error) {
    console.error('Error fetching connections achievements:', error);
    throw error;
  }
};

/**
 * Get popular achievements
 */
export const getPopularAchievements = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/popular-achievements`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    
    return await handleApiResponse(response);
  } catch (error) {
    console.error('Error fetching popular achievements:', error);
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
    console.error(`Error fetching achievement ${id}:`, error);
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
    console.error('Error creating achievement:', error);
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
    console.error(`Error updating achievement ${id}:`, error);
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
    console.error(`Error deleting achievement ${id}:`, error);
    throw error;
  }
};
