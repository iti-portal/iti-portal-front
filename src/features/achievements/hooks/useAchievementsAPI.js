/**
 * useAchievementsAPI Hook
 * Custom hook for managing achievements from different API sources
 */

import { useState, useEffect, useCallback } from 'react';
import { 
  getAllAchievements, 
  getConnectionsAchievements, 
  getPopularAchievements 
} from '../../../services/achievementsService';
import { transformAchievementsArray } from '../utils/dataTransform';

export const ACHIEVEMENT_SOURCES = {
  ALL: 'all',
  CONNECTIONS: 'connections', 
  POPULAR: 'popular'
};

export const useAchievementsAPI = () => {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentSource, setCurrentSource] = useState(ACHIEVEMENT_SOURCES.ALL);

  // Add delay to prevent rate limiting
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  // Fetch achievements based on source with retry logic
  const fetchAchievements = useCallback(async (source = ACHIEVEMENT_SOURCES.ALL, retryCount = 0) => {
    setLoading(true);
    setError(null);
    
    try {
      // Add delay to prevent rate limiting if this is a retry
      if (retryCount > 0) {
        await delay(2000 * retryCount); // Exponential backoff: 2s, 4s, 6s
      }
      
      let response;
      
      switch (source) {
        case ACHIEVEMENT_SOURCES.CONNECTIONS:
          response = await getConnectionsAchievements();
          break;
        case ACHIEVEMENT_SOURCES.POPULAR:
          response = await getPopularAchievements();
          break;
        case ACHIEVEMENT_SOURCES.ALL:
        default:
          response = await getAllAchievements();
          break;
      }
      
      // Handle different response structures
      // API returns: { success: true, data: { achievements: [...] } }
      let achievementsData;
      
      if (response.data && response.data.achievements) {
        achievementsData = response.data.achievements;
      } else if (response.achievements) {
        achievementsData = response.achievements;
      } else if (Array.isArray(response.data)) {
        achievementsData = response.data;
      } else if (Array.isArray(response)) {
        achievementsData = response;
      } else {
        achievementsData = [];
      }
      
      // Transform API data to component format
      const transformedData = transformAchievementsArray(achievementsData);
      setAchievements(transformedData);
      setCurrentSource(source);
      
      console.log(`Successfully loaded ${transformedData.length} achievements from ${source} source`);
      
    } catch (err) {
      console.error(`Error fetching ${source} achievements:`, err);
      
      // Retry logic for rate limiting
      if (err.message.includes('Too Many Attempts') && retryCount < 3) {
        console.log(`Rate limited, retrying in ${2 * (retryCount + 1)} seconds... (attempt ${retryCount + 1}/3)`);
        return fetchAchievements(source, retryCount + 1);
      }
      
      setError(err.message || 'Failed to fetch achievements');
      setAchievements([]);
    } finally {
      setLoading(false);
    }
  }, [delay]);

  // Switch between achievement sources with debouncing
  const switchToAll = useCallback(async () => {
    if (currentSource !== ACHIEVEMENT_SOURCES.ALL) {
      await delay(300); // Small delay to prevent rapid switching
      fetchAchievements(ACHIEVEMENT_SOURCES.ALL);
    }
  }, [fetchAchievements, currentSource, delay]);

  const switchToConnections = useCallback(async () => {
    if (currentSource !== ACHIEVEMENT_SOURCES.CONNECTIONS) {
      await delay(300); // Small delay to prevent rapid switching
      fetchAchievements(ACHIEVEMENT_SOURCES.CONNECTIONS);
    }
  }, [fetchAchievements, currentSource, delay]);

  const switchToPopular = useCallback(async () => {
    if (currentSource !== ACHIEVEMENT_SOURCES.POPULAR) {
      await delay(300); // Small delay to prevent rapid switching
      fetchAchievements(ACHIEVEMENT_SOURCES.POPULAR);
    }
  }, [fetchAchievements, currentSource, delay]);

  // Initial load - only load when component mounts
  useEffect(() => {
    let isMounted = true;
    
    const initialLoad = async () => {
      if (isMounted) {
        await delay(100); // Small initial delay
        fetchAchievements(ACHIEVEMENT_SOURCES.ALL);
      }
    };
    
    initialLoad();
    
    return () => {
      isMounted = false;
    };
  }, []); // Only run once on mount

  // Refresh current source
  const refresh = useCallback(() => {
    fetchAchievements(currentSource);
  }, [fetchAchievements, currentSource]);

  // Get statistics
  const getStatistics = useCallback(() => {
    const stats = {
      total: achievements.length,
      byType: {}
    };
    
    achievements.forEach(achievement => {
      const type = achievement.type || 'unknown';
      stats.byType[type] = (stats.byType[type] || 0) + 1;
    });
    
    return stats;
  }, [achievements]);

  return {
    // Data
    achievements,
    loading,
    error,
    currentSource,
    
    // Source switching
    switchToAll,
    switchToConnections, 
    switchToPopular,
    
    // Utilities
    refresh,
    getStatistics,
    
    // Manual control
    fetchAchievements,
    setAchievements
  };
};
