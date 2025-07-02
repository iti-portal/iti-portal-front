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
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [currentSource, setCurrentSource] = useState(ACHIEVEMENT_SOURCES.ALL);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [pagination, setPagination] = useState(null);

  // Add delay to prevent rate limiting
  const delay = useCallback((ms) => new Promise(resolve => setTimeout(resolve, ms)), []);

  // Fetch achievements based on source with retry logic
  const fetchAchievements = useCallback(async (source = ACHIEVEMENT_SOURCES.ALL, page = 1, append = false, retryCount = 0) => {
    const isFirstLoad = page === 1 && !append;
    
    if (isFirstLoad) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }
    setError(null);
    
    try {
      // Add delay to prevent rate limiting if this is a retry
      if (retryCount > 0) {
        await delay(2000 * retryCount); // Exponential backoff: 2s, 4s, 6s
      }
      
      let response;
      const limit = 20; // Load 20 items per page for optimal performance
      
      switch (source) {
        case ACHIEVEMENT_SOURCES.CONNECTIONS:
          response = await getConnectionsAchievements(page, limit);
          break;
        case ACHIEVEMENT_SOURCES.POPULAR:
          response = await getPopularAchievements(page, limit);
          break;
        case ACHIEVEMENT_SOURCES.ALL:
        default:
          response = await getAllAchievements(page, limit);
          break;
      }
      
      // Handle different response structures
      // API returns: { success: true, data: { achievements: [...], pagination: {...} } }
      let achievementsData = [];
      let paginationData = null;
      
      if (response.data && response.data.achievements) {
        achievementsData = response.data.achievements;
        paginationData = response.data.pagination || response.pagination;
      } else if (response.achievements) {
        achievementsData = response.achievements;
        paginationData = response.pagination;
      } else if (Array.isArray(response.data)) {
        achievementsData = response.data;
      } else if (Array.isArray(response)) {
        achievementsData = response;
      }
      
      // Transform API data to component format
      const transformedData = transformAchievementsArray(achievementsData);
      
      if (append && page > 1) {
        // Append new data for infinite scroll
        setAchievements(prev => {
          // Filter out duplicates based on ID
          const existingIds = new Set(prev.map(item => item.id));
          const newItems = transformedData.filter(item => !existingIds.has(item.id));
          return [...prev, ...newItems];
        });
      } else {
        // Replace data for new source or first page
        setAchievements(transformedData);
      }
      
      // Update pagination info
      setPagination(paginationData);
      setCurrentPage(page);
      setCurrentSource(source);
      
      // Check if there are more pages
      if (paginationData) {
        setHasMore(paginationData.current_page < paginationData.last_page);
      } else {
        // Fallback: assume no more if we got less than requested
        setHasMore(transformedData.length >= limit);
      }
      
      console.log(`Successfully loaded ${transformedData.length} achievements from ${source} source (page ${page})`);
      
    } catch (err) {
      console.error(`Error fetching ${source} achievements:`, err);
      
      // Retry logic for rate limiting
      if (err.message.includes('Too Many Attempts') && retryCount < 3) {
        console.log(`Rate limited, retrying in ${2 * (retryCount + 1)} seconds... (attempt ${retryCount + 1}/3)`);
        return fetchAchievements(source, page, append, retryCount + 1);
      }
      
      setError(err.message || 'Failed to fetch achievements');
      if (!append) {
        setAchievements([]);
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [delay]);

  // Load more achievements for the current source
  const loadMore = useCallback(async () => {
    if (!loadingMore && hasMore) {
      const nextPage = currentPage + 1;
      await fetchAchievements(currentSource, nextPage, true);
    }
  }, [fetchAchievements, currentSource, currentPage, loadingMore, hasMore]);

  // Switch between achievement sources with debouncing - resets pagination
  const switchToAll = useCallback(async () => {
    if (currentSource !== ACHIEVEMENT_SOURCES.ALL) {
      await delay(300); // Small delay to prevent rapid switching
      setCurrentPage(1);
      setHasMore(true);
      fetchAchievements(ACHIEVEMENT_SOURCES.ALL, 1, false);
    }
  }, [fetchAchievements, currentSource, delay]);

  const switchToConnections = useCallback(async () => {
    if (currentSource !== ACHIEVEMENT_SOURCES.CONNECTIONS) {
      await delay(300); // Small delay to prevent rapid switching
      setCurrentPage(1);
      setHasMore(true);
      fetchAchievements(ACHIEVEMENT_SOURCES.CONNECTIONS, 1, false);
    }
  }, [fetchAchievements, currentSource, delay]);

  const switchToPopular = useCallback(async () => {
    if (currentSource !== ACHIEVEMENT_SOURCES.POPULAR) {
      await delay(300); // Small delay to prevent rapid switching
      setCurrentPage(1);
      setHasMore(true);
      fetchAchievements(ACHIEVEMENT_SOURCES.POPULAR, 1, false);
    }
  }, [fetchAchievements, currentSource, delay]);

  // Initial load - only load when component mounts
  useEffect(() => {
    let isMounted = true;
    
    const initialLoad = async () => {
      if (isMounted) {
        await delay(100); // Small initial delay
        fetchAchievements(ACHIEVEMENT_SOURCES.ALL, 1, false);
      }
    };
    
    initialLoad();
    
    return () => {
      isMounted = false;
    };
  }, []); // Only run once on mount

  // Refresh current source - resets to page 1
  const refresh = useCallback(() => {
    setCurrentPage(1);
    setHasMore(true);
    fetchAchievements(currentSource, 1, false);
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
    loadingMore,
    error,
    currentSource,
    currentPage,
    hasMore,
    pagination,
    
    // Source switching
    switchToAll,
    switchToConnections, 
    switchToPopular,
    
    // Infinite scroll
    loadMore,
    
    // Utilities
    refresh,
    getStatistics,
    
    // Manual control
    fetchAchievements,
    setAchievements
  };
};
