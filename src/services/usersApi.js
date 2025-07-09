import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:8000/api';

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
