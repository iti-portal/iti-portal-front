import axios from 'axios';

export const initializeAPI = () => {
  const token = typeof window !== 'undefined' && window.localStorage 
    ? localStorage.getItem('token') 
    : 'demo-token'; // fallback for demo

  return axios.create({
    baseURL: 'http://127.0.0.1:8000/api/',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  });
};

export const fetchDashboardData = async () => {
  try {
    const api = initializeAPI();
    const response = await api.get('general-statistics');
    return response.data.data;
  } catch (err) {
    console.error('Error fetching data:', err);
    throw err;
  }
};
