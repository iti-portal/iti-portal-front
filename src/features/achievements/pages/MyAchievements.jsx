/**
 * MyAchievements Page
 * Page displaying current user's achievements with management capabilities
 */

import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import AchievementCard from '../components/common/AchievementCard';
import { useMyAchievements } from '../hooks/useMyAchievements';
import { deleteAchievement } from '../../../services/achievementsService';
import Navbar from '../../../components/Layout/Navbar';

const MyAchievements = () => {
  const navigate = useNavigate();
  const {
    achievements,
    loading,
    loadingMore,
    error,
    hasMore,
    loadMore,
    refresh
  } = useMyAchievements();

  const observer = useRef();
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredAchievements, setFilteredAchievements] = useState([]);
  const [activeTypeFilter, setActiveTypeFilter] = useState(null); // null means "all"
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

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

  // Handle delete achievement
  const handleDeleteAchievement = async (achievement) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${achievement.title}"? This action cannot be undone.`
    );
    
    if (!confirmDelete) return;

    try {
      const result = await deleteAchievement(achievement.id);
      
      if (result.success) {
        // Refresh the achievements list
        await refresh();
        alert('Achievement deleted successfully!');
      } else {
        throw new Error(result.message || 'Failed to delete achievement');
      }
    } catch (error) {
      console.error('Error deleting achievement:', error);
      alert(`Failed to delete achievement: ${error.message}`);
    }
  };

  // Calculate statistics
  const getStatistics = () => {
    const total = filteredAchievements.length;
    const projects = filteredAchievements.filter(a => a.type === 'project').length;
    const certificates = filteredAchievements.filter(a => a.type === 'certification' || a.type === 'certificate').length;
    const awards = filteredAchievements.filter(a => a.type === 'award').length;
    const jobs = filteredAchievements.filter(a => a.type === 'job').length;
    
    return { total, projects, certificates, awards, jobs };
  };

  const stats = getStatistics();

  if (error && !achievements.length) {
    const isRateLimit = error.includes('Rate limit') || error.includes('Too Many Attempts');
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-red-50">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="bg-gradient-to-br from-white to-red-50 rounded-xl shadow-md border border-red-200 p-8 text-center">
            <div className={`mb-4 ${isRateLimit ? 'text-amber-500' : 'text-red-500'}`}>
              {isRateLimit ? (
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              ) : (
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {isRateLimit ? 'Rate Limit Exceeded' : 'Unable to Load Achievements'}
            </h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
            >
              {refreshing ? 'Retrying...' : 'Try Again'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
        <Navbar/>
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          {/* Title and Add Button */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">My Achievements</h1>
              <p className="text-gray-600">Manage and showcase your personal accomplishments</p>
            </div>
            <button
              onClick={() => navigate('/achievements/create')}
              className=" text-white px-4 py-2 rounded-lg bg-red-800 transition-colors flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Add Achievement</span>
            </button>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 pb-6">
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
              <div className="text-sm text-gray-600">Total</div>
            </div>
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.projects}</div>
              <div className="text-sm text-blue-600">Projects</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{stats.certificates}</div>
              <div className="text-sm text-purple-600">Certificates</div>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">{stats.awards}</div>
              <div className="text-sm text-yellow-600">Awards</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{stats.jobs}</div>
              <div className="text-sm text-green-600">Jobs</div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            {/* Search */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search my achievements..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex items-center justify-between lg:justify-end space-x-4">
              {/* Type Filter Buttons */}
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => setActiveTypeFilter(activeTypeFilter === 'project' ? null : 'project')}
                  className={`p-2 border border-gray-200 rounded-lg transition-colors ${
                    activeTypeFilter === 'project'
                      ? 'bg-blue-100 border-blue-300 text-blue-700'
                      : 'bg-white hover:bg-gray-50'
                  }`}
                  title="Projects"
                >
                  🚀
                </button>
                <button 
                  onClick={() => setActiveTypeFilter(activeTypeFilter === 'job' ? null : 'job')}
                  className={`p-2 border border-gray-200 rounded-lg transition-colors ${
                    activeTypeFilter === 'job'
                      ? 'bg-green-100 border-green-300 text-green-700'
                      : 'bg-white hover:bg-gray-50'
                  }`}
                  title="Jobs"
                >
                  💼
                </button>
                <button 
                  onClick={() => setActiveTypeFilter(activeTypeFilter === 'certification' || activeTypeFilter === 'certificate' ? null : 'certification')}
                  className={`p-2 border border-gray-200 rounded-lg transition-colors ${
                    activeTypeFilter === 'certification' || activeTypeFilter === 'certificate'
                      ? 'bg-purple-100 border-purple-300 text-purple-700'
                      : 'bg-white hover:bg-gray-50'
                  }`}
                  title="Certificate"
                >
                  🎓
                </button>
                <button 
                  onClick={() => setActiveTypeFilter(activeTypeFilter === 'award' ? null : 'award')}
                  className={`p-2 border border-gray-200 rounded-lg transition-colors ${
                    activeTypeFilter === 'award'
                      ? 'bg-yellow-100 border-yellow-300 text-yellow-700'
                      : 'bg-white hover:bg-gray-50'
                  }`}
                  title="Award"
                >
                  🏆
                </button>
              </div>
              
              {/* View Toggle */}
              <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
                <button 
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded transition-colors ${
                    viewMode === 'grid'
                      ? 'text-red-600 bg-white shadow-sm'
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
                  className={`p-2 rounded transition-colors ${
                    viewMode === 'list'
                      ? 'text-red-600 bg-white shadow-sm'
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
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Loading State for Initial Load */}
        {loading && !achievements.length ? (
          <div className={viewMode === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            : "space-y-4"
          }>
            {[...Array(6)].map((_, i) => (
              <div key={i} className={`bg-white rounded-lg border border-gray-200 animate-pulse ${
                viewMode === 'grid' ? 'p-6' : 'p-4'
              }`}>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-16 h-6 bg-gray-200 rounded-full"></div>
                  <div className="w-2 h-2 bg-gray-200 rounded-full"></div>
                </div>
                <div className="space-y-3">
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-12 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Achievements Display */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`myachievements-${viewMode}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className={viewMode === 'grid' 
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  : "space-y-4"
                }
              >
                {filteredAchievements.length > 0 ? (
                  filteredAchievements.map((achievement, index) => (
                    <div
                      key={`${achievement.id}-${index}`}
                      ref={index === filteredAchievements.length - 1 ? lastAchievementRef : null}
                    >
                      <AchievementCard
                        achievement={achievement}
                        showUser={false} // Don't show user info since these are all mine
                        showActions={true} // Show edit/delete actions
                        viewMode={viewMode}
                        onView={() => {
                          // Handle view achievement
                        }}
                        onEdit={(achievement) => {
                          navigate(`/achievements/edit/${achievement.id}`);
                        }}
                        onDelete={handleDeleteAchievement}
                        onLike={async (achievementId, isLiked) => {
                          // TODO: Implement like API call
                        }}
                        onComment={(achievement) => {
                          // TODO: Implement comment functionality
                        }}
                      />
                    </div>
                  ))
                ) : (
                  <div className={viewMode === 'grid' 
                    ? "col-span-1 md:col-span-2 lg:col-span-3 bg-white rounded-xl border border-gray-200 p-8 text-center"
                    : "bg-white rounded-xl border border-gray-200 p-8 text-center"
                  }>
                    <div className="text-gray-400 mb-4">
                      <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {searchQuery || activeTypeFilter ? 'No matching achievements found' : 'No achievements yet'}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {searchQuery || activeTypeFilter
                        ? 'Try adjusting your search or filters'
                        : 'Start by adding your first achievement to showcase your accomplishments'
                      }
                    </p>
                    {!searchQuery && !activeTypeFilter && (
                      <button
                        onClick={() => navigate('/achievements/create')}
                        className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
                      >
                        Add Your First Achievement
                      </button>
                    )}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Loading More Indicator */}
            {loadingMore && (
              <div className="flex justify-center py-8">
                <div className="flex items-center space-x-2 text-gray-500">
                  <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>Loading more achievements...</span>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MyAchievements;
