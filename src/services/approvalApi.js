import axios from 'axios';

const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`,
  Accept: 'application/json',
});

const api = axios.create({
  baseURL: `${process.env.REACT_APP_API_URL}/`,
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