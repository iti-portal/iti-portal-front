/**
 * Services Service
 * Handles all services-related API calls
 */

import { API_BASE_URL, getAuthHeaders, handleApiResponse } from './apiConfig';

/**
 * Retrieve all used services
 * @returns {Promise} Services data with pagination
 */
export const getUsedServices = async () => {
  try {
    console.log('🔄 Fetching used services...');
    
    const response = await fetch(`${API_BASE_URL}/used-services`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    const result = await handleApiResponse(response);
    
    console.log('✅ Used services retrieved successfully:', result);
    return result;
    
  } catch (error) {
    console.error('❌ Failed to retrieve used services:', error);
    throw error;
  }
};

/**
 * Get alumni service details
 * @param {number} serviceId - Service ID
 * @returns {Promise} Service details
 */
export const getAlumniServiceDetails = async (serviceId) => {
  try {
    console.log('🔄 Fetching alumni service details...', serviceId);
    
    const response = await fetch(`${API_BASE_URL}/alumni-service/${serviceId}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    const result = await handleApiResponse(response);
    
    console.log('✅ Alumni service details retrieved successfully:', result);
    return result;
    
  } catch (error) {
    console.error('❌ Failed to retrieve alumni service details:', error);
    throw error;
  }
};
