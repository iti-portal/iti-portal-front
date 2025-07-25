import axios from 'axios';

const BASE_URL = `${process.env.REACT_APP_API_URL}`;

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    Authorization: `Bearer ${token}`,
    Accept: 'application/json',
  };
};

export const fetchUsers = async (page = 1) => {
  const response = await axios.get(`${BASE_URL}/itians?page=${page}`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const approveUser = async (userId) => {
  const response = await axios.post(`${BASE_URL}/admin/approve-user/${userId}`, {}, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const suspendUser = async (userId) => {
  const response = await axios.post(`${BASE_URL}/admin/suspend-user/${userId}`, {}, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const unsuspendUser = async (userId) => {
  const response = await axios.post(`${BASE_URL}/admin/unsuspend-user/${userId}`, {}, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const deleteUser = async (userId) => {
  const response = await axios.delete(`${BASE_URL}/users/${userId}`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const fetchUserById = async (id) => {
  const response = await axios.get(`${BASE_URL}/profile/${id}`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const createConnection = async (userId, message) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/connections/connect`, 
      {
        user_id: Number(userId),
        message: message
      },
      {
        headers: getAuthHeaders(),
      }
    );
    return response.data;
  } catch (error) {
    console.error('API Error Details:', {
      config: error.config,
      response: error.response?.data,
      status: error.response?.status
    });
    throw error;
  }
};
