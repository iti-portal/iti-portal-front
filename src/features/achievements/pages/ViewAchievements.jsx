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
import { useAchievementsAPI, ACHIEVEMENT_SOURCES } from '../hooks/useAchievementsAPI';
import { useAchievementFilters } from '../hooks/useAchievementFilters';
import { ACHIEVEMENT_TYPES } from '../types/achievementTypes';

const ViewAchievements = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('grid'); // grid, list, timeline
  
  // Use the API-based hook for fetching achievements
  const { 
    achievements, 
    loading, 
    error,
    currentSource,
    switchToAll,
    switchToConnections,
    switchToPopular,
    getStatistics,
    refresh
  } = useAchievementsAPI();
  
  // Use filtering hook with live data
  const {
    selectedType,
    searchQuery,
    filterAchievements,
    getFilteredStatistics,
    handleTypeFilter,
    handleSearchChange
  } = useAchievementFilters(achievements);

  // Get filtered achievements
  const filteredAchievements = filterAchievements();
  // Handle tab switching with async support
  const handleTabSwitch = async (source) => {
    try {
      switch (source) {
        case ACHIEVEMENT_SOURCES.ALL:
          await switchToAll();
          break;
        case ACHIEVEMENT_SOURCES.CONNECTIONS:
          await switchToConnections();
          break;
        case ACHIEVEMENT_SOURCES.POPULAR:
          await switchToPopular();
          break;
        default:
          await switchToAll();
      }
    } catch (error) {
      console.error('Error switching tabs:', error);
    }
  };

  const handleCreateNew = () => {
    navigate('/achievements/create');
  };

  const handleViewAchievement = (achievement) => {
    navigate(`/achievements/${achievement.id}`);
  };

  // Get statistics based on current filtered data
  const statistics = getFilteredStatistics();

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
        </div>

        {/* Source Tabs */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div className="flex space-x-8">
                <button
                  onClick={() => handleTabSwitch(ACHIEVEMENT_SOURCES.ALL)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    currentSource === ACHIEVEMENT_SOURCES.ALL
                      ? 'border-[#901b20] text-[#901b20]'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  For You
                </button>
                
                <button
                  onClick={() => handleTabSwitch(ACHIEVEMENT_SOURCES.CONNECTIONS)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    currentSource === ACHIEVEMENT_SOURCES.CONNECTIONS
                      ? 'border-[#901b20] text-[#901b20]'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Following
                </button>
                
                <button
                  onClick={() => handleTabSwitch(ACHIEVEMENT_SOURCES.POPULAR)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    currentSource === ACHIEVEMENT_SOURCES.POPULAR
                      ? 'border-[#901b20] text-[#901b20]'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Popular
                </button>
              </div>
              
              {/* Refresh Button */}
              <button
                onClick={refresh}
                disabled={loading}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
                title="Refresh achievements"
              >
                <svg 
                  className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>
          </div>
        </div>
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
          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-red-800">Error loading achievements</h3>
                  <p className="text-sm text-red-700 mt-1">
                    {error.includes('Too Many Attempts') 
                      ? 'Server is busy. Please wait a moment before trying again.'
                      : error
                    }
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={refresh}
                    className="bg-red-100 text-red-800 px-3 py-1 rounded text-sm hover:bg-red-200 transition-colors"
                  >
                    Retry
                  </button>
                  <button
                    onClick={() => handleTabSwitch(ACHIEVEMENT_SOURCES.ALL)}
                    className="bg-gray-100 text-gray-800 px-3 py-1 rounded text-sm hover:bg-gray-200 transition-colors"
                  >
                    Load For You
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && !error && (
            <div className="flex flex-col justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#901b20]"></div>
              <p className="text-gray-600 mt-4">Loading achievements...</p>
            </div>
          )}

          {/* Empty State or Content */}
          {!loading && !error && (
            <>
              {filteredAchievements.length === 0 ? (
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
            </>
          )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ViewAchievements;
