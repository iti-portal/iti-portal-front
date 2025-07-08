import axios from 'axios';
import { API_BASE_URL, getAuthHeaders, handleNetworkError } from './apiConfig';

export const fetchMessages = async (conversationId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/conversations/${conversationId}/messages`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    handleNetworkError(error, 'Failed to fetch messages');
  }
};

export const sendMessage = async ({ receiver_id, body }) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/messages`, { receiver_id, body }, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    handleNetworkError(error, 'Failed to send message');
  }
};

export const fetchConnections = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/connections/connected`, {
      headers: getAuthHeaders(),
    });
    return response.data.data.data;
  } catch (error) {
    handleNetworkError(error, 'Failed to fetch connections');
  }
};

export const startConversation = async (userId) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/conversations`,
      { receiver_id: userId },
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    handleNetworkError(error, 'Failed to start conversation');
  }
};
  export const fetchConversations = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/conversations`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    handleNetworkError(error, 'Failed to fetch conversations');
  }

};