import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:8000/api',
});

const getToken = () => localStorage.getItem('token');

export const fetchAllSkills = async () => {
  const token = getToken();
  if (!token) {
    return [];
  }

  try {
    const response = await apiClient.get('/skills/', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const skillsData = response.data.data;
    if (Array.isArray(skillsData)) {
      return skillsData.map(skill => skill.name);
    } else {
      console.error("API response for skills was not an array.", response.data);
      throw new Error("Received an unexpected skill format from the server.");
    }
  } catch (error) {
    console.error('Failed to fetch skills:', error);
    throw new Error('Could not load skills from the server.');
  }
};

export const addNewSkill = async (newSkillName) => {
  const token = getToken();
  if (!token) {
    throw new Error('Authentication required to add a new skill.');
  }

  const skillFormData = new FormData();
  skillFormData.append('skill_name', newSkillName);

  try {
    await apiClient.post('/user-skills/', skillFormData, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  } catch (error) {
    console.error('Failed to add new skill:', error.response?.data || error.message);
    const errorMessage = error.response?.data?.message || 'Could not add the new skill.';
    throw new Error(errorMessage);
  }
};

export const postNewJob = async (jobData) => {
    const token = getToken();
    if (!token) {
        throw new Error('No authentication token found. Please login first.');
    }

    try {
        const response = await apiClient.post('/company/jobs/', jobData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        });
        return response.data;
    } catch (error) {
        console.error('Job posting failed:', error.response?.data || error.message);
        const errorMessage = error.response?.data?.message || error.response?.data?.detail || 'An unexpected error occurred while posting the job.';
        throw new Error(errorMessage);
    }
};
