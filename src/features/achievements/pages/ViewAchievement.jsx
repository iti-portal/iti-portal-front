import React, { useState, useEffect, useRef } from 'react';
import { Heart, MessageCircle, Calendar, Building, Award, User, X, Send, Trash2 } from 'lucide-react';

const AchievementDetailsPage = () => {
  // Mock data - replace with actual API call
  const [achievement, setAchievement] = useState({
    id: 1,
    title: "OS Application development",
    description: "I have many job profiles",
    type: "certificate",
    organization: "Tech Institute",
    created_at: "2023-07-10T00:00:00Z",
    like_count: 1,
    comment_count: 0,
    is_liked: true,
    user_profile: {
      first_name: "Luca",
      last_name: "Silva",
      profile_picture: null
    },
    comments: [],
    likes: [
      {
        user_profile: {
          user_id: 1,
          first_name: "John",
          last_name: "Doe",
          profile_picture: null
        }
      }
    ]
  });

  const [user] = useState({
    id: 1,
    first_name: "John",
    last_name: "Doe",
    profile_picture: null
  });

  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showLikesList, setShowLikesList] = useState(false);
  const commentsEndRef = useRef(null);

  // Get display properties based on achievement type
  const getTypeDisplay = (type) => {
    const types = {
      job: { icon: '💼', label: 'Job', color: 'text-green-600', bgColor: 'bg-green-50' },
      project: { icon: '🚀', label: 'Project', color: 'text-blue-600', bgColor: 'bg-blue-50' },
      certificate: { icon: '🎓', label: 'Certificate', color: 'text-purple-600', bgColor: 'bg-purple-50' },
      award: { icon: '🏆', label: 'Award', color: 'text-yellow-600', bgColor: 'bg-yellow-50' },
      default: { icon: '⭐', label: 'Achievement', color: 'text-gray-600', bgColor: 'bg-gray-50' }
    };
    return types[type] || types.default;
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Handle like toggle
  const handleLikeToggle = async () => {
    if (!achievement || !user) return;
    
    const currentLikeState = achievement.is_liked;
    
    // Optimistic update
    const updatedAchievement = {
      ...achievement,
      is_liked: !currentLikeState,
      like_count: currentLikeState ? achievement.like_count - 1 : achievement.like_count + 1
    };
    
    // Update likes array
    if (currentLikeState) {
      updatedAchievement.likes = achievement.likes.filter(
        like => like.user_profile?.user_id !== user.id
      );
    } else {
      const userLike = {
        user_profile: {
          user_id: user.id,
          first_name: user.first_name,
          last_name: user.last_name,
          profile_picture: user.profile_picture
        }
      };
      updatedAchievement.likes = [...achievement.likes, userLike];
    }
    
    setAchievement(updatedAchievement);
    
    // Here you would make the API call
    // try {
    //   await (currentLikeState ? unlikeAchievement : likeAchievement)(achievement.id);
    // } catch (error) {
    //   // Revert on error
    //   setAchievement(achievement);
    // }
  };

  // Handle comment submission
  const handleSubmitComment = async (e) => {
    if (e) e.preventDefault();
    if (!newComment.trim() || isSubmitting) return;
    
    setIsSubmitting(true);
    
    // Optimistic update
    const newCommentData = {
      id: Date.now(),
      content: newComment,
      created_at: new Date().toISOString(),
      user_profile: {
        user_id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        profile_picture: user.profile_picture
      }
    };
    
    const updatedAchievement = {
      ...achievement,
      comments: [...achievement.comments, newCommentData],
      comment_count: achievement.comment_count + 1
    };
    
    setAchievement(updatedAchievement);
    setNewComment('');
    setIsSubmitting(false);
    
    // Here you would make the API call
    // try {
    //   await addComment(achievement.id, newComment);
    // } catch (error) {
    //   // Handle error
    // }
  };

  // Check if user can delete comment
  const canDeleteComment = (comment) => {
    if (!user || !achievement) return false;
    
    const isAchievementOwner = achievement.user_id === user.id;
    const isCommentAuthor = comment.user_profile?.user_id === user.id;
    
    return isAchievementOwner || isCommentAuthor;
  };

  // Handle delete comment
  const handleDeleteComment = async (commentId) => {
    const updatedAchievement = {
      ...achievement,
      comments: achievement.comments.filter(comment => comment.id !== commentId),
      comment_count: Math.max(0, achievement.comment_count - 1)
    };
    
    setAchievement(updatedAchievement);
    
    // Here you would make the API call
    // try {
    //   await deleteComment(commentId);
    // } catch (error) {
    //   // Handle error
    // }
  };

  const typeDisplay = getTypeDisplay(achievement.type);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Achievement Details</h1>
            <button className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          {/* Achievement Header */}
          <div className="p-6 border-b">
            <div className="flex items-start space-x-4">
              {/* User Avatar */}
              <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                {achievement.user_profile?.profile_picture ? (
                  <img 
                    src={achievement.user_profile.profile_picture} 
                    alt={`${achievement.user_profile.first_name} ${achievement.user_profile.last_name}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xl font-semibold">
                    {achievement.user_profile?.first_name?.charAt(0) || 'U'}
                  </div>
                )}
              </div>

              {/* Achievement Info */}
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{achievement.title}</h2>
                
                {/* User and Type Info */}
                <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-1" />
                    <span className="font-medium">
                      {achievement.user_profile?.first_name} {achievement.user_profile?.last_name}
                    </span>
                  </div>
                  
                  <div className={`flex items-center px-3 py-1 rounded-full ${typeDisplay.bgColor} ${typeDisplay.color}`}>
                    <span className="mr-1">{typeDisplay.icon}</span>
                    <span className="font-medium">{typeDisplay.label}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>{formatDate(achievement.created_at)}</span>
                  </div>
                </div>

                {/* Description */}
                {achievement.description && (
                  <p className="text-gray-800 mb-4 text-lg">{achievement.description}</p>
                )}

                {/* Organization */}
                {achievement.organization && (
                  <div className="flex items-center text-sm text-gray-600 mb-4">
                    <Building className="w-4 h-4 mr-1" />
                    <span><span className="font-medium">Organization:</span> {achievement.organization}</span>
                  </div>
                )}

                {/* Social Stats */}
                <div className="flex items-center space-x-6">
                  <button 
                    onClick={handleLikeToggle}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                      achievement.is_liked 
                        ? 'bg-red-50 text-red-600 hover:bg-red-100' 
                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${achievement.is_liked ? 'fill-current' : ''}`} />
                    <span className="font-medium">{achievement.like_count}</span>
                    <span>{achievement.like_count === 1 ? 'Like' : 'Likes'}</span>
                  </button>
                  
                  {achievement.like_count > 0 && (
                    <button
                      onClick={() => setShowLikesList(!showLikesList)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium underline"
                    >
                      View {achievement.like_count} {achievement.like_count === 1 ? 'like' : 'likes'}
                    </button>
                  )}
                  
                  <div className="flex items-center space-x-2 text-gray-600">
                    <MessageCircle className="w-5 h-5" />
                    <span className="font-medium">{achievement.comment_count}</span>
                    <span>{achievement.comment_count === 1 ? 'Comment' : 'Comments'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Likes List */}
          {showLikesList && achievement.likes && achievement.likes.length > 0 && (
            <div className="border-b bg-gray-50 p-4">
              <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                <Heart className="w-5 h-5 mr-2 text-red-500" />
                Liked by {achievement.like_count} {achievement.like_count === 1 ? 'person' : 'people'}
              </h3>
              <div className="space-y-2">
                {achievement.likes.map((like, index) => (
                  <div key={index} className="flex items-center space-x-3 p-2 bg-white rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                      {like.user_profile?.profile_picture ? (
                        <img 
                          src={like.user_profile.profile_picture} 
                          alt={`${like.user_profile.first_name} ${like.user_profile.last_name}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs font-semibold">
                          {like.user_profile?.first_name?.charAt(0) || '?'}
                        </div>
                      )}
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {like.user_profile?.first_name} {like.user_profile?.last_name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Comments Section */}
          <div className="p-6">
            <h3 className="font-medium text-gray-900 mb-4 flex items-center">
              <MessageCircle className="w-5 h-5 mr-2" />
              Comments {achievement.comment_count > 0 && `(${achievement.comment_count})`}
            </h3>
            
            {/* Comments List */}
            <div className="space-y-4 mb-6">
              {achievement.comments && achievement.comments.length > 0 ? (
                achievement.comments.map((comment, index) => (
                  <div key={comment.id || index} className="flex space-x-3">
                    {/* Comment Avatar */}
                    <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                      {comment.user_profile?.profile_picture ? (
                        <img 
                          src={comment.user_profile.profile_picture} 
                          alt={`${comment.user_profile.first_name} ${comment.user_profile.last_name}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm font-semibold">
                          {comment.user_profile?.first_name?.charAt(0) || '?'}
                        </div>
                      )}
                    </div>
                    
                    {/* Comment Content */}
                    <div className="flex-1">
                      <div className="bg-gray-100 rounded-lg p-4 relative group">
                        <div className="font-medium text-sm text-gray-900 mb-1">
                          {comment.user_profile?.first_name} {comment.user_profile?.last_name}
                        </div>
                        <p className="text-gray-700 whitespace-pre-line">{comment.content}</p>
                        
                        {/* Delete button */}
                        {canDeleteComment(comment) && (
                          <button
                            onClick={() => handleDeleteComment(comment.id)}
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-white"
                            title="Delete comment"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {formatDate(comment.created_at)}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <MessageCircle className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500 font-medium">No comments yet</p>
                  <p className="text-gray-400 text-sm mt-1">Be the first to share your thoughts!</p>
                </div>
              )}
              <div ref={commentsEndRef} />
            </div>
            
            {/* Comment Form */}
            <div className="border-t pt-4">
              <h4 className="font-medium text-gray-700 mb-3 flex items-center">
                <MessageCircle className="w-4 h-4 mr-2" />
                Add a comment
              </h4>
              <div className="flex space-x-3">
                <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                  {user?.profile_picture ? (
                    <img 
                      src={user.profile_picture} 
                      alt={`${user.first_name} ${user.last_name}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm font-semibold">
                      {user?.first_name?.charAt(0) || 'U'}
                    </div>
                  )}
                </div>
                <div className="flex-1 flex space-x-2">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a comment..."
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={isSubmitting}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleSubmitComment(e);
                      }
                    }}
                  />
                  <button
                    onClick={handleSubmitComment}
                    disabled={!newComment.trim() || isSubmitting}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg disabled:bg-blue-300 hover:bg-blue-700 transition-colors font-medium flex items-center space-x-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isSubmitting ? 'Posting...' : 'Post'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AchievementDetailsPage;