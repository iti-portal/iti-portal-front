import axios from 'axios';

const API_URL = '/api/jobs';

export const getJobs = () => axios.get(API_URL);
export const applyJob = (jobId, data) => axios.post(`${API_URL}/${jobId}/apply`, data);
