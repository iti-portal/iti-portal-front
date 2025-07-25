/**
 * AchievementCard Component
 * ITI-style card component for displaying achievement data
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';

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
  className = '' 
}) => {
  const [isLiked, setIsLiked] = useState(achievement.is_liked || false);
  const [likeCount, setLikeCount] = useState(achievement.like_count || 0);
  const [showComments, setShowComments] = useState(false);

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
    onView?.(achievement);
  };

  const handleLike = async (e) => {
    e.stopPropagation();
    try {
      const newIsLiked = !isLiked;
      setIsLiked(newIsLiked);
      setLikeCount(prev => newIsLiked ? prev + 1 : prev - 1);
      
      if (onLike) {
        await onLike(achievement.id, newIsLiked);
      }
    } catch (error) {
      // Revert on error
      setIsLiked(!isLiked);
      setLikeCount(prev => isLiked ? prev + 1 : prev - 1);
      console.error('Error toggling like:', error);
    }
  };

  const handleComment = (e) => {
    e.stopPropagation();
    setShowComments(!showComments);
    onComment?.(achievement);
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -2, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
      onClick={handleView}
      className={`
        bg-white rounded-lg border border-gray-200 hover:border-gray-300
        transition-all duration-200 cursor-pointer group overflow-hidden
        ${compact ? 'p-4' : 'p-6'} ${className}
      `}
    >
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
        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 leading-tight">
          {achievement.title}
        </h3>

        {/* Subtitle/Company */}
        {achievement.user?.name && showUser && (
          <p className="text-sm text-gray-600">
            {achievement.user.name}
          </p>
        )}

        {/* Description */}
        {achievement.description && (
          <p className="text-gray-700 text-sm leading-relaxed line-clamp-3">
            {achievement.description}
          </p>
        )}

        {/* Meta Information */}
        <div className="flex items-center justify-between text-xs text-gray-500 pt-2">
          <span>{formatTimeAgo(achievement.created_at)}</span>
          
          {/* Social Stats */}
          <div className="flex items-center space-x-4">
            {(likeCount > 0 || isLiked) && (
              <span className="flex items-center space-x-1">
                <svg className="w-3 h-3 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span>{likeCount}</span>
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
    </motion.div>
  );
};

export default AchievementCard;
