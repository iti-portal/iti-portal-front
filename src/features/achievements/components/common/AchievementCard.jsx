/**
 * AchievementCard Component
 * ITI-style card component for displaying achievement data
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../../../contexts/AuthContext';

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
  onAchievementUpdate,  showActions = false,
  showUser = true,
  compact = false,
  viewMode = 'grid',  className = '' 
}) => {
  const { user } = useAuth(); // Get current user
  const [isLiked, setIsLiked] = useState(achievement.is_liked || false);
  const [likeCount, setLikeCount] = useState(achievement.like_count || 0);
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
    <motion.div
      whileHover={{ y: -6, boxShadow: '0 8px 32px 0 rgba(32,57,71,0.10)' }}
      className={`relative bg-white/80 backdrop-blur-md rounded-2xl border border-gray-100 shadow-lg transition-all duration-300 cursor-pointer group overflow-hidden flex flex-col justify-between ${compact ? 'p-4' : 'p-6'} ${className}`}
      onClick={handleView}
      style={{ boxShadow: '0 4px 24px 0 rgba(32,57,71,0.07)', minHeight: viewMode === 'grid' ? 340 : undefined }}
    >
      {/* Gradient border ring at top left */}
      <div className="absolute -top-4 -left-4 w-24 h-24 bg-gradient-to-br from-[#901b20] via-[#fbeee6] to-[#203947] opacity-20 rounded-full blur-2xl z-0" />
      {/* Header: Avatar, Name, Time, Type Icon */}
      <div className="flex items-center mb-4 relative z-10">
        {(achievement.user_profile || achievement.user) && showUser && (
          <div className="flex-shrink-0 mr-3">
            {(achievement.user_profile?.profile_picture || achievement.user?.profile_picture) ? (
              <img
                src={getImageUrl(achievement.user_profile?.profile_picture || achievement.user?.profile_picture)}
                alt={(achievement.user_profile?.first_name || achievement.user?.first_name || '') + ' ' + 
                     (achievement.user_profile?.last_name || achievement.user?.last_name || '')}
                className="w-12 h-12 rounded-full object-cover border-2 border-white shadow"
                onError={(e) => {/* fallback logic */}}
              />
            ) : (
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-bold bg-gray-400">
                {(achievement.user_profile?.first_name || achievement.user?.first_name || '?').charAt(0).toUpperCase()}
              </div>
            )}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <span className="text-base font-semibold text-gray-900 truncate">
              {achievement.user_profile?.first_name || achievement.user?.first_name || ''} {achievement.user_profile?.last_name || achievement.user?.last_name || ''}
            </span>
            <span className="text-xs text-gray-400">• {formatTimeAgo(achievement.created_at)}</span>
          </div>
        </div>
        {/* Type Icon */}
        <div className={`ml-3 flex items-center justify-center w-10 h-10 rounded-full ${displayProps.bgColor} shadow border ${displayProps.borderColor}`}
          title={displayProps.label}
        >
          <span className={`text-xl ${displayProps.textColor}`}>{displayProps.icon}</span>
        </div>
      </div>
      {/* Title */}
      <h3 className="text-xl font-bold text-gray-900 mb-2 leading-tight truncate">
        {achievement.title}
      </h3>
      {/* Description */}
      {achievement.description && (
        <p className="text-gray-700 text-base leading-relaxed mb-4 line-clamp-3">{achievement.description}</p>
      )}
      {/* Actions and Stats */}
      <div className="flex items-center justify-between mt-auto pt-2 relative z-10">
        <div className="flex items-center space-x-3 text-xs text-gray-400">
          {(likeCount > 0 || isLiked) && (
            <span className="flex items-center space-x-1">
              <svg className="w-4 h-4 text-red-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span>{likeCount}</span>
            </span>
          )}
          {achievement.comment_count > 0 && (
            <span className="flex items-center space-x-1">
              <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span>{achievement.comment_count}</span>
            </span>
          )}
        </div>
        {(onLike || onComment) && (
          <div className="flex items-center space-x-2">
            {onLike && (
              <button
                onClick={handleLike}
                className={`flex items-center space-x-1 text-xs px-3 py-1 rounded-lg font-semibold transition-colors shadow-sm border border-red-200 ${isLiked ? 'text-red-600 bg-red-50' : 'text-gray-400 hover:text-red-600 hover:bg-red-50'}`}
                style={{ boxShadow: 'none' }}
              >
                <svg className="w-4 h-4" fill={isLiked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span>{isLiked ? 'Liked' : 'Like'}</span>
              </button>
            )}
            {onComment && (
              <button
                onClick={handleComment}
                className="flex items-center space-x-1 text-xs text-blue-500 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-lg font-semibold transition-colors shadow-sm border border-blue-200"
                style={{ boxShadow: 'none' }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span>Comment</span>
              </button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default AchievementCard;