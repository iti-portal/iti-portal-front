import axios from 'axios';

const API_URL = '/api/auth';

export const login = (credentials) => axios.post(`${API_URL}/login`, credentials);
export const register = (data) => axios.post(`${API_URL}/register`, data);
export const verifyEmail = (token) => axios.post(`${API_URL}/verify-email`, { token });
export const uploadNID = (formData) => axios.post(`${API_URL}/upload-nid`, formData, {
  headers: { 'Content-Type': 'multipart/form-data' },
});
