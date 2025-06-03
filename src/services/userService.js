import axios from 'axios';

const API_URL = '/api/users';

export const getUser = (id) => axios.get(`${API_URL}/${id}`);
export const updateUser = (id, data) => axios.put(`${API_URL}/${id}`, data);
