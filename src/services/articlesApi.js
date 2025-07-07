import axios from 'axios';

const API_BASE = 'http://127.0.0.1:8000/api/articles';

const getToken = () => localStorage.getItem('token');

const headers = () => ({
  Authorization: `Bearer ${getToken()}`,
  'Content-Type': 'application/json',
});

// GET all articles
export const fetchAllArticles = () =>
  axios.get(`${API_BASE}/all`, { headers: headers() });

// DELETE an article
export const deleteArticle = (id) =>
  axios.delete(`${API_BASE}/${id}`, { headers: headers() });

// Publish article
export const publishArticle = (id) =>
  axios.post(`${API_BASE}/${id}/publish`, null, { headers: headers() });

// Archive article
export const archiveArticle = (id) =>
  axios.post(`${API_BASE}/${id}/archive`, null, { headers: headers() });

// Unarchive article
export const unarchiveArticle = (id) =>
  axios.post(`${API_BASE}/${id}/unarchive`, null, { headers: headers() });

// Update article
export const updateArticle = (id, data) =>
  axios.put(`${API_BASE}/${id}`, data, { headers: headers() });

// Create new article
export const createArticle = (formData) =>
  axios.post(`${API_BASE}/add`, formData, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
      'Content-Type': 'multipart/form-data',
    },
  });

