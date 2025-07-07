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

/**
 * Retrieve all unused services (requests)
 * @returns {Promise} Unused services data with pagination
 */
export const getUnusedServices = async () => {
  try {
    console.log('🔄 Fetching unused services...');
    
    const response = await fetch(`${API_BASE_URL}/unused-services`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    const result = await handleApiResponse(response);
    
    console.log('✅ Unused services retrieved successfully:', result);
    return result;
    
  } catch (error) {
    console.error('❌ Failed to retrieve unused services:', error);
    throw error;
  }
};

/**
 * Evaluate a service
 * @param {number} serviceId - Service ID
 * @param {string} evaluation - Evaluation status (positive, neutral, negative)
 * @param {string} feedback - Feedback text
 * @returns {Promise} Evaluation result
 */
export const evaluateService = async (serviceId, evaluation, feedback = '') => {
  try {
    console.log('🔄 Evaluating service...', { serviceId, evaluation, feedback });
    
    const response = await fetch(`${API_BASE_URL}/evaluate-service/${serviceId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        evaluation,
        feedback
      }),
    });

    const result = await handleApiResponse(response);
    
    console.log('✅ Service evaluated successfully:', result);
    return result;
    
  } catch (error) {
    console.error('❌ Failed to evaluate service:', error);
    throw error;
  }
};

/**
 * Delete a service
 * @param {number} serviceId - Service ID
 * @returns {Promise} Delete result
 */
export const deleteService = async (serviceId) => {
  try {
    console.log('🔄 Deleting service...', serviceId);
    
    const response = await fetch(`${API_BASE_URL}/delete-service/${serviceId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    const result = await handleApiResponse(response);
    
    console.log('✅ Service deleted successfully:', result);
    return result;
    
  } catch (error) {
    console.error('❌ Failed to delete service:', error);
    throw error;
  }
};
