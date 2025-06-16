/**
 * Admin API services for interacting with the backend
 */

/**
 * Base URL for admin API endpoints
 */
const BASE_URL = '/api/admin';

/**
 * Fetch admin dashboard statistics
 * @returns {Promise<Object>} Statistics data
 */
export const getAdminStats = async () => {
  try {
    const response = await fetch(`${BASE_URL}/stats`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch admin statistics');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching admin statistics:', error);
    throw error;
  }
};

/**
 * Fetch users list for admin
 * @param {Object} params Query parameters
 * @param {number} params.page Page number
 * @param {number} params.limit Users per page
 * @returns {Promise<Object>} Users data with pagination
 */
export const getUsers = async ({ page = 1, limit = 10 } = {}) => {
  try {
    const response = await fetch(`${BASE_URL}/users?page=${page}&limit=${limit}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};
