import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:8000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    Authorization: `Bearer ${token}`,
    Accept: 'application/json',
  };
};

export const getConnectedUsers = async (page = 1) => {
  const response = await axios.get(`${BASE_URL}/connections/connected?page=${page}`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const getPendingConnections = async (page = 1) => {
  const response = await axios.get(`${BASE_URL}/connections/pending?page=${page}`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const getSentConnections = async (page = 1) => {
  const response = await axios.get(`${BASE_URL}/connections/sent?page=${page}`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const acceptConnection = async (connectionId) => {
  const response = await axios.put(
    `${BASE_URL}/connections/accept`, 
    { connection_id: connectionId }, 
    { headers: getAuthHeaders() }
  );
  return response.data;
};

export const rejectConnection = async (connectionId) => {
  const response = await axios.put(
    `${BASE_URL}/connections/reject`, 
    { connection_id: connectionId }, 
    { headers: getAuthHeaders() }
  );
  return response.data;
};

export const disconnectConnection = async (userId) => {
  const response = await axios.delete(
    `${BASE_URL}/connections/disconnect`,
    {
      headers: getAuthHeaders(),
      data: { user_id: userId },
    }
  );
  return response.data;
};

