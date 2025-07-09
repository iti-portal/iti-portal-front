/**
 * AchievementCard Component
 * ITI-style card component for displaying achievement data
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../../../contexts/AuthContext';
import AchievementDetailsModal from '../../components/modals/AchievementDetailsModal';

// Get the base URL for images (remove /api part for storage URLs)
const getImageUrl = (imagePath) => {
  const baseUrl = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';
  const cleanBaseUrl = baseUrl.replace('/api', '');
  const fullUrl = `${cleanBaseUrl}/storage/${imagePath}`;
  return fullUrl;
};

const AchievementCard = ({ 
  achievement, 
  onEdit, 
  onDelete, 
  onView,
  onLike,
  onComment,
  onAchievementUpdate, // Add this new prop for parent updates
  showActions = false,
  showUser = true,
  compact = false,
  viewMode = 'grid', // 'grid' or 'list'
  className = '' 
}) => {
  const { user } = useAuth(); // Get current user
  const [isLiked, setIsLiked] = useState(achievement.is_liked || false);
  const [likeCount, setLikeCount] = useState(achievement.like_count || 0);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [currentAchievement, setCurrentAchievement] = useState(achievement);

  // Update local state when achievement prop changes
  React.useEffect(() => {
    setIsLiked(achievement.is_liked || false);
    setLikeCount(achievement.like_count || 0);
    setCurrentAchievement(achievement);
  }, [achievement]);

  // Helper functions
  const getAchievementDisplayProps = (type) => {
    const types = {
      job: { 
        icon: '💼', 
        label: 'Job', 
        bgColor: 'bg-emerald-600', 
        textColor: 'text-white',
        indicatorColor: 'bg-emerald-500',
        borderColor: 'border-emerald-300/50'
      },
      project: { 
        icon: '🚀', 
        label: 'Project', 
        bgColor: 'bg-blue-600', 
        textColor: 'text-white',
        indicatorColor: 'bg-blue-500',
        borderColor: 'border-blue-300/50'
      },
      certificate: { 
        icon: '🎓', 
        label: 'Certificate', 
        bgColor: 'bg-indigo-600', 
        textColor: 'text-white',
        indicatorColor: 'bg-indigo-500',
        borderColor: 'border-indigo-300/50'
      },
      certification: { 
        icon: '🎓', 
        label: 'Certificate', 
        bgColor: 'bg-indigo-600', 
        textColor: 'text-white',
        indicatorColor: 'bg-indigo-500',
        borderColor: 'border-indigo-300/50'
      },
      award: { 
        icon: '🏆', 
        label: 'Award', 
        bgColor: 'bg-emerald-600', 
        textColor: 'text-white',
        indicatorColor: 'bg-emerald-500',
        borderColor: 'border-emerald-300/50'
      },
      education: { 
        icon: '🎓', 
        label: 'Education', 
        bgColor: 'bg-blue-600', 
        textColor: 'text-white',
        indicatorColor: 'bg-blue-500',
        borderColor: 'border-blue-300/50'
      },
      achievement: { 
        icon: '⭐', 
        label: 'Achievement', 
        bgColor: 'bg-slate-600', 
        textColor: 'text-white',
        indicatorColor: 'bg-slate-500',
        borderColor: 'border-slate-300/50'
      },
      default: { 
        icon: '📄', 
        label: 'Other', 
        bgColor: 'bg-slate-600', 
        textColor: 'text-white',
        indicatorColor: 'bg-slate-500',
        borderColor: 'border-slate-300/50'
      }
    };
    return types[type] || types.default;
  };

  const displayProps = getAchievementDisplayProps(achievement.type);

  const handleEdit = (e) => {
    e.stopPropagation();
    onEdit?.(achievement);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete?.(achievement);
  };

  const handleView = () => {
    setShowDetailsModal(true);
    onView?.(achievement);
  };

  const handleLike = async (e) => {
    e.stopPropagation();
    try {
      const newIsLiked = !isLiked;
      const newLikeCount = newIsLiked ? likeCount + 1 : likeCount - 1;
      
      // Update local state optimistically
      setIsLiked(newIsLiked);
      setLikeCount(newLikeCount);
      
      // Update current achievement state optimistically, including likes array
      const optimisticAchievement = {
        ...currentAchievement,
        is_liked: newIsLiked,
        like_count: newLikeCount
      };
      
      // Update the likes array optimistically if we have user data
      if (user) {
        if (newIsLiked) {
          // Add current user to likes array
          console.log('🔍 AchievementCard: Creating optimistic user like with user data:', {
            userId: user?.id,
            firstName: user?.first_name,
            lastName: user?.last_name,
            profilePicture: user?.profile?.profile_picture,
            nestedProfile: user?.profile,
            fullUser: user
          });
          
          // Ensure we have minimum required data for the user
          let userLike=null
          if (!user?.id) {
            console.warn('⚠️ AchievementCard: Cannot create optimistic like: user ID is missing');
            optimisticAchievement.likes = currentAchievement.likes || [];
          } else {
            console.warn('⚠️ AchievementCard: Cannot create optimistic like: user ID is missing');
            userLike = {
              user_profile: {
                user_id: user.id,
                first_name: user.first_name || user.name?.split(' ')[0] || 'Unknown',
                last_name: user.last_name || user.name?.split(' ')[1] || '',
                profile_picture: user.profile?.profile_picture || null
              }
            };
            
            console.log('🔍 AchievementCard: Created optimistic user like object:', userLike);
            optimisticAchievement.likes = [...(currentAchievement.likes || []), userLike];
          }
        } else {
          // Remove current user from likes array
          optimisticAchievement.likes = (currentAchievement.likes || []).filter(
            like => {
              const likeUserId = like.user_profile?.user_id;
              return likeUserId !== user.id;
            }
          );
        }
      }
      
      setCurrentAchievement(optimisticAchievement);
      
      if (onLike) {
        const response = await onLike(achievement.id, newIsLiked);
        
        // If the API response includes updated achievement data, use it
        if (response) {
          const updatedAchievement = {
            ...optimisticAchievement,
            like_count: response.like_count !== undefined ? response.like_count : newLikeCount,
            is_liked: response.is_liked !== undefined ? response.is_liked : newIsLiked
          };
          
          // Update likes array if provided in response
          if (response.likes) {
            updatedAchievement.likes = response.likes;
          }
          
          setCurrentAchievement(updatedAchievement);
          setLikeCount(updatedAchievement.like_count);
          setIsLiked(updatedAchievement.is_liked);
        }
      }

    } catch (error) {
      console.error('❌ Card handleLike - Error:', error);
      // Revert on error - go back to original state
      setIsLiked(achievement.is_liked || false);
      setLikeCount(achievement.like_count || 0);
      setCurrentAchievement({
        ...achievement,
        is_liked: achievement.is_liked || false,
        like_count: achievement.like_count || 0,
        likes: achievement.likes // Revert to original likes array
      });
    }
  };

  const handleComment = (e) => {
    e.stopPropagation();
    setShowDetailsModal(true);
    onComment?.(achievement);
  };

  // Handle achievement updates from modal
  const handleAchievementUpdate = (updatedAchievement) => {
    setIsLiked(updatedAchievement.is_liked);
    setLikeCount(updatedAchievement.like_count);
    setCurrentAchievement(updatedAchievement);
    
    // Notify parent component of the update
    if (onAchievementUpdate) {
      onAchievementUpdate(updatedAchievement);
    }
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d`;
    return date.toLocaleDateString();
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        whileHover={{ 
          scale: 1.02, 
          y: -6,
          boxShadow: "0 16px 32px -8px rgba(0, 0, 0, 0.12), 0 8px 20px -4px rgba(0, 0, 0, 0.08)",
          transition: { duration: 0.3, ease: "easeOut" }
        }}
        whileTap={{ 
          scale: 0.98,
          transition: { duration: 0.15 }
        }}
        onClick={handleView}
        className={`
          bg-gradient-to-br from-white via-white to-blue-50/30 
          border border-blue-200/40 hover:border-blue-300/60
          rounded-2xl shadow-lg hover:shadow-2xl
          backdrop-blur-sm transition-all duration-300 
          cursor-pointer group overflow-hidden
          hover:bg-gradient-to-br hover:from-white hover:via-blue-50/20 hover:to-indigo-50/40
          ${viewMode === 'list' ? 'flex items-center space-x-4 p-5' : `${compact ? 'p-5 h-80' : 'p-6 h-96'} flex flex-col`} ${className}
        `}
      >
      {viewMode === 'list' ? (
        // List View Layout
        <>
          {/* User Profile - Left */}
          {(achievement.user_profile || achievement.user) && showUser && (
            <div className="flex-shrink-0">
              {(achievement.user_profile?.profile_picture || achievement.user?.profile_picture) ? (
                <>
                  <img
                    src={getImageUrl(achievement.user_profile?.profile_picture || achievement.user?.profile_picture)}
                    alt={(achievement.user_profile?.first_name || achievement.user?.first_name || '') + ' ' + 
                         (achievement.user_profile?.last_name || achievement.user?.last_name || '')}
                    className="w-12 h-12 rounded-full object-cover border-3 border-white shadow-xl ring-2 ring-blue-200/60"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextElementSibling.style.display = 'flex';
                    }}
                  />
                  <div 
                    className="w-12 h-12 rounded-full hidden items-center justify-center text-white text-sm font-semibold bg-gray-500"
                  >
                    {(achievement.user_profile?.first_name || achievement.user?.first_name || '?').charAt(0).toUpperCase()}
                  </div>
                </>
              ) : (
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white text-sm font-bold bg-gradient-to-br from-blue-500 to-purple-600 shadow-xl ring-2 ring-blue-200/60"
                >
                  {(achievement.user_profile?.first_name || achievement.user?.first_name || '?').charAt(0).toUpperCase()}
                </div>
              )}
            </div>
          )}

          {/* Content - Center */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  {/* Type Badge */}
                  <div className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm border ${displayProps.bgColor} ${displayProps.textColor} ${displayProps.borderColor}`}>
                    <span className="text-sm">{displayProps.icon}</span>
                    <span>{displayProps.label}</span>
                  </div>
                  <div className={`w-1.5 h-1.5 rounded-full ${displayProps.indicatorColor} shadow-sm`}></div>
                </div>

                <h3 className="text-base font-semibold text-gray-900 truncate mb-1 group-hover:text-[#901b20] transition-colors duration-200">
                  {achievement.title}
                </h3>

                {(achievement.user_profile || achievement.user) && showUser && (
                  <p className="text-sm text-gray-600 mb-1">
                    by {achievement.user_profile?.first_name || achievement.user?.first_name || ''} {achievement.user_profile?.last_name || achievement.user?.last_name || ''} • {formatTimeAgo(achievement.created_at)}
                  </p>
                )}

                {achievement.description && (
                  <p className="text-sm text-gray-700 line-clamp-2">
                    {achievement.description}
                  </p>
                )}
              </div>

              {/* Actions - Right */}
              {showActions && (
                <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity ml-4">
                  <button
                    onClick={handleEdit}
                    className="p-2.5 text-gray-400 hover:text-[#901b20] hover:bg-gradient-to-r hover:from-red-50 hover:to-orange-50 rounded-xl transition-all duration-200 hover:scale-110 shadow-md border border-gray-200/50 hover:border-red-300/60"
                    title="Edit"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={handleDelete}
                    className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 rounded-xl transition-all duration-200 hover:scale-110 shadow-md border border-gray-200/50 hover:border-red-300/60"
                    title="Delete"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              )}
            </div>

            {/* Social Stats for List View */}
            {((likeCount > 0 || isLiked) || achievement.comment_count > 0) && (
              <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                {(likeCount > 0 || isLiked) && (
                  <span 
                    className="flex items-center space-x-1 relative group cursor-pointer"
                    title={achievement.likes && achievement.likes.length > 0 ? 
                      `Liked by: ${achievement.likes.map(like => `${like.user_profile?.first_name} ${like.user_profile?.last_name}`).join(', ')}` : 
                      `${likeCount} ${likeCount === 1 ? 'like' : 'likes'}`
                    }
                  >
                    <svg className="w-3 h-3 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <span>{likeCount}</span>
                    
                    {/* Tooltip for likes - List View */}
                    {achievement.likes && achievement.likes.length > 0 && (
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 whitespace-nowrap max-w-xs">
                        <div className="space-y-1">
                          {achievement.likes.slice(0, 5).map((like, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <div className="w-4 h-4 rounded-full bg-gray-600 overflow-hidden flex-shrink-0">
                                {like.user_profile?.profile_picture ? (
                                  <img 
                                    src={`${process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://127.0.0.1:8000'}/storage/${like.user_profile.profile_picture}`} 
                                    alt={`${like.user_profile.first_name} ${like.user_profile.last_name}`}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center bg-gray-500 text-white text-xs">
                                    {like.user_profile?.first_name?.charAt(0) || '?'}
                                  </div>
                                )}
                              </div>
                              <span className="text-xs">
                                {like.user_profile?.first_name} {like.user_profile?.last_name}
                              </span>
                            </div>
                          ))}
                          {achievement.likes.length > 5 && (
                            <div className="text-xs text-gray-300 pt-1">
                              and {achievement.likes.length - 5} more...
                            </div>
                          )}
                        </div>
                        {/* Tooltip arrow */}
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                      </div>
                    )}
                  </span>
                )}
                
                {achievement.comment_count > 0 && (
                  <span className="flex items-center space-x-1">
                    <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <span>{achievement.comment_count}</span>
                  </span>
                )}
              </div>
            )}
          </div>
        </>
      ) : (
        // Grid View Layout (Original)
        <>
          {/* Type Indicator and Status */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              {/* Type Badge */}
              <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-full text-sm font-semibold shadow-sm border ${displayProps.bgColor} ${displayProps.textColor} ${displayProps.borderColor}`}>
                <span className="text-sm">{displayProps.icon}</span>
                <span>{displayProps.label}</span>
              </div>
              
              {/* Status Indicator */}
              <div className="flex items-center space-x-1">
                <div className={`w-2 h-2 rounded-full ${displayProps.indicatorColor} shadow-sm`}></div>
              </div>
            </div>

            {/* Actions Menu */}
            {showActions && (
              <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={handleEdit}
                  className="p-2.5 text-gray-400 hover:text-[#901b20] hover:bg-gradient-to-r hover:from-red-50 hover:to-orange-50 rounded-xl transition-all duration-200 hover:scale-110 shadow-md border border-gray-200/50 hover:border-red-300/60"
                  title="Edit"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={handleDelete}
                  className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 rounded-xl transition-all duration-200 hover:scale-110 shadow-md border border-gray-200/50 hover:border-red-300/60"
                  title="Delete"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="flex flex-col flex-1 space-y-3">
            {/* User Information - moved to top */}
            {(achievement.user_profile || achievement.user) && showUser && (
              <div className="flex items-center space-x-3 mb-4">
                {/* Profile Image */}
                <div className="flex-shrink-0 relative">
                  {(achievement.user_profile?.profile_picture || achievement.user?.profile_picture) ? (
                    <>
                      <img
                        src={getImageUrl(achievement.user_profile?.profile_picture || achievement.user?.profile_picture)}
                        alt={(achievement.user_profile?.first_name || achievement.user?.first_name || '') + ' ' + 
                             (achievement.user_profile?.last_name || achievement.user?.last_name || '')}
                        className="w-10 h-10 rounded-full object-cover border-3 border-white shadow-xl ring-2 ring-blue-200/60"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextElementSibling.style.display = 'flex';
                        }}
                      />
                      <div 
                        className="w-10 h-10 rounded-full hidden items-center justify-center text-white text-sm font-semibold bg-gray-500"
                      >
                        {(achievement.user_profile?.first_name || achievement.user?.first_name || '?').charAt(0).toUpperCase()}
                      </div>
                    </>
                  ) : (
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold bg-gradient-to-br from-blue-500 to-purple-600 shadow-xl ring-2 ring-blue-200/60"
                    >
                      {(achievement.user_profile?.first_name || achievement.user?.first_name || '?').charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                
                {/* User Details */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {achievement.user_profile?.first_name || achievement.user?.first_name || ''} {achievement.user_profile?.last_name || achievement.user?.last_name || ''}
                  </p>
                  <p className="text-xs text-gray-500 font-medium">
                    {formatTimeAgo(achievement.created_at)}
                  </p>
                </div>
              </div>
            )}

            {/* Title */}
            <h3 className="text-lg font-semibold text-gray-900 leading-tight group-hover:text-[#901b20] transition-colors duration-200">
              {achievement.title}
            </h3>

            {/* Description */}
            {achievement.description && (
              <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 flex-1">
                {achievement.description}
              </p>
            )}

            {/* Meta Information */}
            <div className="flex items-center justify-end text-xs text-gray-500 pt-2 mt-auto">
              {/* Social Stats */}
              <div className="flex items-center space-x-4">
                {(likeCount > 0 || isLiked) && (
                  <span 
                    className="flex items-center space-x-1 relative group cursor-pointer"
                    title={achievement.likes && achievement.likes.length > 0 ? 
                      `Liked by: ${achievement.likes.map(like => `${like.user_profile?.first_name} ${like.user_profile?.last_name}`).join(', ')}` : 
                      `${likeCount} ${likeCount === 1 ? 'like' : 'likes'}`
                    }
                  >
                    <svg className="w-3 h-3 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <span>{likeCount}</span>
                    
                    {/* Tooltip for likes */}
                    {achievement.likes && achievement.likes.length > 0 && (
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 whitespace-nowrap max-w-xs">
                        <div className="space-y-1">
                          {achievement.likes.slice(0, 5).map((like, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <div className="w-4 h-4 rounded-full bg-gray-600 overflow-hidden flex-shrink-0">
                                {like.user_profile?.profile_picture ? (
                                  <img 
                                    src={`${process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://127.0.0.1:8000'}/storage/${like.user_profile.profile_picture}`} 
                                    alt={`${like.user_profile.first_name} ${like.user_profile.last_name}`}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center bg-gray-500 text-white text-xs">
                                    {like.user_profile?.first_name?.charAt(0) || '?'}
                                  </div>
                                )}
                              </div>
                              <span className="text-xs">
                                {like.user_profile?.first_name} {like.user_profile?.last_name}
                              </span>
                            </div>
                          ))}
                          {achievement.likes.length > 5 && (
                            <div className="text-xs text-gray-300 pt-1">
                              and {achievement.likes.length - 5} more...
                            </div>
                          )}
                        </div>
                        {/* Tooltip arrow */}
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                      </div>
                    )}
                  </span>
                )}
                
                {achievement.comment_count > 0 && (
                  <span className="flex items-center space-x-1">
                    <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <span>{achievement.comment_count}</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Hidden Action Buttons for hover interactions */}
          {(onLike || onComment) && (
            <motion.div 
              className="opacity-0 group-hover:opacity-100 transition-all duration-300 pt-5 mt-5 border-t border-gradient-to-r from-blue-100/80 to-purple-100/80"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 0 }}
              whileHover={{ opacity: 1 }}
              transition={{ delay: 0.15 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {onLike && (
                    <motion.button
                      onClick={handleLike}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`flex items-center space-x-2 text-sm transition-all duration-200 px-4 py-2.5 rounded-xl font-semibold shadow-lg hover:shadow-xl ${
                        isLiked 
                          ? 'text-white bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 border border-red-300/50' 
                          : 'text-gray-600 hover:text-white hover:bg-gradient-to-r hover:from-red-500 hover:to-pink-600 bg-white border border-gray-200/60 hover:border-red-300/60'
                      }`}
                    >
                      <motion.svg 
                        className="w-4 h-4" 
                        fill={isLiked ? "currentColor" : "none"} 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                        animate={isLiked ? { scale: [1, 1.2, 1] } : { scale: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
                        />
                      </motion.svg>
                      <span>{isLiked ? 'Liked' : 'Like'}</span>
                    </motion.button>
                  )}

                  {onComment && (
                    <motion.button
                      onClick={handleComment}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center space-x-2 text-sm text-gray-600 hover:text-white hover:bg-gradient-to-r hover:from-blue-500 hover:to-cyan-600 transition-all duration-200 px-4 py-2.5 rounded-xl font-semibold bg-white border border-gray-200/60 hover:border-blue-300/60 shadow-lg hover:shadow-xl"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      <span>Comment</span>
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </>
      )}
    </motion.div>
      
      {/* Achievement Details Modal */}
      <AchievementDetailsModal 
        isOpen={showDetailsModal} 
        onClose={() => setShowDetailsModal(false)} 
        achievement={currentAchievement}
        onAchievementUpdate={handleAchievementUpdate}
      />
    </>
  );
};

export default AchievementCard;
