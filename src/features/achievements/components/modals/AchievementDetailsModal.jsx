import React, { useState, useEffect, useRef, useCallback } from 'react';
import { likeAchievement, unlikeAchievement, addComment, deleteComment } from '../../../../services/achievementsService';
import { mapBackendTypeToFrontend } from '../../../../services/achievementsService';
import { useAuth } from '../../../../contexts/AuthContext';
import Modal from '../../../../components/UI/Modal';
import Alert from '../../../../components/UI/Alert';

const AchievementDetailsModal = ({ isOpen, onClose, achievement: initialAchievement, onAchievementUpdate }) => {
  const { user } = useAuth(); // Get current user from auth context
  const [achievement, setAchievement] = useState(null);
  const [loading] = useState(false);
  const [error, setError] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [commentError, setCommentError] = useState(null);
  const [showLikesList, setShowLikesList] = useState(false);
  const [notification, setNotification] = useState({ show: false, type: 'info', message: '', title: '' });
  const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);
  const [confirmModalContent, setConfirmModalContent] = useState({ title: '', message: '', onConfirm: () => {} });
  const commentsEndRef = useRef(null);

  // Scroll to bottom of comments when modal opens or comments change
  const scrollToBottom = () => {
    if (commentsEndRef.current) {
      commentsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Set achievement from props when modal opens
  useEffect(() => {
    if (isOpen && initialAchievement) {
      // Map backend type to frontend if needed
      const mappedAchievement = { ...initialAchievement };
      if (mappedAchievement.type) {
        mappedAchievement.type = mapBackendTypeToFrontend(mappedAchievement.type);
      }
      
      console.log('AchievementDetailsModal: Initializing internal achievement state from prop:', mappedAchievement);
      setAchievement(mappedAchievement);
      setError(null);
      // Scroll to bottom after a short delay to ensure content is rendered
      setTimeout(scrollToBottom, 100);
    }
  }, [isOpen, initialAchievement]);

  // Scroll to bottom when comments change
  useEffect(() => {
    if (achievement?.comments) {
      setTimeout(scrollToBottom, 100);
    }
  }, [achievement?.comments]);

  // Notification helpers
  const showNotification = (message, type = 'info', title = '') => {
    setNotification({ show: true, type, message, title });
    setTimeout(() => {
      setNotification({ show: false, type: 'info', message: '', title: '' });
    }, 5000);
  };

  const hideNotification = () => {
    setNotification({ show: false, type: 'info', message: '', title: '' });
  };

  // Handle like/unlike
  const handleLikeToggle = useCallback(async () => {
    if (!achievement || !user) return;
    
    const currentLikeState = achievement.is_liked;
    
    try {
      // Optimistic update - update both count and likes array
      const updatedAchievement = {
        ...achievement,
        is_liked: !currentLikeState,
        like_count: currentLikeState ? achievement.like_count - 1 : achievement.like_count + 1
      };
      
      // Update the likes array optimistically
      if (currentLikeState) {
        // Remove current user from likes array
        updatedAchievement.likes = (achievement.likes || []).filter(
          like => {
            const likeUserId = like.user_profile?.user_id;
            return likeUserId !== user.id;
          }
        );
      } else {
        // Add current user to likes array with correct structure to match backend
        const userLike = {
          user_profile: {
            user_id: user.id,
            first_name: user.first_name || user.name?.split(' ')[0] || 'Unknown',
            last_name: user.last_name || user.name?.split(' ')[1] || '',
            profile_picture: user.profile_picture || user.profile?.profile_picture || null
          }
        };
        
        console.log('🔍 Created optimistic user like object:', userLike);
        updatedAchievement.likes = [...(achievement.likes || []), userLike];
      }
      
      setAchievement(updatedAchievement);
      console.log('AchievementDetailsModal: After optimistic update, achievement state:', updatedAchievement);
      
      // Notify parent card of the update
      if (onAchievementUpdate) {
        onAchievementUpdate(updatedAchievement);
      }
      
      // Call API
      let apiResponse;
      if (currentLikeState) {
        apiResponse = await unlikeAchievement(achievement.id);
      } else {
        apiResponse = await likeAchievement(achievement.id);
      }
      
      // If the API response includes updated achievement data, use it
      if (apiResponse && apiResponse.success) {
        console.log('📡 Like API Response structure:', {
          hasLikes: !!apiResponse.likes,
          hasData: !!apiResponse.data,
          dataHasLikes: !!apiResponse.data?.likes,
          likesLength: apiResponse.likes?.length || apiResponse.data?.likes?.length || 0,
          likeCount: apiResponse.like_count || apiResponse.data?.like_count,
          isLiked: apiResponse.is_liked !== undefined ? apiResponse.is_liked : apiResponse.data?.is_liked,
          apiLikesStructure: (apiResponse.likes || apiResponse.data?.likes || []).map(like => ({
            hasUserProfile: !!like.user_profile,
            userProfileUserId: like.user_profile?.user_id,
            userProfileId: like.user_profile?.id,
            firstName: like.user_profile?.first_name,
            lastName: like.user_profile?.last_name
          }))
        });
        
        let updatedWithApiData = { ...updatedAchievement };
        
        // Check if response has direct like data
        if (apiResponse.likes !== undefined) {
          updatedWithApiData.likes = apiResponse.likes;
        }
        if (apiResponse.like_count !== undefined) {
          updatedWithApiData.like_count = apiResponse.like_count;
        }
        if (apiResponse.is_liked !== undefined) {
          updatedWithApiData.is_liked = apiResponse.is_liked;
        }
        
        // Check if response has nested data object
        if (apiResponse.data) {
          if (apiResponse.data.likes !== undefined) {
            updatedWithApiData.likes = apiResponse.data.likes;
          }
          if (apiResponse.data.like_count !== undefined) {
            updatedWithApiData.like_count = apiResponse.data.like_count;
          }
          if (apiResponse.data.is_liked !== undefined) {
            updatedWithApiData.is_liked = apiResponse.data.is_liked;
          }
        }
        
        setAchievement(updatedWithApiData);
        console.log('AchievementDetailsModal: After API response update, achievement state:', updatedWithApiData);
        
        // Notify parent card of the complete update
        if (onAchievementUpdate) {
          onAchievementUpdate(updatedWithApiData);
        }
      }
      
    } catch (err) {
      // Revert the optimistic update on error (including likes array)
      const revertedAchievement = {
        ...achievement,
        is_liked: currentLikeState, // Revert to original state
        like_count: currentLikeState ? 
          achievement.like_count - 1 : // Was liked, revert the +1
          achievement.like_count + 1,   // Was not liked, revert the -1
        likes: achievement.likes // Revert to original likes array
      };
      
      setAchievement(revertedAchievement);
      console.log('AchievementDetailsModal: After API error, reverted achievement state:', revertedAchievement);
      
      // Notify parent card of the revert
      if (onAchievementUpdate) {
        onAchievementUpdate(revertedAchievement);
      }
      
      // Show user-friendly error message
      showNotification?.(`Failed to ${currentLikeState ? 'unlike' : 'like'} achievement: ${err.message}`, 'error', 'Like Error');
    }
  }, [achievement, user, onAchievementUpdate, showNotification]);

  // Handle showing/hiding likes list
  const handleToggleLikesList = useCallback(async () => {
    // If we're hiding the likes list, just toggle it
    if (showLikesList) {
      setShowLikesList(false);
      return;
    }
    
    // Debug: Log current achievement data structure
    console.log('🔍 Current achievement likes data:', {
      achievementId: achievement?.id,
      likeCount: achievement?.like_count,
      hasLikes: !!achievement?.likes,
      likesLength: achievement?.likes?.length || 0,
      likesStructure: achievement?.likes?.map(like => ({
        hasUserProfile: !!like.user_profile,
        userProfileUserId: like.user_profile?.user_id,
        userProfileId: like.user_profile?.id,
        firstName: like.user_profile?.first_name,
        lastName: like.user_profile?.last_name,
        profilePicture: like.user_profile?.profile_picture,
        fullLike: like
      })) || []
    });
    
    // Show the likes list with current data
    // We rely on optimistic updates from like/unlike actions to keep the data fresh
    setShowLikesList(true);
  }, [achievement, showLikesList]);

  // Handle submit comment
  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || isSubmitting || !achievement) return;
    
    setIsSubmitting(true);
    setCommentError(null);
    
    try {
      const response = await addComment(achievement.id, newComment);
      
      if (response.success) {
        // Add the new comment to the UI
        const updatedAchievement = { ...achievement };
        
        // Extract comment data from various possible response structures
        let newCommentData = null;
        
        // Try to get comment from nested data.comment first
        if (response.data?.comment) {
          newCommentData = response.data.comment;
        } 
        // Then try direct data object
        else if (response.data && response.data.content) {
          newCommentData = response.data;
        }
        // Finally fallback to creating from available data
        else {
          newCommentData = {
            id: response.data?.id || response.id || `temp_${Date.now()}`,
            content: newComment,
            created_at: new Date().toISOString(),
            user_profile: response.data?.user_profile || {
              user_id: user?.id,
              id: user?.id,
              first_name: user?.first_name || user?.name?.split(' ')[0] || 'You',
              last_name: user?.last_name || user?.name?.split(' ')[1] || '',
              profile_picture: user?.profile?.profile_picture || user?.profile_picture || null
            }
          };
        }
        
        // Ensure comment has required fields
        if (!newCommentData.user_profile) {
          newCommentData.user_profile = {
            user_id: user?.id,
            id: user?.id,
            first_name: user?.first_name || user?.name?.split(' ')[0] || 'You',
            last_name: user?.last_name || user?.name?.split(' ')[1] || '',
            profile_picture: user?.profile?.profile_picture || user?.profile_picture || null
          };
        }
        
        updatedAchievement.comments = [
          ...(updatedAchievement.comments || []),
          newCommentData
        ];
        updatedAchievement.comment_count = (updatedAchievement.comment_count || 0) + 1;
        setAchievement(updatedAchievement);
        
        // Notify parent card of the update
        if (onAchievementUpdate) {
          onAchievementUpdate(updatedAchievement);
        }
        
        setNewComment('');
      } else {
        setCommentError('Failed to add comment');
      }
    } catch (err) {
      setCommentError(`Error: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete comment
  const handleDeleteComment = async (commentData, commentIndex) => {
    const comment = achievement.comments[commentIndex];
    
    // More robust permission check
    const achievementOwnerId = achievement.user_id || achievement.user?.id;
    const isAchievementOwner = user && achievementOwnerId === user.id;
    
    // More robust comment author check - try multiple possible ID fields
    const commentUserId = comment.user_profile?.user_id || 
                         comment.user_profile?.id || 
                         comment.user_id ||
                         comment.author_id;
    
    const isCommentAuthor = user && (commentUserId === user.id);
    
    if (!isAchievementOwner && !isCommentAuthor) {
      showNotification('You can only delete your own comments or comments on your achievements.', 'warning', 'Permission Denied');
      return;
    }
    
    const handleDelete = async () => {
        try {
            const response = await deleteComment(comment.id);
            
            if (response.success) {
                const updatedAchievement = { ...achievement };
                updatedAchievement.comments = updatedAchievement.comments.filter((_, index) => index !== commentIndex);
                updatedAchievement.comment_count = Math.max(0, (updatedAchievement.comment_count || 0) - 1);
                
                setAchievement(updatedAchievement);

                // Notify parent components of the update
                if (onAchievementUpdate) {
                    onAchievementUpdate(updatedAchievement);
                }
                
                showNotification('Comment deleted successfully.', 'success', 'Success');
            } else {
                showNotification('Failed to delete comment. Please try again.', 'error', 'Deletion Failed');
            }
        } catch (err) {
            showNotification(`Failed to delete comment: ${err.message}`, 'error', 'Deletion Error');
        }
    };

    if (comment.id) {
        setConfirmModalContent({
            title: 'Confirm Deletion',
            message: 'Are you sure you want to delete this comment?',
            onConfirm: () => {
                handleDelete();
                setConfirmModalOpen(false);
            }
        });
        setConfirmModalOpen(true);
    } else {
        showNotification(
            `Comment deletion is not yet available. This feature requires the backend to provide comment IDs.\n\nComment: "${comment.content}"\nBy: ${comment.user_profile?.first_name} ${comment.user_profile?.last_name}\nCreated: ${new Date(comment.created_at).toLocaleString()}`,
            'info',
            'Feature Not Available'
        );
    }
  };

  // Helper function to check if user can delete a comment
  const canDeleteComment = useCallback((comment) => {
    if (!user || !achievement) return false;
    
    // Achievement owner can delete any comment on their achievement
    const achievementOwnerId = achievement.user_id || achievement.user?.id;
    const isAchievementOwner = achievementOwnerId === user.id;
    
    // Comment author can delete their own comment
    // Try multiple possible user ID fields for robustness
    const commentAuthorId = comment.user_profile?.user_id || 
                           comment.user_profile?.id || 
                           comment.user_id ||
                           comment.author_id;
    const isCommentAuthor = commentAuthorId === user.id;
    
    return isAchievementOwner || isCommentAuthor;
  }, [user, achievement]);

  // Helper to format dates
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Get display properties based on achievement type
  const getTypeDisplay = (type) => {
    const types = {
      job: { icon: '💼', label: 'Job', color: 'text-green-600' },
      project: { icon: '🚀', label: 'Project', color: 'text-blue-600' },
      certificate: { icon: '🎓', label: 'Certificate', color: 'text-purple-600' },
      award: { icon: '🏆', label: 'Award', color: 'text-yellow-600' },
      default: { icon: '⭐', label: 'Achievement', color: 'text-gray-600' }
    };
    return types[type] || types.default;
  };

  return (
    <>
      <Alert
        show={notification.show}
        type={notification.type}
        message={notification.message}
        onClose={hideNotification}
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

      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <div
            className="bg-white rounded-xl shadow-xl max-w-2xl w-full flex flex-col h-[85vh] overflow-hidden relative"
            onClick={e => e.stopPropagation()}
          >
            {loading ? (
              <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : error ? (
              <div className="p-6 text-center">
                <div className="text-red-500 mb-4">
                  <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Achievement</h3>
                <p className="text-gray-600">{error}</p>
              </div>
            ) : achievement ? (
              <div className="flex flex-col h-full">
                {/* Header - Fixed at top */}
                <div className="flex items-center justify-between p-4 border-b">
                  <h2 className="text-xl font-semibold text-gray-800">Achievement Details</h2>
                  <button 
                    onClick={onClose}
                    className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors"
                    aria-label="Close"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                {/* Middle content - Scrollable */}
                <div className="flex-1 overflow-hidden flex flex-col">
                  {/* Achievement details - Compact */}
                  <div className="p-4 border-b flex-shrink-0">
                    <div className="flex items-start">
                      {/* User avatar */}
                      <div className="mr-3 flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                          {(achievement.user_profile?.profile_picture || achievement.user?.profile_picture) ? (
                            <img 
                              src={`${process.env.REACT_APP_API_URL?.replace('/api', '')}/storage/${achievement.user_profile?.profile_picture || achievement.user?.profile_picture}`} 
                              alt={`${achievement.user_profile?.first_name || achievement.user?.first_name || ''} ${achievement.user_profile?.last_name || achievement.user?.last_name || ''}`}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-600">
                              {(achievement.user_profile?.first_name || achievement.user?.first_name || '?').charAt(0)}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Achievement content */}
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold">{achievement.title}</h3>
                        
                        {/* User and type */}
                        <div className="flex items-center text-sm text-gray-600 mt-1">
                          <span className="font-medium">
                            {achievement.user_profile?.first_name} {achievement.user_profile?.last_name}
                          </span>
                          <span className="mx-2">•</span>
                          <span className={`flex items-center ${getTypeDisplay(achievement.type).color}`}>
                            <span className="mr-1">{getTypeDisplay(achievement.type).icon}</span>
                            {getTypeDisplay(achievement.type).label}
                          </span>
                          <span className="mx-2">•</span>
                          <span>{formatDate(achievement.created_at)}</span>
                        </div>
                        
                        {/* Description - Compact */}
                        {achievement.description && (
                          <p className="mt-2 text-gray-800 text-sm line-clamp-2">{achievement.description}</p>
                        )}
                        
                        {/* Additional details based on type - Compact */}
                        {achievement.organization && (
                          <div className="mt-1 text-sm">
                            <span className="font-medium">Organization:</span> {achievement.organization}
                          </div>
                        )}
                        
                        {/* Social stats */}
                        <div className="flex items-center mt-3 text-sm text-gray-600">
                          <button 
                            onClick={handleLikeToggle}
                            className={`flex items-center mr-4 transition-colors ${achievement.is_liked ? 'text-red-600' : 'text-gray-500 hover:text-red-600'}`}
                          >
                            <svg className="w-4 h-4 mr-1" fill={achievement.is_liked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                              <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                            {achievement.like_count} {achievement.like_count === 1 ? 'Like' : 'Likes'}
                          </button>
                          
                          {/* Clickable likes count to see who liked - Show if there are likes count > 0 */}
                          {achievement.like_count > 0 && (
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleToggleLikesList();
                              }}
                              className="text-xs text-blue-600 hover:text-blue-800 underline mr-4 px-1 py-0.5 rounded transition-colors"
                              type="button"
                            >
                              View {achievement.like_count} {achievement.like_count === 1 ? 'like' : 'likes'}
                            </button>
                          )}
                          
                          <div className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            {achievement.comment_count} {achievement.comment_count === 1 ? 'Comment' : 'Comments'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Comments section - Takes remaining space */}
                  <div className="flex-1 p-4 flex flex-col overflow-hidden">
                    <h3 className="font-medium text-gray-900 mb-3 flex items-center flex-shrink-0">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Comments {achievement.comment_count > 0 && `(${achievement.comment_count})`}
                    </h3>
                    
                    {/* Comment list - scrollable and takes remaining space */}
                    <div className="flex-1 border border-gray-200 rounded-lg overflow-y-auto"
                         style={{ minHeight: '200px' }}>
                      {achievement.comments && achievement.comments.filter(comment => comment.user_profile !== null).length > 0 ? (
                        <div className="space-y-4 p-4">
                          {/* Show orphaned comments notification if any exist */}
                          {achievement.comments.filter(comment => comment.user_profile === null).length > 0 && (
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                              <div className="flex items-center">
                                <svg className="w-5 h-5 text-yellow-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.866-.833-2.536 0L3.28 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                                <div className="text-sm">
                                  <p className="text-yellow-800 font-medium">Some comments cannot be displayed</p>
                                  <p className="text-yellow-700 mt-1">
                                    {achievement.comments.filter(comment => comment.user_profile === null).length} comment(s) are missing user information and cannot be shown.
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                          
                          {achievement.comments
                            .filter(comment => comment.user_profile !== null) // Filter out comments with null user_profile
                            .map((comment, originalIndex) => {
                              // Find the original index in the unfiltered array for proper deletion
                              const actualIndex = achievement.comments.findIndex(c => c.id === comment.id);
                              return (
                                <div key={comment.id || originalIndex} className="flex">
                                  {/* Comment avatar */}
                                  <div className="mr-3 flex-shrink-0">
                                    <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                                      {(comment.user_profile?.profile_picture || comment.user?.profile_picture) ? (
                                        <img 
                                          src={`${process.env.REACT_APP_API_URL?.replace('/api', '')}/storage/${comment.user_profile?.profile_picture || comment.user?.profile_picture}`} 
                                          alt={`${comment.user_profile?.first_name || comment.user?.first_name || ''} ${comment.user_profile?.last_name || comment.user?.last_name || ''}`}
                                          className="w-full h-full object-cover"
                                        />
                                      ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-600">
                                          {(comment.user_profile?.first_name || comment.user?.first_name || '?').charAt(0)}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  
                                  {/* Comment content */}
                                  <div className="flex-1 min-w-0">
                                    <div className="bg-gray-100 rounded-lg p-3 hover:bg-gray-200 transition-colors relative group">
                                      <div className="font-medium text-sm text-gray-900">
                                        {comment.user_profile?.first_name || comment.user?.first_name || ''} {comment.user_profile?.last_name || comment.user?.last_name || ''}
                                      </div>
                                      <p className="text-sm mt-1 text-gray-700 whitespace-pre-line break-words">{comment.content}</p>
                                      
                                      {/* Delete button - shows on hover only if user has permission */}
                                      {canDeleteComment(comment) && (
                                        <button
                                          onClick={() => handleDeleteComment(comment, actualIndex)}
                                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-white"
                                          title="Delete comment"
                                        >
                                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                          </svg>
                                        </button>
                                      )}
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1 flex items-center">
                                      {formatDate(comment.created_at)}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          <div ref={commentsEndRef} />
                        </div>
                      ) : (
                        <div className="text-center text-gray-500 py-10 bg-gray-50 rounded-lg">
                          <svg className="w-16 h-16 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.083-.98L3 20l1.395-3.72C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9h.01M12 9h.01M17 9h.01" />
                          </svg>
                          <p className="font-medium">No comments yet</p>
                          <p className="text-xs mt-2 text-gray-400">Be the first to share your thoughts!</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Comment form - Fixed at bottom */}
                <div className="border-t p-4 bg-white flex-shrink-0">
                  <div className="flex items-center space-x-2 mb-3">
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <h3 className="font-medium text-gray-700">Add a comment</h3>
                  </div>
                  <form onSubmit={handleSubmitComment} className="flex">
                    <input
                      type="text"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Write a comment..."
                      className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                      disabled={isSubmitting}
                    />
                    <button
                      type="submit"
                      disabled={!newComment.trim() || isSubmitting}
                      className="bg-blue-600 text-white px-5 py-2.5 rounded-r-lg disabled:bg-blue-300 hover:bg-blue-700 transition-colors font-medium text-sm"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Sending
                        </span>
                      ) : 'Post'}
                    </button>
                  </form>
                  {commentError && (
                    <div className="text-red-500 text-sm mt-2">{commentError}</div>
                  )}
                </div>
              </div>
            ) : null}
          </div>
          
          {/* Likes List Overlay - appears on top when toggled */}
          {showLikesList && achievement && achievement.like_count > 0 && (
            <div 
              className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 rounded-xl"
              onClick={(e) => {
                e.stopPropagation();
                handleToggleLikesList();
              }}
            >
              <div 
                className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-96 flex flex-col"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                  <h4 className="font-medium text-gray-900 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    Liked by {achievement.like_count} {achievement.like_count === 1 ? 'person' : 'people'}
                  </h4>
                  <button
                    onClick={handleToggleLikesList}
                    className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                {/* Likes List */}
                <div className="flex-1 overflow-y-auto p-4">
                  {achievement.likes && achievement.likes.filter(like => like.user_profile !== null).length > 0 ? (
                    <div className="space-y-3">
                      {achievement.likes
                        .filter(like => like.user_profile !== null) // Filter out likes with null user_profile
                        .map((like, index) => (
                        <div key={index} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 overflow-hidden flex-shrink-0 shadow-sm">
                            {like.user_profile?.profile_picture ? (
                              <img 
                                src={`${process.env.REACT_APP_API_URL?.replace('/api', '')}/storage/${like.user_profile.profile_picture}`} 
                                alt={`${like.user_profile.first_name} ${like.user_profile.last_name}`}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  // Fallback to initials if image fails to load
                                  e.target.style.display = 'none';
                                  e.target.nextSibling.style.display = 'flex';
                                }}
                              />
                            ) : null}
                            <div 
                              className="w-full h-full flex items-center justify-center text-white text-sm font-semibold"
                              style={{ display: like.user_profile?.profile_picture ? 'none' : 'flex' }}
                            >
                              {like.user_profile?.first_name?.charAt(0)?.toUpperCase() || '?'}
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {like.user_profile?.first_name} {like.user_profile?.last_name}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              Liked this achievement
                            </p>
                          </div>
                          <div className="flex-shrink-0">
                            <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="text-gray-400 mb-3">
                        <svg className="w-16 h-16 mx-auto opacity-50" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </div>
                      <p className="text-sm font-medium text-gray-500 mb-1">Likes data loading...</p>
                      <p className="text-xs text-gray-400 mb-2">
                        {achievement.like_count} {achievement.like_count === 1 ? 'person likes' : 'people like'} this achievement
                      </p>
                      <p className="text-xs text-gray-400">
                        Try liking and unliking to update the list
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default AchievementDetailsModal;
