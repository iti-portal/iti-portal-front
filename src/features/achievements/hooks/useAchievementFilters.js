/**
 * useAchievementFilters Hook
 * Custom hook for managing achievement filtering logic
 */

import { useState, useCallback } from 'react';

export const useAchievementFilters = (allAchievements = []) => {
  const [selectedType, setSelectedType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter achievements based on type and search query
  const filterAchievements = useCallback((achievements = allAchievements) => {
    let filteredData = [...achievements];
    
    // Filter by type if not 'all'
    if (selectedType !== 'all') {
      filteredData = filteredData.filter(
        achievement => achievement.type === selectedType
      );
    }
    
    // Filter by search query if present
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filteredData = filteredData.filter(
        achievement => 
          achievement.title.toLowerCase().includes(query) ||
          achievement.description.toLowerCase().includes(query) ||
          (achievement.organization && achievement.organization.toLowerCase().includes(query)) ||
          (achievement.user && achievement.user.name.toLowerCase().includes(query))
      );
    }
    
    return filteredData;
  }, [selectedType, searchQuery, allAchievements]);

  // Calculate statistics based on filtered data
  const getFilteredStatistics = useCallback((achievements = allAchievements) => {
    const filteredData = filterAchievements(achievements);
    
    // Calculate statistics based on filtered data
    const stats = {
      total: filteredData.length,
      byType: {}
    };
    
    // Count by type
    filteredData.forEach(achievement => {
      if (!stats.byType[achievement.type]) {
        stats.byType[achievement.type] = 0;
      }
      stats.byType[achievement.type]++;
    });
    
    return stats;
  }, [filterAchievements, allAchievements]);

  // Handler for type filter changes
  const handleTypeFilter = useCallback((type) => {
    if (type !== selectedType) {
      setSelectedType(type);
    }
  }, [selectedType]);

  // Handler for search changes
  const handleSearchChange = useCallback((e) => {
    const query = e.target.value;
    if (query !== searchQuery) {
      setSearchQuery(query);
    }
  }, [searchQuery]);

  // Reset all filters
  const resetFilters = useCallback(() => {
    setSelectedType('all');
    setSearchQuery('');
  }, []);

  return {
    // Filter state
    selectedType,
    searchQuery,
    
    // Filter functions
    filterAchievements,
    getFilteredStatistics,
    
    // Filter handlers
    handleTypeFilter,
    handleSearchChange,
    resetFilters,
    
    // Direct state setters (if needed)
    setSelectedType,
    setSearchQuery
  };
};

export default useAchievementFilters;
