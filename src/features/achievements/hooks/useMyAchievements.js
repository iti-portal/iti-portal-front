/**
 * useMyAchievements Hook
 * Custom hook for managing user's own achievements
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { getMyAchievements } from '../../../services/achievementsService';

export const useMyAchievements = () => {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [pagination, setPagination] = useState(null);

  // Use ref to prevent duplicate requests
  const isRequestingRef = useRef(false);
  const ITEMS_PER_PAGE = 25;

  // Transform API response data to component format
  const transformAchievement = useCallback((achievement) => {
    // If we get a specific structure with project/certificate/job/award sub-object, handle it
    let typeSpecificData = {};
    
    // If the achievement has a type-specific sub-object, extract those fields
    if (achievement.project || achievement.certificate || achievement.job || achievement.award) {
      const typeObj = achievement.project || achievement.certificate || achievement.job || achievement.award;
      if (typeObj) {
        typeSpecificData = { ...typeObj };
      }
    }
    
    return {
      id: achievement.id || typeSpecificData.id,
      type: achievement.type || 'achievement',
      title: achievement.title || typeSpecificData.title,
      description: achievement.description || typeSpecificData.description || '',
      user: {
        id: achievement.user_id || typeSpecificData.user_id,
        name: `${achievement.user_profile?.first_name || ''} ${achievement.user_profile?.last_name || ''}`.trim() || 'Unknown User',
        profile_picture: achievement.user_profile?.profile_picture,
        first_name: achievement.user_profile?.first_name,
        last_name: achievement.user_profile?.last_name
      },
      organization: achievement.organization || typeSpecificData.organization,
      start_date: achievement.achieved_at || typeSpecificData.start_date || achievement.start_date,
      end_date: achievement.end_date || typeSpecificData.end_date,
      url: achievement.project_url || achievement.certificate_url || typeSpecificData.url,
      date: achievement.created_at || typeSpecificData.created_at,
      created_at: achievement.created_at || typeSpecificData.created_at,
      updated_at: achievement.updated_at || typeSpecificData.updated_at,
      like_count: achievement.like_count || 0,
      is_liked: achievement.is_liked || false,
      comment_count: achievement.comment_count || 0,
      comments: achievement.comments || [],
      likes: achievement.likes || [],
      // Include the raw achievement for debugging
      raw: achievement
    };
  }, []);

  // Fetch my achievements with pagination
  const fetchMyAchievements = useCallback(async (page = 1, append = false) => {
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
      // Call with params object as expected by the service function
      const response = await getMyAchievements({
        page,
        per_page: ITEMS_PER_PAGE
      });
      
      
      
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
      
    } catch (err) {
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
      await fetchMyAchievements(nextPage, true);
    }
  }, [fetchMyAchievements, currentPage, loadingMore, hasMore]);

  // Refresh achievements
  const refresh = useCallback(async () => {
    setCurrentPage(1);
    setHasMore(true);
    setPagination(null);
    await fetchMyAchievements(1, false);
  }, [fetchMyAchievements]);

  // Initial load
  useEffect(() => {
    fetchMyAchievements(1, false);
  }, [fetchMyAchievements]);

  return {
    // Data
    achievements,
    loading,
    loadingMore,
    error,
    currentPage,
    hasMore,
    pagination,
    
    // Actions
    loadMore,
    refresh,
    fetchMyAchievements
  };
};
