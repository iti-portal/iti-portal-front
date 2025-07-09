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
    <>
      <Navbar />
      <div className="min-h-screen pt-10 pb-10">
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
        <section className="relative flex flex-col items-center justify-center py-16 px-4 bg-gradient-to-br from-[#fff7f0] via-[#fbeee6] to-[#f7faff]">
          <h1 className="text-4xl font-bold bg-gradient-to-br from-[#203947] via-[#901b20] to-[#203947] bg-clip-text text-transparent ">My Achievements</h1>
          <p className="text-lg md:text-xl text-gray-500 text-center max-w-2xl mb-10">Manage and showcase your personal accomplishments</p>
        </section>

        {/* Content */}
        <main className="flex-1 w-full max-w-5xl mx-auto px-2 md:px-0 pb-16">
          <div className="rounded-xl bg-white/90 shadow-md border border-gray-100 p-6 md:p-8 mt-[-60px] relative z-10">
            {/* Controls and Stats Row */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6">
              <div className="flex gap-4 items-center mb-4 md:mb-0">
                <button
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="p-3 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all duration-200 disabled:opacity-50 border border-slate-200"
                  title="Refresh"
                >
                  <svg className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
                <button
                  onClick={() => navigate('/achievements/create')}
                  className="bg-gradient-to-r from-red-700 to-red-500 hover:from-red-600 hover:to-red-700 text-white px-6 py-3 rounded-xl flex items-center space-x-2 font-semibold shadow-sm"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Add Achievement</span>
                </button>
              </div>
              <div className="flex gap-4 flex-wrap justify-end">
                <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 min-w-[120px] text-center">
                  <div className="text-xl font-bold text-slate-700">{stats.total}</div>
                  <div className="text-slate-500 text-xs font-medium">Total</div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 min-w-[120px] text-center">
                  <div className="text-xl font-bold text-blue-600">{stats.projects}</div>
                  <div className="text-slate-500 text-xs font-medium">Projects</div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 min-w-[120px] text-center">
                  <div className="text-xl font-bold text-indigo-600">{stats.certificates}</div>
                  <div className="text-slate-500 text-xs font-medium">Certificates</div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 min-w-[120px] text-center">
                  <div className="text-xl font-bold text-emerald-600">{stats.awards}</div>
                  <div className="text-slate-500 text-xs font-medium">Awards</div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 min-w-[120px] text-center">
                  <div className="text-xl font-bold text-emerald-600">{stats.jobs}</div>
                  <div className="text-slate-500 text-xs font-medium">Jobs</div>
                </div>
              </div>
            </div>
            {/* Search Bar and Filters Row */}
            <div className="flex flex-col md:flex-row md:items-center gap-4 pb-8">
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
                  className="block w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#901b20]/30 focus:border-[#901b20]/30 shadow-sm"
                />
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => setActiveTypeFilter(null)}
                  className={`px-4 py-2 rounded-lg font-semibold text-xs transition-all duration-200 shadow-sm border ${!activeTypeFilter ? 'bg-slate-700 text-white border-slate-700' : 'bg-white text-gray-700 border-gray-200'}`}
                >
                  All Types
                </button>
                <button 
                  onClick={() => setActiveTypeFilter(activeTypeFilter === 'project' ? null : 'project')}
                  className={`px-4 py-2 rounded-lg font-semibold text-xs transition-all duration-200 shadow-sm border ${activeTypeFilter === 'project' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-200'}`}
                  title="Projects"
                >🚀</button>
                <button 
                  onClick={() => setActiveTypeFilter(activeTypeFilter === 'job' ? null : 'job')}
                  className={`px-4 py-2 rounded-lg font-semibold text-xs transition-all duration-200 shadow-sm border ${activeTypeFilter === 'job' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-gray-700 border-gray-200'}`}
                  title="Jobs"
                >💼</button>
                <button 
                  onClick={() => setActiveTypeFilter(activeTypeFilter === 'certification' ? null : 'certification')}
                  className={`px-4 py-2 rounded-lg font-semibold text-xs transition-all duration-200 shadow-sm border ${activeTypeFilter === 'certification' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-700 border-gray-200'}`}
                  title="Certifications"
                >🎓</button>
                <button 
                  onClick={() => setActiveTypeFilter(activeTypeFilter === 'award' ? null : 'award')}
                  className={`px-4 py-2 rounded-lg font-semibold text-xs transition-all duration-200 shadow-sm border ${activeTypeFilter === 'award' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-gray-700 border-gray-200'}`}
                  title="Awards"
                >🏆</button>
              </div>
            </div>
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
                        showUser={false}
                        showActions={true}
                        viewMode={viewMode}
                        onView={() => {}}
                        onEdit={(achievement) => {
                          navigate(`/achievements/edit/${achievement.id}`);
                        }}
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
                        className="bg-gradient-to-r from-red-700 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-200 hover:scale-105 shadow-lg"
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
          </div>
        </main>
      </div>
    </>
  );
};

export default MyAchievements;
