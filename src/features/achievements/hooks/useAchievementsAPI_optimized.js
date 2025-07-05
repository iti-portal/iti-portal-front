/**
 * useAchievementsAPI Hook - Optimized Version
 * Custom hook for managing achievements with lazy loading pagination
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  getAllAchievements, 
  getConnectionsAchievements, 
  getPopularAchievements 
} from '../../../services/achievementsService';

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

  // Use refs to prevent unnecessary re-renders
  const isRequestingRef = useRef(false);
  const lastRequestTimeRef = useRef(0);
  const initializedRef = useRef(false);
  const ITEMS_PER_PAGE = 25;
  const MIN_REQUEST_INTERVAL = 1000; // 1 second minimum between requests

  // Transform API response data to component format
  const transformAchievement = (achievement) => {
    return {
      id: achievement.id,
      type: achievement.type || 'achievement',
      title: achievement.title,
      description: achievement.description,
      user: {
        id: achievement.user_id,
        name: `${achievement.user_profile?.first_name || ''} ${achievement.user_profile?.last_name || ''}`.trim() || 'Unknown User',
        profile_picture: achievement.user_profile?.profile_picture,
        first_name: achievement.user_profile?.first_name,
        last_name: achievement.user_profile?.last_name
      },
      date: achievement.created_at,
      created_at: achievement.created_at,
      like_count: achievement.like_count || 0,
      is_liked: achievement.is_liked || false,
      comment_count: achievement.comment_count || 0,
      comments: achievement.comments || [],
      likes: achievement.likes || []
    };
  };

  // Fetch achievements with pagination
  const fetchAchievements = async (source, page = 1, append = false) => {
    if (isRequestingRef.current) {
      return;
    }

    // Rate limiting: ensure minimum interval between requests
    const now = Date.now();
    const timeSinceLastRequest = now - lastRequestTimeRef.current;
    
    if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
      const delay = MIN_REQUEST_INTERVAL - timeSinceLastRequest;
      await new Promise(resolve => setTimeout(resolve, delay));
    }

    isRequestingRef.current = true;
    lastRequestTimeRef.current = Date.now();
    
    if (append) {
      setLoadingMore(true);
    } else {
      setLoading(true);
      setError(null);
    }

    try {
      
      let response;
      switch (source) {
        case ACHIEVEMENT_SOURCES.CONNECTIONS:
          response = await getConnectionsAchievements(page, ITEMS_PER_PAGE);
          break;
        case ACHIEVEMENT_SOURCES.POPULAR:
          response = await getPopularAchievements(page, ITEMS_PER_PAGE);
          break;
        case ACHIEVEMENT_SOURCES.ALL:
        default:
          response = await getAllAchievements(page, ITEMS_PER_PAGE);
          break;
      }


      // Handle the response structure
      let achievementsData = [];
      let paginationData = null;

      if (response?.success && response?.data?.achievements) {
        achievementsData = response.data.achievements;
        paginationData = response.data.pagination || {
          current_page: page,
          per_page: ITEMS_PER_PAGE,
          total: achievementsData.length
        };
      } else if (response?.data && Array.isArray(response.data)) {
        achievementsData = response.data;
      } else if (Array.isArray(response)) {
        achievementsData = response;
      } else {
        console.warn('Unexpected response format:', response);
        achievementsData = [];
      }

      // Transform achievements
      const transformedAchievements = achievementsData.map(transformAchievement);

      if (append) {
        // Append new achievements (lazy loading)
        setAchievements(prev => {
          const existingIds = new Set(prev.map(item => item.id));
          const newItems = transformedAchievements.filter(item => !existingIds.has(item.id));
          return [...prev, ...newItems];
        });
      } else {
        // Replace achievements (new source or refresh)
        setAchievements(transformedAchievements);
      }

      // Update pagination state
      setPagination(paginationData);
      setCurrentPage(page);
      setCurrentSource(source);

      // Determine if there are more pages
      const hasMoreItems = paginationData 
        ? paginationData.current_page < (paginationData.last_page || Math.ceil(paginationData.total / ITEMS_PER_PAGE))
        : transformedAchievements.length >= ITEMS_PER_PAGE;
      
      setHasMore(hasMoreItems);


    } catch (err) {
      console.error(`❌ Error fetching ${source} achievements:`, err);
      
      // Handle rate limiting specifically
      if (err.message && err.message.includes('Too Many Attempts')) {
        setError('Rate limit exceeded. Please wait a moment before trying again.');
        
        // Auto-retry after a longer delay for rate limiting
        if (!append) {
          setTimeout(() => {
            if (!isRequestingRef.current) {
              fetchAchievements(source, page, append);
            }
          }, 3000);
        }
      } else {
        setError(err.message || 'Failed to fetch achievements');
      }
      
      if (!append) {
        setAchievements([]);
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
      isRequestingRef.current = false;
    }
  };

  // Load more achievements for infinite scroll
  const loadMore = useCallback(async () => {
    if (!loadingMore && hasMore && !isRequestingRef.current) {
      const nextPage = currentPage + 1;
      await fetchAchievements(currentSource, nextPage, true);
    }
  }, [currentSource, currentPage, loadingMore, hasMore]);

  // Switch to All achievements
  const switchToAll = useCallback(async () => {
    if (currentSource !== ACHIEVEMENT_SOURCES.ALL) {
      setCurrentPage(1);
      setHasMore(true);
      await fetchAchievements(ACHIEVEMENT_SOURCES.ALL, 1, false);
    }
  }, [currentSource]);

  // Switch to Connections achievements
  const switchToConnections = useCallback(async () => {
    if (currentSource !== ACHIEVEMENT_SOURCES.CONNECTIONS) {
      setCurrentPage(1);
      setHasMore(true);
      await fetchAchievements(ACHIEVEMENT_SOURCES.CONNECTIONS, 1, false);
    }
  }, [currentSource]);

  // Switch to Popular achievements
  const switchToPopular = useCallback(async () => {
    if (currentSource !== ACHIEVEMENT_SOURCES.POPULAR) {
      setCurrentPage(1);
      setHasMore(true);
      await fetchAchievements(ACHIEVEMENT_SOURCES.POPULAR, 1, false);
    }
  }, [currentSource]);

  // Refresh current source
  const refresh = useCallback(async () => {
    setCurrentPage(1);
    setHasMore(true);
    await fetchAchievements(currentSource, 1, false);
  }, [currentSource]);

  // Initial load - Only run once
  useEffect(() => {
    if (!initializedRef.current) {
      initializedRef.current = true;
      fetchAchievements(ACHIEVEMENT_SOURCES.ALL, 1, false);
    }
  }, []); // Empty dependency array - runs only once

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
    
    // Actions
    switchToAll,
    switchToConnections, 
    switchToPopular,
    loadMore,
    refresh,
    
    // Utilities
    getStatistics
  };
};
