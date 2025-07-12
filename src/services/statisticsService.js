import {
  API_BASE_URL,
  getAuthHeaders,
  handleApiResponse,
  handleNetworkError,
} from './apiConfig';

export const getGeneralStatistics = async () => {
  try {
    console.log('🔄 Fetching general statistics from API...');
    const response = await fetch(`${API_BASE_URL}/general-statistics`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    console.log('📊 Statistics API response status:', response.status);
    const result = await handleApiResponse(response);
    console.log('📊 Statistics API result:', result);
    
    return result;
  } catch (error) {
    console.error('❌ Statistics API error:', error);
    handleNetworkError(error);
    throw error; // Re-throw to allow caller to handle
  }
};
