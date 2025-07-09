/**
 * AchievementsFeed Page
 * Twitter-like achievements feed with lazy loading pagination
 */

import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import AchievementCard from '../components/common/AchievementCard';
import { useAchievementsAPI, ACHIEVEMENT_SOURCES } from '../hooks/useAchievementsAPI';
import { likeAchievement, unlikeAchievement } from '../../../services/achievementsService';

const AchievementsFeed = () => {
  const navigate = useNavigate();
  const {
    achievements,
    loading,
    loadingMore,
    error,
    currentSource,
    hasMore,
    initialize,
    switchToAll,
    switchToConnections,
    switchToPopular,
    loadMore,
    refresh,
    updateAchievement
  } = useAchievementsAPI();

  const observer = useRef();
  const [refreshing, setRefreshing] = useState(false);
  const [switching, setSwitching] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredAchievements, setFilteredAchievements] = useState([]);
  const [activeTypeFilter, setActiveTypeFilter] = useState(null); // null means "all"
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  // Initialize the hook manually
  React.useEffect(() => {
    if (!initialized) {
      setInitialized(true);
      initialize();
    }
  }, [initialize, initialized]);

  // Filter achievements based on search query and type filter
  React.useEffect(() => {
    let filtered = achievements;
    
    // Apply type filter first
    if (activeTypeFilter) {
      filtered = filtered.filter(achievement => achievement.type === activeTypeFilter);
    }
    
    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(achievement =>
        achievement.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        achievement.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        achievement.user?.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        achievement.user?.last_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        achievement.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        achievement.type?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    setFilteredAchievements(filtered);
  }, [achievements, searchQuery, activeTypeFilter]);

  // Setup intersection observer for infinite scrolling
  const lastAchievementRef = useCallback((node) => {
    if (loading || loadingMore) return;
    
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadMore();
      }
    }, {
      rootMargin: '200px',
      threshold: 0.1
    });
    
    if (node) observer.current.observe(node);
  }, [loading, loadingMore, hasMore, loadMore]);

  // Handle refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refresh();
    } catch (error) {
      // Handle error silently or show user notification
    } finally {
      setRefreshing(false);
    }
  };

  // Handle like/unlike
  const handleLike = async (achievementId, isLiked) => {
    try {
      
      
      if (isLiked) {
        
        await likeAchievement(achievementId);
      } else {
        
        await unlikeAchievement(achievementId);
      }
      
      
      // Optionally refresh to get updated like count
      // Note: The AchievementCard handles optimistic updates
    } catch (error) {
      console.error('❌ Feed handleLike - Failed to toggle like:', error);
      // The AchievementCard will revert optimistic update on error
    }
  };

  // Handle comment (opens modal)
  const handleComment = (achievement) => {
    // The AchievementCard already handles opening the modal
    // No additional action needed here
  };

  // Handle achievement updates (likes, comments) from cards
  const handleAchievementUpdate = useCallback((updatedAchievement) => {
    console.log('📡 Feed received achievement update:', updatedAchievement);
    
    // Update the achievement in the main achievements list (hook)
    updateAchievement(updatedAchievement);
    
    // Update the achievement in the local filtered state
    setFilteredAchievements(prev => prev.map(achievement => 
      achievement.id === updatedAchievement.id ? updatedAchievement : achievement
    ));
  }, [updateAchievement]);

  // Debounced tab switching to prevent rate limiting
  const handleTabSwitch = async (action, tabName) => {
    if (switching) return;
    
    setSwitching(true);
    try {
      await action();
    } catch (error) {
      // Handle error silently or show user notification
    } finally {
      // Add a small delay to prevent rapid switching
      setTimeout(() => setSwitching(false), 500);
    }
  };

  // Source tabs configuration
  const tabs = [
    {
      id: ACHIEVEMENT_SOURCES.ALL,
      label: 'For Me',
      description: 'All achievements',
      action: () => handleTabSwitch(switchToAll, 'All')
    },
    {
      id: ACHIEVEMENT_SOURCES.CONNECTIONS,
      label: 'Connections',
      description: 'Your network\'s achievements',
      action: () => handleTabSwitch(switchToConnections, 'Connections')
    },
    {
      id: ACHIEVEMENT_SOURCES.POPULAR,
      label: 'Popular',
      description: 'Trending achievements',
      action: () => handleTabSwitch(switchToPopular, 'Popular')
    }
  ];

  if (error && !achievements.length) {
    const isRateLimit = error.includes('Rate limit') || error.includes('Too Many Attempts');
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-pink-100">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="bg-gradient-to-br from-white to-red-50/80 backdrop-blur-sm rounded-2xl shadow-xl border border-red-200/60 p-8 text-center">
            <div className={`mb-6 ${isRateLimit ? 'text-amber-500' : 'text-red-500'}`}>
              {isRateLimit ? (
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
              ) : (
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-red-100 to-pink-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              )}
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              {isRateLimit ? 'Please wait a moment' : 'Something went wrong'}
            </h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              {isRateLimit 
                ? 'We\'re making too many requests. The system will automatically retry in a few seconds.'
                : error
              }
            </p>
            {!isRateLimit && (
              <button
                onClick={handleRefresh}
                className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105 shadow-lg"
              >
                Try Again
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50 to-red-50 pt-10 pb-10">
      {/* Spacer between navbar and header */}
      <div className="h-6"></div>
      
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between py-8">
            <div>
              <h1 className="text-4xl font-bold text-slate-800">
                Achievements
              </h1>
              <p className="text-slate-600 mt-2 text-lg">Showcase your accomplishments and milestones</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="p-3 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all duration-200 disabled:opacity-50 hover:scale-105 shadow-sm border border-slate-200"
                title="Refresh"
              >
                <svg 
                  className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
              <button
                onClick={() => navigate('/achievements/create')}
                className="bg-gradient-to-r from-red-900 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-8 py-3 rounded-xl flex items-center space-x-2 transition-all duration-200 font-semibold hover:scale-105 shadow-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Add Achievement</span>
              </button>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-4 gap-6 pb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-slate-700">{filteredAchievements.length}</div>
                  <div className="text-slate-500 text-sm font-medium">Total Achievements</div>
                </div>
                <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">🎯</span>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-blue-600">
                    {filteredAchievements.filter(a => a.type === 'project').length}
                  </div>
                  <div className="text-slate-500 text-sm font-medium">Projects</div>
                </div>
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">🚀</span>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-indigo-600">
                    {filteredAchievements.filter(a => a.type === 'certification').length}
                  </div>
                  <div className="text-slate-500 text-sm font-medium">Certificates</div>
                </div>
                <div className="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center">
                  <span className="text-2xl text-indigo-600">🎓</span>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-emerald-600">
                    {filteredAchievements.filter(a => a.type === 'award').length}
                  </div>
                  <div className="text-slate-500 text-sm font-medium">Awards</div>
                </div>
                <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center">
                  <span className="text-2xl text-emerald-600">🏆</span>
                </div>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="pb-8">
            <div className="flex items-center space-x-4">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search achievements, people, or skills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-12 pr-4 py-3 border border-gray-300/60 rounded-xl leading-5 bg-white/80 backdrop-blur-sm placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-[#901b20]/50 focus:border-[#901b20]/50 shadow-md transition-all duration-200"
                />
              </div>
              <button 
                onClick={() => setActiveTypeFilter(null)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-sm hover:scale-105 ${
                  !activeTypeFilter 
                    ? 'bg-slate-700 hover:bg-slate-800 text-white shadow-md' 
                    : 'bg-white/80 hover:bg-white text-gray-700 border border-gray-200/60 hover:border-gray-300/60'
                }`}
              >
                All Types
              </button>
              {/* Type Filter Icons */}
              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => setActiveTypeFilter(activeTypeFilter === 'project' ? null : 'project')}
                  className={`p-3 border border-gray-200/60 rounded-xl transition-all duration-200 shadow-sm hover:scale-105 ${
                    activeTypeFilter === 'project'
                      ? 'bg-blue-600 border-blue-600 text-white shadow-md'
                      : 'bg-white/80 hover:bg-blue-50 hover:border-blue-300/60'
                  }`}
                  title="Projects"
                >
                  <span className="text-lg">🚀</span>
                </button>
                <button 
                  onClick={() => setActiveTypeFilter(activeTypeFilter === 'job' ? null : 'job')}
                  className={`p-3 border border-gray-200/60 rounded-xl transition-all duration-200 shadow-sm hover:scale-105 ${
                    activeTypeFilter === 'job'
                      ? 'bg-emerald-600 border-emerald-600 text-white shadow-md'
                      : 'bg-white/80 hover:bg-emerald-50 hover:border-emerald-300/60'
                  }`}
                  title="Jobs"
                >
                  <span className="text-lg">💼</span>
                </button>
                <button 
                  onClick={() => setActiveTypeFilter(activeTypeFilter === 'certification' ? null : 'certification')}
                  className={`p-3 border border-gray-200/60 rounded-xl transition-all duration-200 shadow-sm hover:scale-105 ${
                    activeTypeFilter === 'certification'
                      ? 'bg-indigo-600 border-indigo-600 text-white shadow-md'
                      : 'bg-white/80 hover:bg-indigo-50 hover:border-indigo-300/60'
                  }`}
                  title="Certifications"
                >
                  <span className="text-lg">🎓</span>
                </button>
                <button 
                  onClick={() => setActiveTypeFilter(activeTypeFilter === 'award' ? null : 'award')}
                  className={`p-3 border border-gray-200/60 rounded-xl transition-all duration-200 shadow-sm hover:scale-105 ${
                    activeTypeFilter === 'award'
                      ? 'bg-emerald-600 border-emerald-600 text-white shadow-md'
                      : 'bg-white/80 hover:bg-emerald-50 hover:border-emerald-300/60'
                  }`}
                  title="Awards"
                >
                  <span className="text-lg">🏆</span>
                </button>
              </div>
              
              {/* View Toggle */}
              <div className="flex items-center space-x-1 bg-white/80 backdrop-blur-sm rounded-xl p-1 shadow-sm border border-gray-200/60">
                <button 
                  onClick={() => setViewMode('grid')}
                  className={`p-3 rounded-lg transition-all duration-200 ${
                    viewMode === 'grid'
                      ? 'text-slate-700 bg-slate-100 shadow-sm'
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                  title="Grid View"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button 
                  onClick={() => setViewMode('list')}
                  className={`p-3 rounded-lg transition-all duration-200 ${
                    viewMode === 'list'
                      ? 'text-slate-700 bg-slate-100 shadow-sm'
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                  title="List View"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center justify-between bg-white/60 backdrop-blur-sm rounded-xl p-2 shadow-sm border border-gray-200/50">
            <div className="flex items-center space-x-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={tab.action}
                  disabled={switching}
                  className={`px-6 py-3 font-semibold text-sm transition-all duration-200 rounded-lg disabled:opacity-50 hover:scale-105 ${
                    currentSource === tab.id
                      ? 'bg-slate-700 text-white shadow-md'
                      : 'text-gray-600 hover:text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {switching && currentSource !== tab.id ? (
                    <div className="flex items-center">
                      <svg className="w-4 h-4 animate-spin mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      {tab.label}
                    </div>
                  ) : (
                    tab.label
                  )}
                </button>
              ))}
            </div>
            
            {/* View Toggle */}
            <div className="flex items-center space-x-2">
              <div className="text-sm text-gray-500 font-medium">View:</div>
              <button 
                className={`p-2 rounded-lg transition-all duration-200 ${
                  viewMode === 'grid' 
                    ? 'text-slate-700 bg-slate-100' 
                    : 'text-gray-400 hover:text-gray-600'
                }`}
                onClick={() => setViewMode('grid')}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button 
                className={`p-2 rounded-lg transition-all duration-200 ${
                  viewMode === 'list' 
                    ? 'text-slate-700 bg-slate-100' 
                    : 'text-gray-400 hover:text-gray-600'
                }`}
                onClick={() => setViewMode('list')}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Loading State for Initial Load */}
        {loading && !achievements.length ? (
          <div className={viewMode === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            : "space-y-4"
          }>
            {[...Array(6)].map((_, i) => (
              <div key={i} className={`bg-white rounded-lg border border-gray-200 animate-pulse ${
                viewMode === 'grid' ? 'p-6 h-96 flex flex-col' : 'p-4'
              }`}>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-16 h-6 bg-gray-200 rounded-full"></div>
                  <div className="w-2 h-2 bg-gray-200 rounded-full"></div>
                </div>
                <div className="flex flex-col flex-1 space-y-3">
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-12 bg-gray-200 rounded flex-1"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4 mt-auto"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Achievements Display */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`${currentSource}-${viewMode}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className={viewMode === 'grid' 
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start"
                  : "space-y-4"
                }
              >
                {filteredAchievements.length > 0 ? (
                  filteredAchievements.map((achievement, index) => (
                    <motion.div
                      key={`${achievement.id}-${index}`}
                      ref={index === filteredAchievements.length - 1 ? lastAchievementRef : null}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ 
                        duration: 0.4, 
                        delay: index * 0.1,
                        ease: "easeOut"
                      }}
                    >
                      <AchievementCard
                        achievement={achievement}
                        showUser={true}
                        showActions={false}
                        viewMode={viewMode}
                        onView={(achievement) => {
                          // Handle view achievement - modal opens automatically
                        }}
                        onLike={handleLike}
                        onComment={handleComment}
                        onAchievementUpdate={handleAchievementUpdate}
                      />
                    </motion.div>
                  ))
                ) : (
                  <div className={viewMode === 'grid' 
                    ? "col-span-1 md:col-span-2 lg:col-span-3 bg-white rounded-xl border border-gray-200 p-8 text-center"
                    : "bg-white rounded-xl border border-gray-200 p-8 text-center"
                  }>
                    <div className="text-gray-400 mb-4">
                      <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {searchQuery.trim() || activeTypeFilter ? 'No matching achievements found' : 'No achievements yet'}
                    </h3>
                    <p className="text-gray-600">
                      {searchQuery.trim() || activeTypeFilter
                        ? 'Try adjusting your search terms or clearing the filters to see all achievements'
                        : currentSource === ACHIEVEMENT_SOURCES.CONNECTIONS
                        ? 'Connect with others to see their achievements here'
                        : currentSource === ACHIEVEMENT_SOURCES.POPULAR
                        ? 'Popular achievements will appear here'
                        : 'Achievements will appear here as they are created'
                      }
                    </p>
                    {(searchQuery.trim() || activeTypeFilter) && (
                      <button
                        onClick={() => {
                          setSearchQuery('');
                          setActiveTypeFilter(null);
                        }}
                        className="mt-4 bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                      >
                        Clear Filters
                      </button>
                    )}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Load More Indicator */}
            {loadingMore && (
              <div className="flex justify-center py-8">
                <div className="flex items-center space-x-2 text-gray-500">
                  <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span className="text-sm font-medium">Loading more achievements...</span>
                </div>
              </div>
            )}

            {/* End of Feed Indicator */}
            {!hasMore && achievements.length > 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500 text-sm">
                  You've reached the end of the feed
                </p>
              </div>
            )}

            {/* Error State for Load More */}
            {error && achievements.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                <p className="text-red-600 text-sm mb-2">{error}</p>
                <button
                  onClick={loadMore}
                  className="text-red-600 hover:text-red-700 text-sm font-medium"
                >
                  Try Again
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AchievementsFeed;
