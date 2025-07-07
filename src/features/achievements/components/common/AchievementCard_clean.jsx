/**
 * AchievementCard Component
 * Twitter-like card component for displaying achievement data with social features
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
      job: { icon: '💼', label: 'Job', bgColor: 'bg-blue-100', textColor: 'text-blue-800' },
      project: { icon: '🚀', label: 'Project', bgColor: 'bg-green-100', textColor: 'text-green-800' },
      certification: { icon: '🏆', label: 'Certification', bgColor: 'bg-yellow-100', textColor: 'text-yellow-800' },
      education: { icon: '🎓', label: 'Education', bgColor: 'bg-purple-100', textColor: 'text-purple-800' },
      achievement: { icon: '⭐', label: 'Achievement', bgColor: 'bg-indigo-100', textColor: 'text-indigo-800' },
      default: { icon: '📄', label: 'Other', bgColor: 'bg-gray-100', textColor: 'text-gray-800' }
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

  const getProfileImageUrl = (profilePicture) => {
    if (!profilePicture) return null;
    if (profilePicture.startsWith('http')) return profilePicture;
    return `http://localhost:8000/storage/${profilePicture}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -1, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
      onClick={handleView}
      className={`
        bg-white rounded-xl border border-gray-100 hover:border-gray-200 
        transition-all duration-200 cursor-pointer group overflow-hidden
        ${compact ? 'p-4' : 'p-6'} ${className}
      `}
    >
      {/* User Header */}
      {showUser && (
        <div className="flex items-center space-x-3 mb-4">
          <div className="relative">
            {achievement.user?.profile_picture ? (
              <img
                src={getProfileImageUrl(achievement.user.profile_picture)}
                alt={achievement.user?.name || 'User'}
                className="w-10 h-10 rounded-full object-cover border-2 border-gray-100"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div 
              className={`w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm ${
                achievement.user?.profile_picture ? 'hidden' : 'flex'
              }`}
            >
              {achievement.user?.name?.charAt(0)?.toUpperCase() || '?'}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <h4 className="font-semibold text-gray-900 truncate">
                {achievement.user?.name || 'Unknown User'}
              </h4>
              <span className="text-gray-400">•</span>
              <span className="text-sm text-gray-500">
                {formatTimeAgo(achievement.created_at)}
              </span>
            </div>
          </div>
          
          {showActions && (
            <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={handleEdit}
                className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
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
      )}

      {/* Content */}
      <div className="space-y-3">
        {/* Type Badge and Title */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <span 
                className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${displayProps.bgColor} ${displayProps.textColor}`}
              >
                <span className="mr-1">{displayProps.icon}</span>
                {displayProps.label}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 leading-tight">
              {achievement.title}
            </h3>
          </div>
        </div>

        {/* Description */}
        {achievement.description && (
          <p className="text-gray-700 leading-relaxed">
            {achievement.description}
          </p>
        )}
      </div>

      {/* Social Actions */}
      <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-100">
        <div className="flex items-center space-x-6">
          {/* Like Button */}
          <button
            onClick={handleLike}
            className={`flex items-center space-x-2 text-sm transition-colors ${
              isLiked 
                ? 'text-red-600 hover:text-red-700' 
                : 'text-gray-500 hover:text-red-600'
            }`}
          >
            <svg 
              className={`w-5 h-5 transition-all ${isLiked ? 'fill-current scale-110' : 'stroke-current'}`} 
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
            <span className="font-medium">{likeCount}</span>
          </button>

          {/* Comment Button */}
          <button
            onClick={handleComment}
            className="flex items-center space-x-2 text-sm text-gray-500 hover:text-blue-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span className="font-medium">{achievement.comment_count || 0}</span>
          </button>

          {/* Share Button */}
          <button className="flex items-center space-x-2 text-sm text-gray-500 hover:text-green-600 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
            </svg>
          </button>
        </div>

        {/* View Details */}
        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors">
          View Details
        </button>
      </div>

      {/* Comments Section (Expandable) */}
      {showComments && achievement.comments && achievement.comments.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-4 pt-4 border-t border-gray-100 space-y-3"
        >
          <h4 className="font-medium text-gray-900 text-sm">Comments</h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {achievement.comments.slice(0, 3).map((comment, index) => (
              <div key={index} className="flex space-x-2 text-sm">
                <div className="w-6 h-6 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center text-xs">
                  {comment.user_profile?.first_name?.charAt(0)?.toUpperCase() || '?'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-900 text-xs">
                      {comment.user_profile ? `${comment.user_profile.first_name} ${comment.user_profile.last_name}` : 'Anonymous'}
                    </span>
                    <span className="text-gray-400 text-xs">
                      {formatTimeAgo(comment.created_at)}
                    </span>
                  </div>
                  <p className="text-gray-700 mt-1 text-xs leading-relaxed">
                    {comment.content}
                  </p>
                </div>
              </div>
            ))}
            {achievement.comments.length > 3 && (
              <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                View all {achievement.comments.length} comments
              </button>
            )}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default AchievementCard;
