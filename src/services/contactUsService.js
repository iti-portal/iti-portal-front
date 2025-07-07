import { 
  API_BASE_URL, 
  getAuthHeaders, 
  handleApiResponse, 
  handleNetworkError 
} from './apiConfig';

export const addContact = async (contactData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/contact-us`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(contactData),
    });

    return await handleApiResponse(response);
  } catch (error) {
    handleNetworkError(error);
  }
};
