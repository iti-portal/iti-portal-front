/**
 * AchievementCard Component
 * ITI-style card component for displaying achievement data
 */

import React, { useState } from 'react';
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
  showActions = false,
  showUser = true,
  compact = false,
  viewMode = 'grid', // 'grid' or 'list'
  className = '' 
}) => {
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
        bgColor: 'bg-green-100', 
        textColor: 'text-green-800',
        indicatorColor: 'bg-green-500',
        borderColor: 'border-green-200'
      },
      project: { 
        icon: '🚀', 
        label: 'Project', 
        bgColor: 'bg-blue-100', 
        textColor: 'text-blue-800',
        indicatorColor: 'bg-blue-500',
        borderColor: 'border-blue-200'
      },
      certificate: { 
        icon: '🎓', 
        label: 'Certificate', 
        bgColor: 'bg-purple-100', 
        textColor: 'text-purple-800',
        indicatorColor: 'bg-purple-500',
        borderColor: 'border-purple-200'
      },
      certification: { 
        icon: '🎓', 
        label: 'Certificate', 
        bgColor: 'bg-purple-100', 
        textColor: 'text-purple-800',
        indicatorColor: 'bg-purple-500',
        borderColor: 'border-purple-200'
      },
      award: { 
        icon: '🏆', 
        label: 'Award', 
        bgColor: 'bg-yellow-100', 
        textColor: 'text-yellow-800',
        indicatorColor: 'bg-yellow-500',
        borderColor: 'border-yellow-200'
      },
      education: { 
        icon: '🎓', 
        label: 'Education', 
        bgColor: 'bg-indigo-100', 
        textColor: 'text-indigo-800',
        indicatorColor: 'bg-indigo-500',
        borderColor: 'border-indigo-200'
      },
      achievement: { 
        icon: '⭐', 
        label: 'Achievement', 
        bgColor: 'bg-amber-100', 
        textColor: 'text-amber-800',
        indicatorColor: 'bg-amber-500',
        borderColor: 'border-amber-200'
      },
      default: { 
        icon: '📄', 
        label: 'Other', 
        bgColor: 'bg-gray-100', 
        textColor: 'text-gray-800',
        indicatorColor: 'bg-gray-500',
        borderColor: 'border-gray-200'
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
      

      
      // Update local state
      setIsLiked(newIsLiked);
      setLikeCount(newLikeCount);
      
      // Update current achievement state for modal
      setCurrentAchievement(prev => ({
        ...prev,
        is_liked: newIsLiked,
        like_count: newLikeCount
      }));
      
      if (onLike) {
        await onLike(achievement.id, newIsLiked);
      }

    } catch (error) {
      console.error('❌ Card handleLike - Error:', error);
      // Revert on error
      setIsLiked(!isLiked);
      setLikeCount(isLiked ? likeCount + 1 : likeCount - 1);
      setCurrentAchievement(prev => ({
        ...prev,
        is_liked: !prev.is_liked,
        like_count: prev.is_liked ? prev.like_count + 1 : prev.like_count - 1
      }));
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
      <div
        onClick={handleView}
        className={`
          bg-white rounded-lg border border-gray-200 hover:border-gray-300
          transition-all duration-200 cursor-pointer group overflow-hidden hover:shadow-md
          ${viewMode === 'list' ? 'flex items-center space-x-4 p-4' : `${compact ? 'p-4' : 'p-6'}`} ${className}
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
                    className="w-12 h-12 rounded-full object-cover border-2 border-gray-200 shadow-sm"
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
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white text-sm font-semibold bg-gray-500"
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
                  <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${displayProps.bgColor} ${displayProps.textColor}`}>
                    <span className="text-xs">{displayProps.icon}</span>
                    <span>{displayProps.label}</span>
                  </div>
                  <div className={`w-1.5 h-1.5 rounded-full ${displayProps.indicatorColor}`}></div>
                </div>

                <h3 className="text-base font-semibold text-gray-900 truncate mb-1">
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
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                    title="Edit"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={handleDelete}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
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
              <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${displayProps.bgColor} ${displayProps.textColor}`}>
                <span className="text-xs">{displayProps.icon}</span>
                <span>{displayProps.label}</span>
              </div>
              
              {/* Status Indicator */}
              <div className="flex items-center space-x-1">
                <div className={`w-2 h-2 rounded-full ${displayProps.indicatorColor}`}></div>
              </div>
            </div>

            {/* Actions Menu */}
            {showActions && (
              <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={handleEdit}
                  className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                  title="Edit"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={handleDelete}
                  className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
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
          <div className="space-y-3">
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
                        className="w-10 h-10 rounded-full object-cover border-2 border-gray-200 shadow-sm"
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
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-semibold bg-gray-500"
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
                  <p className="text-xs text-gray-500">
                    {formatTimeAgo(achievement.created_at)}
                  </p>
                </div>
              </div>
            )}

            {/* Title */}
            <h3 className="text-lg font-semibold text-gray-900 leading-tight">
              {achievement.title}
            </h3>

            {/* Description */}
            {achievement.description && (
              <p className="text-gray-700 text-sm leading-relaxed line-clamp-3">
                {achievement.description}
              </p>
            )}

            {/* Meta Information */}
            <div className="flex items-center justify-end text-xs text-gray-500 pt-2">
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
            <div className="opacity-0 group-hover:opacity-100 transition-opacity pt-3 mt-3 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {onLike && (
                    <button
                      onClick={handleLike}
                      className={`flex items-center space-x-1 text-xs transition-colors px-2 py-1 rounded ${
                        isLiked 
                          ? 'text-red-600 bg-red-50' 
                          : 'text-gray-500 hover:text-red-600 hover:bg-red-50'
                      }`}
                    >
                      <svg 
                        className="w-4 h-4" 
                        fill={isLiked ? "currentColor" : "none"} 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
                        />
                      </svg>
                      <span>{isLiked ? 'Liked' : 'Like'}</span>
                    </button>
                  )}

                  {onComment && (
                    <button
                      onClick={handleComment}
                      className="flex items-center space-x-1 text-xs text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors px-2 py-1 rounded"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      <span>Comment</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
      
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
