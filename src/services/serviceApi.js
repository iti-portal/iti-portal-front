// You may already have a file like apiConfig.js. If not, this is a good pattern.
// For this example, we'll define the base URL directly.
import {API_BASE_URL} from './apiConfig';

/**
 * A helper function to handle API responses.
 * @param {Response} response - The raw response from the fetch call.
 * @returns {Promise<object>} The parsed JSON data.
 * @throws {Error} Throws an error if the response is not ok.
 */
const handleApiResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    // Use the error message from the API if available, otherwise a default message.
    throw new Error(data.message || `Request failed with status ${response.status}`);
  }
  return data;
};

/**
 * Creates a new service by making a POST request to the /service endpoint.
 * @param {object} serviceData - The data for the new service.
 * @param {string} serviceData.serviceType - The type of service (e.g., 'business_session').
 * @param {string} serviceData.title - The title of the service.
 * @param {string} serviceData.description - The description of the service.
 * @returns {Promise<object>} The response from the API, containing the new service data.
 */
export const createService = async (serviceData) => {
  const token = localStorage.getItem('token');
  if (!token) {
    // Immediately fail if the user is not authenticated.
    throw new Error('Authentication token not found. Please log in.');
  }

  try {
    const response = await fetch(`${API_BASE_URL}/service`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(serviceData) // Convert the JavaScript object to a JSON string
    });
    
    // The handleApiResponse function will check for errors and parse the JSON.
    return await handleApiResponse(response);
  } catch (error) {
    console.error('Error in createService API call:', error);
    // Re-throw the error so the component can catch it and display a message.
    throw error;
  }
};