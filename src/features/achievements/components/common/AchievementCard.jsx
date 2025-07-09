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
    <div
      className={`transition-shadow duration-200 rounded-2xl bg-white/90 border border-gray-100 shadow-sm hover:shadow-lg p-4 md:p-6 flex flex-col gap-3 ${className}`}
      style={{ minHeight: 120 }}
    >
      {/* User Info */}
      {showUser && achievement.user && (
        <div className="flex items-center gap-3 mb-2">
          <img
            src={achievement.user.profile_picture ? `http://127.0.0.1:8000/storage/${achievement.user.profile_picture.replace(/^\/+/, '')}` : '/avatar.png'}
            alt={achievement.user.first_name}
            className="w-10 h-10 rounded-full object-cover border border-gray-200 shadow-sm"
          />
          <div>
            <div className="font-semibold text-gray-900 text-base leading-tight">{achievement.user.first_name} {achievement.user.last_name}</div>
            <div className="text-xs text-gray-500">{achievement.user.job_profile}</div>
          </div>
        </div>
      )}
      {/* Title & Description */}
      <div className="flex-1">
        <div className="font-bold text-lg text-gray-800 mb-1 truncate">{achievement.title}</div>
        <div className="text-gray-600 text-sm line-clamp-3 mb-2">{achievement.description}</div>
      </div>
      {/* Actions */}
      <div className="flex items-center gap-4 mt-2">
        {/* Like, Comment, View, etc. Buttons (unchanged logic) */}
        {/* ...existing code for actions... */}
      </div>
    </div>
  );
};

export default AchievementCard;
