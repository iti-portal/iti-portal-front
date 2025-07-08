import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

export const fetchCompanyProfile = () => {
  const token = localStorage.getItem('token');
  return axios.get(`${API_BASE_URL}/companies/my-profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};