/**
 * useAchievementsAPI Hook
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

  // Use ref to prevent duplicate requests
  const isRequestingRef = useRef(false);
  const ITEMS_PER_PAGE = 25;

  // Transform API response data to component format
  const transformAchievement = useCallback((achievement) => {
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
  }, []);

  // Fetch achievements with pagination
  const fetchAchievements = useCallback(async (source = ACHIEVEMENT_SOURCES.ALL, page = 1, append = false) => {
    // Prevent duplicate requests
    if (isRequestingRef.current) {
      return;
    }

    isRequestingRef.current = true;
    const isFirstLoad = page === 1 && !append;
    
    if (isFirstLoad) {
      setLoading(true);
      setError(null);
    } else {
      setLoadingMore(true);
    }
    
    try {
      let response;
      
      
      // Call the appropriate API based on source
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

      
      // Extract achievements and pagination from response
      let achievementsData = [];
      let paginationData = null;
      
      if (response?.success && response?.data?.achievements) {
        achievementsData = response.data.achievements;
        paginationData = response.data.pagination;
      } else if (response?.data?.achievements) {
        achievementsData = response.data.achievements;
        paginationData = response.data.pagination;
      } else if (Array.isArray(response?.data)) {
        achievementsData = response.data;
      } else if (Array.isArray(response)) {
        achievementsData = response;
      }
      
      // Transform the achievements data
      const transformedAchievements = achievementsData.map(transformAchievement);
      

      
      if (append && page > 1) {
        // Append new data for infinite scroll
        setAchievements(prev => {
          const existingIds = new Set(prev.map(item => item.id));
          const newItems = transformedAchievements.filter(item => !existingIds.has(item.id));

          return [...prev, ...newItems];
        });
      } else {
        // Replace data for new source or first page
        setAchievements(transformedAchievements);

      }
      
      // Update pagination state
      if (paginationData) {
        setPagination(paginationData);
        setHasMore(paginationData.current_page < paginationData.last_page);
        setCurrentPage(paginationData.current_page);
      } else {
        // Fallback pagination logic
        setHasMore(transformedAchievements.length >= ITEMS_PER_PAGE);
        setCurrentPage(page);
      }
      
      setCurrentSource(source);
      
    } catch (err) {
      console.error(`❌ Error fetching ${source} achievements:`, err);
      setError(err.message || 'Failed to fetch achievements');
      
      if (!append) {
        setAchievements([]);
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
      isRequestingRef.current = false;
    }
  }, [transformAchievement, ITEMS_PER_PAGE]);

  // Load more achievements for infinite scroll
  const loadMore = useCallback(async () => {
    if (!loadingMore && hasMore && !isRequestingRef.current) {
      const nextPage = currentPage + 1;
      await fetchAchievements(currentSource, nextPage, true);
    }
  }, [fetchAchievements, currentSource, currentPage, loadingMore, hasMore]);

  // Switch between sources
  const switchToSource = useCallback(async (source) => {
    if (currentSource !== source) {
      setCurrentPage(1);
      setHasMore(true);
      setPagination(null);
      await fetchAchievements(source, 1, false);
    }
  }, [fetchAchievements, currentSource]);

  const switchToAll = useCallback(() => switchToSource(ACHIEVEMENT_SOURCES.ALL), [switchToSource]);
  const switchToConnections = useCallback(() => switchToSource(ACHIEVEMENT_SOURCES.CONNECTIONS), [switchToSource]);
  const switchToPopular = useCallback(() => switchToSource(ACHIEVEMENT_SOURCES.POPULAR), [switchToSource]);

  // Refresh current source
  const refresh = useCallback(async () => {
    setCurrentPage(1);
    setHasMore(true);
    setPagination(null);
    await fetchAchievements(currentSource, 1, false);
  }, [fetchAchievements, currentSource]);

  // Initial load
  useEffect(() => {
    fetchAchievements(ACHIEVEMENT_SOURCES.ALL, 1, false);
  }, [fetchAchievements]);

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
    loadMore,
    refresh,
    switchToAll,
    switchToConnections,
    switchToPopular,
    
    // Manual control
    fetchAchievements
  };
};
