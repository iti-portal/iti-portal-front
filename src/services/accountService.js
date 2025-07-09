/**
 * Account Service Layer
 * API calls for account management (email and password updates)
 */

import { 
  API_BASE_URL, 
  getAuthHeaders, 
  handleApiResponse, 
  handleNetworkError 
} from './apiConfig';

/**
 * Update user email
 */
export const updateEmail = async (emailData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/account-email`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(emailData)
    });

    return await handleApiResponse(response);
  } catch (error) {
    handleNetworkError(error);
  }
};

/**
 * Update user password
 */
export const updatePassword = async (passwordData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/account-password`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(passwordData)
    });

    return await handleApiResponse(response);
  } catch (error) {
    handleNetworkError(error);
  }
};
