import { API_BASE_URL } from './apiConfig';

/**
 * A helper function to handle API responses and errors consistently.
 * @param {Response} response - The raw response from the fetch call.
 * @returns {Promise<object>} The parsed JSON data.
 * @throws {Error} Throws an error if the response is not successful.
 */
const handleApiResponse = async (response) => {
  const data = await response.json();
  // Check for a non-ok HTTP status or a `success: false` flag in the API response body.
  if (!response.ok || !data.success) {
    const errorMessage = data.message || `Request failed with status ${response.status}`;
    throw new Error(errorMessage);
  }
  return data;
};

/**
 * Retrieves the authentication token from localStorage.
 * @throws {Error} If the token is not found.
 * @returns {string} The bearer token.
 */
const getAuthToken = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Authentication token not found. Please log in.');
  }
  return `Bearer ${token}`;
};

/**
 * Fetches all services for the authenticated user.
 * @returns {Promise<object>} The API response containing the list of services.
 */
export const getMyServices = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/service`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': getAuthToken(),
      },
    });
    return await handleApiResponse(response);
  } catch (error) {
    console.error('Error in getMyServices API call:', error);
    throw error; // Re-throw to be caught by the component
  }
};

/**
 * Creates a new service.
 * @param {object} serviceData - { serviceType, title, description }
 * @returns {Promise<object>} The API response containing the new service.
 */
export const createService = async (serviceData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/service`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': getAuthToken(),
      },
      body: JSON.stringify(serviceData),
    });
    return await handleApiResponse(response);
  } catch (error) {
    console.error('Error in createService API call:', error);
    throw error;
  }
};

/**
 * Updates an existing service.
 * @param {object} serviceData - { id, serviceType, title, description }
 * @returns {Promise<object>} The API response containing the updated service.
 */
export const updateService = async (serviceData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/service`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': getAuthToken(),
      },
      body: JSON.stringify(serviceData),
    });
    return await handleApiResponse(response);
  } catch (error) {
    console.error('Error in updateService API call:', error);
    throw error;
  }
};

/**
 * Deletes a service by its ID.
 * @param {number} serviceId - The ID of the service to delete.
 * @returns {Promise<object>} The API confirmation response.
 */
export const deleteService = async (serviceId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/service/${serviceId}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Authorization': getAuthToken(),
      },
    });
    return await handleApiResponse(response);
  } catch (error) {
    console.error('Error in deleteService API call:', error);
    throw error;
  }
};