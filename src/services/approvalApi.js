import axios from 'axios';

const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`,
  Accept: 'application/json',
});

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/',
});

export const fetchPendingApprovals = () => {
  return api.get('admin/pending-users', {
    headers: getAuthHeaders(),
  });
};

export const approveUser = (id) => {
  return api.post(`admin/approve-user/${id}`, {}, {
    headers: getAuthHeaders(),
  });
};

export const rejectUser = (id) => {
  return api.post(`admin/reject-user/${id}`, {}, {
    headers: getAuthHeaders(),
  });
};