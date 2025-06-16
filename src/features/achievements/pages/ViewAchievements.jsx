/**
 * ViewAchievements Page
 * Professional achievements listing for community members
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../../components/Layout/Navbar';
import AchievementCard from '../components/common/AchievementCard';
import AchievementFilters from '../components/common/AchievementFilters';
import { useAchievements } from '../hooks/useAchievements';
import { useAchievementFilters } from '../hooks/useAchievementFilters';
import { ACHIEVEMENT_TYPES } from '../types/achievementTypes';
import { allMockAchievements } from '../data/mockAchievements';

const ViewAchievements = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('grid'); // grid, list, timeline
  // Using ref instead of state for pagination to avoid re-renders
  const pageRef = useRef(1); 
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const observer = useRef();
  
  // Use the custom hooks
  const { filteredAchievements, setAchievements } = useAchievements([]);
  const {
    selectedType,
    searchQuery,
    filterAchievements,
    getFilteredStatistics,
    handleTypeFilter,
    handleSearchChange
  } = useAchievementFilters(allMockAchievements);
  // Load data with applied filters - using pageRef to avoid dependency loop  
  const loadFilteredData = useCallback(() => {
    const filteredData = filterAchievements();
    console.log(`Loading filtered data: type=${selectedType}, search="${searchQuery}", found ${filteredData.length} items`);
    setLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      // Use the ref directly to avoid state updates causing rerenders
      const currentPage = pageRef.current;
      const batchSize = 4;
      const startIndex = (currentPage - 1) * batchSize;
      const endIndex = currentPage * batchSize;
      const newBatch = filteredData.slice(startIndex, endIndex);
      
      if (newBatch.length > 0) {
        setAchievements(prevAchievements => {
          if (currentPage === 1) {
            // First batch, just return it directly
            return newBatch;
          } else {
            // Filter out any items with IDs that already exist
            const existingIds = new Set(prevAchievements.map(item => item.id));
            const uniqueNewItems = newBatch.filter(item => !existingIds.has(item.id));
            
            // Log if any duplicates were found
            if (uniqueNewItems.length !== newBatch.length) {
              console.log(`Found ${newBatch.length - uniqueNewItems.length} duplicate IDs, filtered them out`);
            }
            
            return [...prevAchievements, ...uniqueNewItems];
          }
        });
        
        // Update the ref directly instead of using setState
        pageRef.current = currentPage + 1;
        setHasMore(endIndex < filteredData.length);
        console.log(`Loaded ${newBatch.length} items (page ${currentPage}). Has more: ${endIndex < filteredData.length}`);
      } else {
        if (currentPage === 1) {
          // No results for the filter
          setAchievements([]);
        }
        setHasMore(false);
      }
        setLoading(false);
    }, 500);
  }, [filterAchievements, setAchievements, selectedType, searchQuery]);

  // Setup intersection observer for infinite scrolling
  const lastAchievementElementRef = useCallback(node => {
    if (loading) return;
    
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        console.log('Loading more filtered achievements...');
        loadFilteredData();
      }
    }, {
      rootMargin: '150px', // Increased margin to load earlier
      threshold: 0.1
    });
      if (node) observer.current.observe(node);
  }, [loading, hasMore, loadFilteredData]);

  // Page tracking is handled by pageRef defined above
  
  // Initial load - using empty dependency array to only run once
  useEffect(() => {
    console.log("Initial load of achievements - ONE TIME ONLY");
    // Reset to page 1 for initial load
    pageRef.current = 1;
    setHasMore(true);
    setAchievements([]);
    
    // Small delay to ensure component is fully mounted
    const timer = setTimeout(() => {
      loadFilteredData();
    }, 10);
    
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty array ensures this effect runs only once on component mount

  const handleCreateNew = () => {
    navigate('/achievements/create');
  };

  const handleViewAchievement = (achievement) => {
    navigate(`/achievements/${achievement.id}`);
  };

  // Get statistics based on current filters
  const statistics = getFilteredStatistics();

  // React to filter changes
  useEffect(() => {
    // When filters change, reset everything and load fresh data
    console.log('Filter changed, resetting pagination and loading fresh data');
    
    // Clear existing achievements
    setAchievements([]);
      // Reset pagination
    pageRef.current = 1;
    setHasMore(true);
    
    // Load the first page with the new filters
    const timer = setTimeout(() => {
      loadFilteredData();
    }, 100);
    
    return () => clearTimeout(timer);
  }, [selectedType, searchQuery, loadFilteredData, setAchievements]);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Community Achievements</h1>
                <p className="mt-1 text-sm text-gray-600">
                  Discover accomplishments from ITI community members
                </p>
              </div>
              
              <button
                onClick={handleCreateNew}
                className="bg-[#901b20] text-white px-4 py-2 text-sm rounded-lg font-medium hover:bg-[#a83236] transition-colors flex items-center space-x-1.5 shadow-md"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Share Achievement</span>
              </button>
            </div>

            {/* Statistics */}
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <div className="text-lg font-bold text-blue-800">{statistics.total}</div>
                <div className="text-blue-600 text-xs">Total Achievements</div>
              </div>
              <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                <div className="text-lg font-bold text-green-800">{statistics.byType[ACHIEVEMENT_TYPES.PROJECT] || 0}</div>
                <div className="text-green-600 text-xs">Projects</div>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                <div className="text-lg font-bold text-purple-800">{statistics.byType[ACHIEVEMENT_TYPES.CERTIFICATE] || 0}</div>
                <div className="text-purple-600 text-xs">Certificates</div>
              </div>
              <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                <div className="text-lg font-bold text-yellow-800">{statistics.byType[ACHIEVEMENT_TYPES.AWARD] || 0}</div>
                <div className="text-yellow-600 text-xs">Awards</div>
              </div>
            </div>
          </div>
        </div>        {/* Filters */}
        <AchievementFilters
          selectedType={selectedType}
          searchQuery={searchQuery}
          onTypeChange={handleTypeFilter}
          onSearchChange={handleSearchChange}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {filteredAchievements.length === 0 && !loading ? (
            /* Empty State */
            <div className="text-center py-10">
              <svg className="mx-auto h-10 w-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No achievements found</h3>
              <p className="mt-1 text-xs text-gray-500">
                {searchQuery || selectedType !== 'all' 
                  ? 'Try adjusting your search or filters.'
                  : 'Be the first to share an achievement with the community.'
                }
              </p>
              {(!searchQuery && selectedType === 'all') && (
                <div className="mt-4">
                  <button
                    onClick={handleCreateNew}
                    className="bg-[#901b20] text-white px-3 py-1.5 text-sm rounded-lg font-medium hover:bg-[#a83236] transition-colors"
                  >
                    Share Your Achievement
                  </button>
                </div>
              )}
            </div>          ) : (
            /* Achievements Grid/List with Lazy Loading */
            <>
              <motion.div
                layout
                className={`
                  ${viewMode === 'grid' 
                    ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4' 
                    : 'space-y-3'
                  }
                `}
              >
                <AnimatePresence mode="popLayout">
                  {filteredAchievements.map((achievement, index) => (
                    <AchievementCard
                      key={`${achievement.id}-${index}`}
                      achievement={achievement}
                      onView={handleViewAchievement}
                      compact={viewMode === 'list'}
                      className={viewMode === 'list' ? 'w-full' : ''}
                      showUser={true}
                    />
                  ))}                </AnimatePresence>
              </motion.div>

              {/* Loading indicator */}
              {loading && (
                <div className="flex flex-col justify-center items-center py-6 mt-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#901b20]"></div>
                  <p className="text-sm text-gray-600 mt-2">Loading more achievements...</p>
                </div>
              )}
              
              {/* End of results message */}
              {!hasMore && filteredAchievements.length > 0 && !loading && (
                <div className="text-center py-4 mt-2">
                  <p className="text-sm text-gray-500">You've reached the end of the achievements list</p>
                  <p className="text-xs text-gray-400 mt-1">Showing {filteredAchievements.length} achievements</p>
                </div>
              )}
                {/* Load more trigger - always visible unless we've reached the end */}
              {hasMore && !loading && filteredAchievements.length > 0 && (
                <div 
                  ref={lastAchievementElementRef}
                  className="h-20 flex justify-center items-center py-6 mt-2 text-center text-sm text-gray-500"
                >
                  <p>Scroll for more achievements</p>
                  <svg className="w-5 h-5 ml-2 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ViewAchievements;
