/**
 * ViewAchievements Page
 * Professional achievements listing for community members with infinite scroll
 */

import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';
import Navbar from '../../../components/Layout/Navbar';
import AchievementCard from '../components/common/AchievementCard';
import { useAchievementsAPI, ACHIEVEMENT_SOURCES } from '../hooks/useAchievementsAPI';

const ViewAchievements = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('grid'); // grid, list
  
  // Use the API-based hook for fetching achievements
  const { 
    achievements, 
    loading, 
    loadingMore,
    error,
    currentSource,
    currentPage,
    hasMore,
    pagination,
    switchToAll,
    switchToConnections,
    switchToPopular,
    loadMore,
    refresh
  } = useAchievementsAPI();

  // Use all achievements without filtering for Twitter-like experience
  const filteredAchievements = achievements;

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

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#901b20] to-[#b52329] text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">🏆 Your Achievement Feed</h1>
                <p className="mt-2 text-white/80">
                  Discover inspiring accomplishments from your ITI community
                </p>
              </div>
              
              <button
                onClick={handleCreateNew}
                className="bg-white text-[#901b20] px-6 py-3 text-sm rounded-xl font-semibold hover:bg-gray-50 transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Share Your Win</span>
              </button>
            </div>
          </div>
        </div>

        {/* Twitter-like Navigation Tabs */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div className="flex space-x-0">
                <button
                  onClick={() => handleTabSwitch(ACHIEVEMENT_SOURCES.ALL)}
                  className={`relative px-6 py-4 text-base font-semibold transition-all duration-200 ${
                    currentSource === ACHIEVEMENT_SOURCES.ALL
                      ? 'text-[#901b20] border-b-2 border-[#901b20]'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <span className="flex items-center space-x-2">
                    <span>🎯</span>
                    <span>For You</span>
                  </span>
                </button>
                <button
                  onClick={() => handleTabSwitch(ACHIEVEMENT_SOURCES.CONNECTIONS)}
                  className={`relative px-6 py-4 text-base font-semibold transition-all duration-200 ${
                    currentSource === ACHIEVEMENT_SOURCES.CONNECTIONS
                      ? 'text-[#901b20] border-b-2 border-[#901b20]'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <span className="flex items-center space-x-2">
                    <span>👥</span>
                    <span>Following</span>
                  </span>
                </button>
                <button
                  onClick={() => handleTabSwitch(ACHIEVEMENT_SOURCES.POPULAR)}
                  className={`relative px-6 py-4 text-base font-semibold transition-all duration-200 ${
                    currentSource === ACHIEVEMENT_SOURCES.POPULAR
                      ? 'text-[#901b20] border-b-2 border-[#901b20]'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <span className="flex items-center space-x-2">
                    <span>🔥</span>
                    <span>Trending</span>
                  </span>
                </button>
              </div>

              {/* Right side controls */}
              <div className="flex items-center space-x-3">
                {/* View Mode Toggle */}
                <div className="flex items-center bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-md transition-all duration-200 ${
                      viewMode === 'grid'
                        ? 'bg-white text-[#901b20] shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                    title="Grid View"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-md transition-all duration-200 ${
                      viewMode === 'list'
                        ? 'bg-white text-[#901b20] shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                    title="List View"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
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
        </div>

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
            filteredAchievements.length === 0 ? (
              /* Empty State */
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🎯</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No achievements yet</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Be the first to share an amazing achievement with the community and inspire others!
                </p>
                <button
                  onClick={handleCreateNew}
                  className="bg-[#901b20] text-white px-6 py-3 text-base rounded-xl font-semibold hover:bg-[#a83236] transition-all duration-200 transform hover:-translate-y-0.5 shadow-lg"
                >
                  🚀 Share Your First Achievement
                </button>
              </div>
            ) : (
              /* Achievements Grid/List with Infinite Scroll */
              <InfiniteScroll
                dataLength={filteredAchievements.length}
                next={loadMore}
                hasMore={hasMore}
                loader={
                  <div className="flex flex-col justify-center items-center py-8 mt-6">
                    <div className="relative">
                      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#901b20]"></div>
                      <div className="absolute inset-0 rounded-full border-t-2 border-[#901b20]/20"></div>
                    </div>
                    <p className="text-base font-medium text-gray-700 mt-3">Loading more achievements...</p>
                    <p className="text-sm text-gray-500 mt-1">Discovering amazing accomplishments ✨</p>
                  </div>
                }
                endMessage={
                  <div className="text-center py-8 mt-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl mx-4">
                    <div className="text-4xl mb-3">🎊</div>
                    <p className="text-lg font-semibold text-gray-800 mb-2">You've seen them all!</p>
                    <p className="text-sm text-gray-600 mb-4">
                      {pagination 
                        ? `Explored all ${pagination.total} amazing achievements`
                        : `Browsed through ${filteredAchievements.length} inspiring stories`
                      }
                    </p>
                    <button
                      onClick={() => handleTabSwitch(ACHIEVEMENT_SOURCES.ALL)}
                      className="bg-[#901b20] text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-[#a83236] transition-colors"
                    >
                      🔄 Refresh Feed
                    </button>
                  </div>
                }
                scrollThreshold={0.8}
                className={`
                  ${viewMode === 'grid' 
                    ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
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
                  ))}
                </AnimatePresence>
              </InfiniteScroll>
            )
          )}
        </div>
      </div>
    </>
  );
};

export default ViewAchievements;
