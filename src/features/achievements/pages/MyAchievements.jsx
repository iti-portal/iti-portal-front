/**
 * MyAchievements Page
 * Page displaying current user's achievements with management capabilities
 */

import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import AchievementCard from '../components/common/AchievementCard';
import { useMyAchievements } from '../hooks/useMyAchievements';
import { deleteAchievement, likeAchievement, unlikeAchievement } from '../../../services/achievementsService';
import Navbar from '../../../components/Layout/Navbar';
import Modal from '../../../components/UI/Modal';
import Alert from '../../../components/UI/Alert';

const MyAchievements = () => {
  const navigate = useNavigate();
  const [notification, setNotification] = useState({ show: false, type: 'info', message: '' });
  const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);
  const [confirmModalContent, setConfirmModalContent] = useState({ title: '', message: '', onConfirm: () => {} });
  const {
    achievements,
    loading,
    loadingMore,
    error,
    hasMore,
    loadMore,
    refresh,
    updateAchievement
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
    const handleDelete = async () => {
      try {
        const result = await deleteAchievement(achievement.id);
        
        if (result.success) {
          await refresh();
          setNotification({ show: true, type: 'success', message: 'Achievement deleted successfully!' });
        } else {
          throw new Error(result.message || 'Failed to delete achievement');
        }
      } catch (error) {
        console.error('Error deleting achievement:', error);
        setNotification({ show: true, type: 'error', message: `Failed to delete achievement: ${error.message}` });
      }
    };

    setConfirmModalContent({
        title: 'Confirm Deletion',
        message: `Are you sure you want to delete "${achievement.title}"? This action cannot be undone.`,
        onConfirm: () => {
            handleDelete();
            setConfirmModalOpen(false);
        }
    });
    setConfirmModalOpen(true);
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
      console.error('Failed to toggle like:', error);
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
    console.log('📡 MyAchievements received achievement update:', updatedAchievement);
    
    // Update the achievement in the main achievements list (hook)
    updateAchievement(updatedAchievement);
    
    // Update the achievement in the local filtered state
    setFilteredAchievements(prev => prev.map(achievement => 
      achievement.id === updatedAchievement.id ? updatedAchievement : achievement
    ));
  }, [updateAchievement]);

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
    <><Navbar />    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50 to-red-50 pt-10 pb-10">
      <Alert
        show={notification.show}
        type={notification.type}
        message={notification.message}
        onClose={() => setNotification({ ...notification, show: false })}
      />
      <Modal
        isOpen={isConfirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        title={confirmModalContent.title}
      >
        <p>{confirmModalContent.message}</p>
        <div className="flex justify-end space-x-4 mt-4">
          <button
            onClick={() => setConfirmModalOpen(false)}
            className="px-4 py-2 rounded-lg text-gray-600 bg-gray-200 hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={confirmModalContent.onConfirm}
            className="px-4 py-2 rounded-lg text-white bg-red-600 hover:bg-red-700 transition-colors"
          >
            Confirm
          </button>
        </div>
      </Modal>
      {/* Spacer between navbar and header */}
      <div className="h-6"></div>

      {/* Header Section */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6">
          {/* Title and Add Button */}
          <div className="flex items-center justify-between py-8">
            <div>
              <h1 className="text-4xl font-bold text-slate-800">
                🎯 My Achievements
              </h1>
              <p className="text-slate-600 mt-2 text-lg">Manage and showcase your personal accomplishments</p>
            </div>
            <div className="flex items-center space-x-4">
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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 pb-8">
            <motion.div
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 border border-slate-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              whileHover={{ y: -4 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-slate-700">{stats.total}</div>
                  <div className="text-slate-500 text-sm font-medium">Total</div>
                </div>
                <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">🎯</span>
                </div>
              </div>
            </motion.div>
            <motion.div
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 border border-slate-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              whileHover={{ y: -4 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-blue-600">{stats.projects}</div>
                  <div className="text-slate-500 text-sm font-medium">Projects</div>
                </div>
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">🚀</span>
                </div>
              </div>
            </motion.div>
            <motion.div
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 border border-slate-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              whileHover={{ y: -4 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-indigo-600">{stats.certificates}</div>
                  <div className="text-slate-500 text-sm font-medium">Certificates</div>
                </div>
                <div className="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center">
                  <span className="text-2xl text-indigo-600">🎓</span>
                </div>
              </div>
            </motion.div>
            <motion.div
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 border border-slate-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
              whileHover={{ y: -4 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-emerald-600">{stats.awards}</div>
                  <div className="text-slate-500 text-sm font-medium">Awards</div>
                </div>
                <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center">
                  <span className="text-2xl text-emerald-600">🏆</span>
                </div>
              </div>
            </motion.div>
            <motion.div
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 border border-slate-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.5 }}
              whileHover={{ y: -4 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-emerald-600">{stats.jobs}</div>
                  <div className="text-slate-500 text-sm font-medium">Jobs</div>
                </div>
                <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center">
                  <span className="text-2xl text-emerald-600">💼</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            {/* Search */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search my achievements..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent shadow-sm hover:shadow-md transition-all duration-200 text-gray-700 placeholder-slate-400" />
              </div>
            </div>

            <div className="flex items-center justify-between lg:justify-end space-x-4">
              {/* Type Filter Buttons */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setActiveTypeFilter(activeTypeFilter === 'project' ? null : 'project')}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-105 shadow-sm hover:shadow-md border ${activeTypeFilter === 'project'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                      : 'bg-white text-blue-600 border-slate-200 hover:bg-blue-50'}`}
                  title="Projects"
                >
                  🚀 Projects
                </button>
                <button
                  onClick={() => setActiveTypeFilter(activeTypeFilter === 'job' ? null : 'job')}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-105 shadow-sm hover:shadow-md border ${activeTypeFilter === 'job'
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
                      : 'bg-white text-emerald-600 border-slate-200 hover:bg-emerald-50'}`}
                  title="Jobs"
                >
                  💼 Jobs
                </button>
                <button
                  onClick={() => setActiveTypeFilter(activeTypeFilter === 'certification' || activeTypeFilter === 'certificate' ? null : 'certification')}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-105 shadow-sm hover:shadow-md border ${activeTypeFilter === 'certification' || activeTypeFilter === 'certificate'
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                      : 'bg-white text-indigo-600 border-slate-200 hover:bg-indigo-50'}`}
                  title="Certificates"
                >
                  🎓 Certificates
                </button>
                <button
                  onClick={() => setActiveTypeFilter(activeTypeFilter === 'award' ? null : 'award')}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-105 shadow-sm hover:shadow-md border ${activeTypeFilter === 'award'
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
                      : 'bg-white text-emerald-600 border-slate-200 hover:bg-emerald-50'}`}
                  title="Awards"
                >
                  🏆 Awards
                </button>
              </div>

              {/* View Toggle */}
              <div className="flex items-center space-x-1 bg-white rounded-xl p-1 shadow-sm border border-slate-200">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-3 rounded-xl transition-all duration-200 hover:scale-105 ${viewMode === 'grid'
                      ? 'bg-slate-700 text-white shadow-md'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`}
                  title="Grid View"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-3 rounded-xl transition-all duration-200 hover:scale-105 ${viewMode === 'list'
                      ? 'bg-slate-700 text-white shadow-md'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`}
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
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Loading State for Initial Load */}
        {loading && !achievements.length ? (
          <div className={viewMode === 'grid'
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            : "space-y-4"}>
            {[...Array(6)].map((_, i) => (
              <div key={i} className={`bg-white rounded-xl border border-slate-200 animate-pulse shadow-sm ${viewMode === 'grid' ? 'p-6 h-96 flex flex-col' : 'p-4'}`}>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-16 h-6 bg-slate-200 rounded-full"></div>
                  <div className="w-2 h-2 bg-slate-200 rounded-full"></div>
                </div>
                <div className="flex flex-col flex-1 space-y-3">
                  <div className="h-6 bg-slate-200 rounded w-3/4"></div>
                  <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                  <div className="h-12 bg-slate-200 rounded flex-1"></div>
                  <div className="h-4 bg-slate-200 rounded w-1/4 mt-auto"></div>
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
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start"
                  : "space-y-4"}
              >
                {filteredAchievements.length > 0 ? (
                  filteredAchievements.map((achievement, index) => (
                    <motion.div
                      key={`${achievement.id}-${index}`}
                      ref={index === filteredAchievements.length - 1 ? lastAchievementRef : null}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.3,
                        delay: index * 0.1,
                        ease: "easeOut"
                      }}
                    >
                      <AchievementCard
                        achievement={achievement}
                        showUser={false} // Don't show user info since these are all mine
                        showActions={true} // Show edit/delete actions
                        viewMode={viewMode}
                        onView={() => {
                          // Handle view achievement - modal opens automatically
                        } }
                        onEdit={(achievement) => {
                          navigate(`/achievements/edit/${achievement.id}`);
                        } }
                        onDelete={handleDeleteAchievement}
                        onLike={handleLike}
                        onComment={handleComment}
                        onAchievementUpdate={handleAchievementUpdate} />
                    </motion.div>
                  ))
                ) : (
                  <div className={viewMode === 'grid'
                    ? "col-span-1 md:col-span-2 lg:col-span-3 bg-white rounded-xl border border-slate-200 p-8 text-center shadow-sm hover:shadow-md transition-all duration-300"
                    : "bg-white rounded-xl border border-slate-200 p-8 text-center shadow-sm hover:shadow-md transition-all duration-300"}>
                    <div className="text-6xl mb-6">
                      {searchQuery || activeTypeFilter ? '🔍' : '🎯'}
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-3">
                      {searchQuery || activeTypeFilter ? 'No matching achievements found' : 'No achievements yet'}
                    </h3>
                    <p className="text-slate-600 mb-6 text-lg">
                      {searchQuery || activeTypeFilter
                        ? 'Try adjusting your search or filters'
                        : 'Start by adding your first achievement to showcase your accomplishments'}
                    </p>
                    {!searchQuery && !activeTypeFilter && (
                      <button
                        onClick={() => navigate('/achievements/create')}
                        className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-200 hover:scale-105 shadow-lg"
                      >
                        ✨ Add Your First Achievement
                      </button>
                    )}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Loading More Indicator */}
            {loadingMore && (
              <div className="flex justify-center py-8">
                <div className="flex items-center space-x-3 bg-white px-6 py-3 rounded-xl shadow-sm border border-slate-200">
                  <svg className="w-6 h-6 animate-spin text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span className="text-slate-700 font-medium">Loading more achievements...</span>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div></>
  );
};

export default MyAchievements;
