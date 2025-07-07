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

export const deleteContactSubmission = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/contact-us/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    return await handleApiResponse(response);
  } catch (error) {
    handleNetworkError(error);
  }
};

export const getContactSubmissions = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/contact-us`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    return await handleApiResponse(response);
  } catch (error) {
    handleNetworkError(error);
  }
};
