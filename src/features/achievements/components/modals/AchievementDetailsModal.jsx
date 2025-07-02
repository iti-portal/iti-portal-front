import React, { useState, useEffect, useRef } from 'react';
import { likeAchievement, unlikeAchievement, addComment, deleteComment, getAchievementDetails } from '../../../../services/achievementsService';
import { mapBackendTypeToFrontend } from '../../../../services/achievementsService';
import { useAuth } from '../../../../contexts/AuthContext';

const AchievementDetailsModal = ({ isOpen, onClose, achievement: initialAchievement, onAchievementUpdate }) => {
  const { user } = useAuth(); // Get current user from auth context
  const [achievement, setAchievement] = useState(null);
  const [loading] = useState(false);
  const [error, setError] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [commentError, setCommentError] = useState(null);
  const [showLikesList, setShowLikesList] = useState(false);
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

  // Handle like/unlike
  const handleLikeToggle = async () => {
    if (!achievement) return;
    
    try {
      const currentLikeState = achievement.is_liked;
      
      
      // Optimistic update
      const updatedAchievement = {
        ...achievement,
        is_liked: !currentLikeState,
        like_count: currentLikeState ? achievement.like_count - 1 : achievement.like_count + 1
      };
      
      setAchievement(updatedAchievement);
      
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
      
      
      
      // If the API response includes updated achievement data with likes, use it
      if (apiResponse && apiResponse.likes) {
        const updatedWithLikes = {
          ...updatedAchievement,
          likes: apiResponse.likes,
          like_count: apiResponse.like_count || updatedAchievement.like_count,
          is_liked: apiResponse.is_liked !== undefined ? apiResponse.is_liked : updatedAchievement.is_liked
        };
        
        setAchievement(updatedWithLikes);
        
        // Notify parent card of the complete update
        if (onAchievementUpdate) {
          onAchievementUpdate(updatedWithLikes);
        }
      }
      
    } catch (err) {
      console.error('❌ Modal handleLikeToggle - Error:', err);
      // Revert on error
      const revertedAchievement = {
        ...achievement,
        is_liked: !achievement.is_liked,
        like_count: achievement.is_liked ? achievement.like_count - 1 : achievement.like_count + 1
      };
      
      setAchievement(revertedAchievement);
      
      // Notify parent card of the revert
      if (onAchievementUpdate) {
        onAchievementUpdate(revertedAchievement);
      }
      
      console.error('Failed to toggle like:', err);
    }
  };

  // Handle showing/hiding likes list
  const handleToggleLikesList = async () => {
    
    // If we're showing the likes list and don't have likes data, try to fetch it
    if (!showLikesList && achievement?.like_count > 0 && (!achievement?.likes || achievement.likes.length === 0)) {
      try {
        const freshData = await getAchievementDetails(achievement.id);
        
        if (freshData && freshData.likes) {
          const updatedAchievement = {
            ...achievement,
            likes: freshData.likes,
            like_count: freshData.like_count || achievement.like_count,
            is_liked: freshData.is_liked !== undefined ? freshData.is_liked : achievement.is_liked
          };
          
          setAchievement(updatedAchievement);
          
          // Notify parent card of the update
          if (onAchievementUpdate) {
            onAchievementUpdate(updatedAchievement);
          }
        }
      } catch (error) {
        console.error('❌ Failed to fetch fresh achievement data:', error);
      }
    }
    
    setShowLikesList(!showLikesList);
  };

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
        
        // Use the comment data from response if available, otherwise create with current user's data
        const newCommentData = response.data?.comment || {
          id: response.data?.id || Date.now(), // Use response ID or timestamp as fallback
          content: newComment,
          created_at: new Date().toISOString(),
          // Use the current user's profile instead of achievement owner's profile
          user_profile: response.data?.user_profile || {
            first_name: user?.first_name || user?.name?.split(' ')[0] || 'You',
            last_name: user?.last_name || user?.name?.split(' ')[1] || '',
            profile_picture: user?.profile_picture || null
          }
        };
        
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
    
    // Check if comment has an ID for deletion
    if (comment.id) {
      const confirmDelete = window.confirm('Are you sure you want to delete this comment?');
      if (!confirmDelete) return;
      
      try {
        const response = await deleteComment(comment.id);
        if (response.success) {
          // Remove comment from UI
          const updatedAchievement = { ...achievement };
          updatedAchievement.comments = updatedAchievement.comments.filter((_, index) => index !== commentIndex);
          updatedAchievement.comment_count = Math.max(0, (updatedAchievement.comment_count || 0) - 1);
          setAchievement(updatedAchievement);
          
          // Notify parent card of the update
          if (onAchievementUpdate) {
            onAchievementUpdate(updatedAchievement);
          }
        } else {
          alert('Failed to delete comment');
        }
      } catch (err) {
        console.error('Error deleting comment:', err);
        alert(`Failed to delete comment: ${err.message}`);
      }
    } else {
      // Show message if no ID available
      alert(`Comment deletion is not yet available. 
      
Comment: "${comment.content}"
By: ${comment.user_profile?.first_name} ${comment.user_profile?.last_name}
Created: ${new Date(comment.created_at).toLocaleString()}

This feature requires the backend to provide comment IDs.`);
    }
  };

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
                      {achievement.comments && achievement.comments.length > 0 ? (
                        <div className="space-y-4 p-4">
                          {achievement.comments.map((comment, index) => (
                            <div key={index} className="flex">
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
                                  
                                  {/* Delete button - shows on hover */}
                                  <button
                                    onClick={() => handleDeleteComment(comment, index)}
                                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-white"
                                    title="Delete comment"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                  </button>
                                </div>
                                <div className="text-xs text-gray-500 mt-1 flex items-center">
                                  {formatDate(comment.created_at)}
                                </div>
                              </div>
                            </div>
                          ))}
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
                  {achievement.likes && achievement.likes.length > 0 ? (
                    <div className="space-y-3">
                      {achievement.likes.map((like, index) => (
                        <div key={index} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg">
                          <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                            {like.user_profile?.profile_picture ? (
                              <img 
                                src={`${process.env.REACT_APP_API_URL?.replace('/api', '')}/storage/${like.user_profile.profile_picture}`} 
                                alt={`${like.user_profile.first_name} ${like.user_profile.last_name}`}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-600 text-sm font-medium">
                                {like.user_profile?.first_name?.charAt(0) || '?'}
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {like.user_profile?.first_name} {like.user_profile?.last_name}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="text-gray-400 mb-2">
                        <svg className="w-12 h-12 mx-auto" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </div>
                      <p className="text-sm text-gray-500">Likes data not available</p>
                      <p className="text-xs text-gray-400 mt-1">{achievement.like_count} people liked this post</p>
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
