/**
 * Achievement API Service
 * Centralized API service for achievement operations
 */

// Base API configuration (should be moved to a global config)
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
const ACHIEVEMENTS_ENDPOINT = `${API_BASE_URL}/achievements`;

/**
 * HTTP request helper
 */
const apiRequest = async (url, options = {}) => {
  const token = localStorage.getItem('authToken'); // Adjust based on your auth implementation
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  const response = await fetch(url, { ...defaultOptions, ...options });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Network error' }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }
  
  return response.json();
};

/**
 * Achievement API Service
 */
export const achievementAPI = {
  /**
   * Get all achievements for the current user
   */
  getAllAchievements: async (filters = {}) => {
    const queryParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value);
      }
    });
    
    const url = queryParams.toString() 
      ? `${ACHIEVEMENTS_ENDPOINT}?${queryParams.toString()}`
      : ACHIEVEMENTS_ENDPOINT;
    
    return apiRequest(url);
  },

  /**
   * Get a specific achievement by ID
   */
  getAchievementById: async (id) => {
    return apiRequest(`${ACHIEVEMENTS_ENDPOINT}/${id}`);
  },

  /**
   * Create a new achievement
   */
  createAchievement: async (achievementData) => {
    return apiRequest(ACHIEVEMENTS_ENDPOINT, {
      method: 'POST',
      body: JSON.stringify(achievementData),
    });
  },

  /**
   * Update an existing achievement
   */
  updateAchievement: async (id, achievementData) => {
    return apiRequest(`${ACHIEVEMENTS_ENDPOINT}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(achievementData),
    });
  },

  /**
   * Delete an achievement
   */
  deleteAchievement: async (id) => {
    return apiRequest(`${ACHIEVEMENTS_ENDPOINT}/${id}`, {
      method: 'DELETE',
    });
  },

  /**
   * Upload achievement image
   */
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    
    const token = localStorage.getItem('authToken');
    
    return fetch(`${ACHIEVEMENTS_ENDPOINT}/upload`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    }).then(response => {
      if (!response.ok) {
        throw new Error('Upload failed');
      }
      return response.json();
    });
  },

  /**
   * Get achievement statistics
   */
  getStatistics: async () => {
    return apiRequest(`${ACHIEVEMENTS_ENDPOINT}/statistics`);
  },

  /**
   * Search achievements
   */
  searchAchievements: async (query, filters = {}) => {
    const searchParams = new URLSearchParams({
      q: query,
      ...filters,
    });
    
    return apiRequest(`${ACHIEVEMENTS_ENDPOINT}/search?${searchParams.toString()}`);
  },

  /**
   * Export achievements data
   */
  exportAchievements: async (format = 'json') => {
    const response = await fetch(`${ACHIEVEMENTS_ENDPOINT}/export?format=${format}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Export failed');
    }
    
    if (format === 'json') {
      return response.json();
    } else {
      return response.blob();
    }
  },
};

/**
 * React Query hooks (if using React Query)
 * These can be uncommented when React Query is integrated
 */

/*
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export const useAchievementsQuery = (filters = {}) => {
  return useQuery({
    queryKey: ['achievements', filters],
    queryFn: () => achievementAPI.getAllAchievements(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useAchievementQuery = (id) => {
  return useQuery({
    queryKey: ['achievement', id],
    queryFn: () => achievementAPI.getAchievementById(id),
    enabled: !!id,
  });
};

export const useCreateAchievementMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: achievementAPI.createAchievement,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['achievements'] });
    },
  });
};

export const useUpdateAchievementMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }) => achievementAPI.updateAchievement(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['achievements'] });
      queryClient.setQueryData(['achievement', variables.id], data);
    },
  });
};

export const useDeleteAchievementMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: achievementAPI.deleteAchievement,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['achievements'] });
    },
  });
};
*/

export default achievementAPI;
