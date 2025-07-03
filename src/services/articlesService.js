/**
 * Articles Service
 * API operations for articles
 */

import { API_BASE_URL, getAuthHeaders, handleApiResponse } from './apiConfig';

/**
 * Get popular articles
 */
export const getPopularArticles = async (limit = 4) => {
  try {
    const url = `${API_BASE_URL}/articles/popular`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    return await handleApiResponse(response);
  } catch (error) {
    throw new Error(`Failed to fetch popular articles: ${error.message}`);
  }
};

/**
 * Get all articles with pagination
 */
export const getArticles = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page);
    if (params.per_page) queryParams.append('per_page', params.per_page);
    if (params.search) queryParams.append('search', params.search);

    const url = `${API_BASE_URL}/articles${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    return await handleApiResponse(response);
  } catch (error) {
    throw new Error(`Failed to fetch articles: ${error.message}`);
  }
};

/**
 * Get single article by ID
 */
export const getArticle = async (id) => {
  try {
    const url = `${API_BASE_URL}/articles/${id}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    return await handleApiResponse(response);
  } catch (error) {
    throw new Error(`Failed to fetch article: ${error.message}`);
  }
};

/**
 * Like/Unlike an article
 */
export const toggleArticleLike = async (articleId) => {
  try {
    const url = `${API_BASE_URL}/articles/${articleId}/like`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: getAuthHeaders(),
    });

    return await handleApiResponse(response);
  } catch (error) {
    throw new Error(`Failed to toggle article like: ${error.message}`);
  }
};
