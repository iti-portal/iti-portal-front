/**
 * useAchievementsAPI Hook - Final Simplified Version
 * Ultra-simple hook with strict request control to prevent API spam
 */

import { useState, useCallback, useRef } from 'react';
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
  const [state, setState] = useState({
    achievements: [],
    loading: false,
    loadingMore: false,
    error: null,
    currentSource: ACHIEVEMENT_SOURCES.ALL,
    currentPage: 1,
    hasMore: true,
    pagination: null
  });

  // Single ref to control all requests
  const requestControlRef = useRef({
    isRequesting: false,
    lastRequestTime: 0,
    initialized: false,
    currentAbortController: null
  });

  const ITEMS_PER_PAGE = 25;
  const MIN_REQUEST_INTERVAL = 2000; // 2 seconds minimum between requests

  // Transform API response to component format
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

  // Main fetch function with strict control
  const fetchAchievements = useCallback(async (source, page = 1, append = false) => {
    const control = requestControlRef.current;
    
    // Prevent multiple concurrent requests
    if (control.isRequesting) {
      console.log('🚫 Request blocked: already requesting');
      return;
    }

    // Rate limiting
    const now = Date.now();
    const timeSinceLastRequest = now - control.lastRequestTime;
    if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
      const delay = MIN_REQUEST_INTERVAL - timeSinceLastRequest;
      console.log(`⏳ Rate limit: waiting ${delay}ms`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }

    // Set requesting flag
    control.isRequesting = true;
    control.lastRequestTime = Date.now();

    // Cancel any previous request
    if (control.currentAbortController) {
      control.currentAbortController.abort();
    }
    control.currentAbortController = new AbortController();

    console.log(`🔄 Fetching ${source} page ${page} ${append ? '(append)' : '(replace)'}`);

    // Update loading state
    setState(prev => ({
      ...prev,
      loading: !append,
      loadingMore: append,
      error: null
    }));

    try {
      let response;
      const signal = control.currentAbortController.signal;

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

      // Check if request was aborted
      if (signal.aborted) {
        console.log('🚫 Request aborted');
        return;
      }

      console.log('📥 API Response received');

      // Extract achievements data
      let achievementsData = [];
      let paginationData = null;

      if (response?.success && response?.data?.achievements) {
        achievementsData = response.data.achievements;
        paginationData = response.data.pagination;
      } else if (response?.data && Array.isArray(response.data)) {
        achievementsData = response.data;
      } else if (Array.isArray(response)) {
        achievementsData = response;
      }

      // Transform achievements
      const transformedAchievements = achievementsData.map(transformAchievement);

      // Determine if there are more pages
      const hasMoreItems = paginationData 
        ? paginationData.current_page < (paginationData.last_page || Math.ceil(paginationData.total / ITEMS_PER_PAGE))
        : transformedAchievements.length >= ITEMS_PER_PAGE;

      // Update state
      setState(prev => {
        const newAchievements = append 
          ? [...prev.achievements, ...transformedAchievements.filter(item => 
              !prev.achievements.some(existing => existing.id === item.id)
            )]
          : transformedAchievements;

        return {
          ...prev,
          achievements: newAchievements,
          loading: false,
          loadingMore: false,
          currentSource: source,
          currentPage: page,
          hasMore: hasMoreItems,
          pagination: paginationData,
          error: null
        };
      });

      console.log(`✅ Loaded ${transformedAchievements.length} achievements. HasMore: ${hasMoreItems}`);

    } catch (err) {
      if (err.name === 'AbortError') {
        console.log('🚫 Request was aborted');
        return;
      }

      console.error(`❌ Error fetching ${source} achievements:`, err);
      
      let errorMessage = err.message || 'Failed to fetch achievements';
      if (err.message && err.message.includes('Too Many Attempts')) {
        errorMessage = 'Rate limit exceeded. Please wait before trying again.';
      }

      setState(prev => ({
        ...prev,
        loading: false,
        loadingMore: false,
        error: errorMessage,
        achievements: append ? prev.achievements : []
      }));

    } finally {
      control.isRequesting = false;
    }
  }, []);

  // Initialize - load ALL achievements on first call
  const initialize = useCallback(() => {
    if (!requestControlRef.current.initialized) {
      requestControlRef.current.initialized = true;
      console.log('🚀 Initializing with ALL achievements');
      fetchAchievements(ACHIEVEMENT_SOURCES.ALL, 1, false);
    }
  }, [fetchAchievements]);

  // Load more for infinite scroll
  const loadMore = useCallback(() => {
    if (!state.loadingMore && state.hasMore && !requestControlRef.current.isRequesting) {
      const nextPage = state.currentPage + 1;
      fetchAchievements(state.currentSource, nextPage, true);
    }
  }, [state.currentSource, state.currentPage, state.loadingMore, state.hasMore, fetchAchievements]);

  // Switch to All achievements
  const switchToAll = useCallback(() => {
    if (state.currentSource !== ACHIEVEMENT_SOURCES.ALL && !requestControlRef.current.isRequesting) {
      fetchAchievements(ACHIEVEMENT_SOURCES.ALL, 1, false);
    }
  }, [state.currentSource, fetchAchievements]);

  // Switch to Connections achievements
  const switchToConnections = useCallback(() => {
    if (state.currentSource !== ACHIEVEMENT_SOURCES.CONNECTIONS && !requestControlRef.current.isRequesting) {
      fetchAchievements(ACHIEVEMENT_SOURCES.CONNECTIONS, 1, false);
    }
  }, [state.currentSource, fetchAchievements]);

  // Switch to Popular achievements
  const switchToPopular = useCallback(() => {
    if (state.currentSource !== ACHIEVEMENT_SOURCES.POPULAR && !requestControlRef.current.isRequesting) {
      fetchAchievements(ACHIEVEMENT_SOURCES.POPULAR, 1, false);
    }
  }, [state.currentSource, fetchAchievements]);

  // Refresh current source
  const refresh = useCallback(() => {
    if (!requestControlRef.current.isRequesting) {
      fetchAchievements(state.currentSource, 1, false);
    }
  }, [state.currentSource, fetchAchievements]);

  return {
    // Data
    achievements: state.achievements,
    loading: state.loading,
    loadingMore: state.loadingMore,
    error: state.error,
    currentSource: state.currentSource,
    currentPage: state.currentPage,
    hasMore: state.hasMore,
    pagination: state.pagination,
    
    // Actions
    initialize,
    switchToAll,
    switchToConnections, 
    switchToPopular,
    loadMore,
    refresh
  };
};
