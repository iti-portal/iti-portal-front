/**
 * useAchievements Hook
 * Custom hook for managing achievements state and operations
 */

import { useState, useEffect, useCallback } from 'react';
import { 
  sortAchievementsByDate, 
  filterAchievementsByType, 
  searchAchievements 
} from '../utils/achievementHelpers';

export const useAchievements = (initialAchievements = []) => {
  const [achievements, setAchievements] = useState(initialAchievements);
  const [filteredAchievements, setFilteredAchievements] = useState(initialAchievements);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Filters
  const [filters, setFilters] = useState({
    type: 'all',
    search: '',
    sortBy: 'date',
    sortOrder: 'desc'
  });

  // Apply filters and sorting
  const applyFilters = useCallback(() => {
    let filtered = [...achievements];
    
    // Filter by type
    filtered = filterAchievementsByType(filtered, filters.type);
    
    // Search
    if (filters.search) {
      filtered = searchAchievements(filtered, filters.search);
    }
    
    // Sort
    if (filters.sortBy === 'date') {
      filtered = sortAchievementsByDate(filtered);
      if (filters.sortOrder === 'asc') {
        filtered.reverse();
      }
    } else if (filters.sortBy === 'title') {
      filtered.sort((a, b) => {
        const compare = a.title.localeCompare(b.title);
        return filters.sortOrder === 'asc' ? compare : -compare;
      });
    }
    
    setFilteredAchievements(filtered);
  }, [achievements, filters]);

  // Apply filters whenever achievements or filters change
  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  // CRUD operations
  const addAchievement = useCallback((newAchievement) => {
    const achievement = {
      ...newAchievement,
      id: Date.now().toString(), // Temporary ID
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    setAchievements(prev => [...prev, achievement]);
    return achievement;
  }, []);

  const updateAchievement = useCallback((id, updates) => {
    setAchievements(prev => prev.map(achievement => 
      achievement.id === id 
        ? { ...achievement, ...updates, updated_at: new Date().toISOString() }
        : achievement
    ));
  }, []);

  const deleteAchievement = useCallback((id) => {
    setAchievements(prev => prev.filter(achievement => achievement.id !== id));
  }, []);

  const getAchievementById = useCallback((id) => {
    return achievements.find(achievement => achievement.id === id);
  }, [achievements]);

  // Filter methods
  const setTypeFilter = useCallback((type) => {
    setFilters(prev => ({ ...prev, type }));
  }, []);

  const setSearchFilter = useCallback((search) => {
    setFilters(prev => ({ ...prev, search }));
  }, []);

  const setSortFilter = useCallback((sortBy, sortOrder = 'desc') => {
    setFilters(prev => ({ ...prev, sortBy, sortOrder }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      type: 'all',
      search: '',
      sortBy: 'date',
      sortOrder: 'desc'
    });
  }, []);

  // Statistics
  const getStatistics = useCallback(() => {
    const stats = {
      total: achievements.length,
      byType: {}
    };
    
    achievements.forEach(achievement => {
      stats.byType[achievement.type] = (stats.byType[achievement.type] || 0) + 1;
    });
    
    return stats;
  }, [achievements]);
  return {
    // Data
    achievements,
    filteredAchievements,
    loading,
    error,
    filters,
    
    // CRUD operations
    addAchievement,
    updateAchievement,
    deleteAchievement,
    getAchievementById,
    
    // Filter operations - these are optional and can be unused if component handles filtering
    setTypeFilter,
    setSearchFilter,
    setSortFilter,
    clearFilters,
    
    // Utilities - these are optional and can be unused
    getStatistics,
    setAchievements,
    setLoading,
    setError
  };
};
