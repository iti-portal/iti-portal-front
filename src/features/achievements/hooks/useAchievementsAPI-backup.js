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
      console.log('🚫 Request already in progress, skipping...');
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
      
      console.log(`🔄 Fetching ${source} achievements: page=${page}, per_page=${ITEMS_PER_PAGE}, append=${append}`);
      
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
      
      console.log('📋 API Response:', response);
      
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
      
      console.log(`📝 Transformed ${transformedAchievements.length} achievements`);
      
      if (append && page > 1) {
        // Append new data for infinite scroll
        setAchievements(prev => {
          const existingIds = new Set(prev.map(item => item.id));
          const newItems = transformedAchievements.filter(item => !existingIds.has(item.id));
          console.log(`➕ Appending ${newItems.length} new achievements (${transformedAchievements.length - newItems.length} duplicates filtered)`);
          return [...prev, ...newItems];
        });
      } else {
        // Replace data for new source or first page
        setAchievements(transformedAchievements);
        console.log(`🔄 Replaced with ${transformedAchievements.length} achievements`);
      }
      
      // Update pagination state
      if (paginationData) {
        setPagination(paginationData);
        setHasMore(paginationData.current_page < paginationData.last_page);
        setCurrentPage(paginationData.current_page);
        console.log(`📊 Pagination: page ${paginationData.current_page}/${paginationData.last_page}, total: ${paginationData.total}`);
      } else {
        // Fallback pagination logic
        setHasMore(transformedAchievements.length >= ITEMS_PER_PAGE);
        setCurrentPage(page);
        console.log(`📊 Fallback pagination: hasMore=${transformedAchievements.length >= ITEMS_PER_PAGE}`);
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
      console.log(`🔄 Loading more: page ${nextPage}`);
      await fetchAchievements(currentSource, nextPage, true);
    }
  }, [fetchAchievements, currentSource, currentPage, loadingMore, hasMore]);

  // Switch between sources
  const switchToSource = useCallback(async (source) => {
    if (currentSource !== source) {
      console.log(`🔄 Switching to ${source} source`);
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
    console.log(`🔄 Refreshing ${currentSource} achievements`);
    setCurrentPage(1);
    setHasMore(true);
    setPagination(null);
    await fetchAchievements(currentSource, 1, false);
  }, [fetchAchievements, currentSource]);

  // Initial load
  useEffect(() => {
    console.log('🚀 Initial load starting...');
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
