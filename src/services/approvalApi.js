import axios from 'axios';

const token = localStorage.getItem('token');

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/',
  headers: {
    Authorization: `Bearer ${token}`,
    Accept: 'application/json',
  },
});

export const fetchPendingApprovals = () => {
  return api.get('admin/pending-users');
};

export const approveUser = (id) => {
  return api.post(`admin/approve-user/${id}`);
};

export const rejectUser = (id) => {
  return api.post(`admin/reject-user/${id}`);
};