import React, { useState, useEffect, useRef } from 'react';
import { Heart, MessageCircle, Calendar, Building, Award, User, X, Send, Trash2 } from 'lucide-react';

const ViewAchievement = ({ achievementId }) => {
  const [achievement, setAchievement] = useState(null);
  const [user] = useState({
    id: 1,
    first_name: "John",
    last_name: "Doe",
    profile_picture: null,
  });
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showLikesList, setShowLikesList] = useState(false);
  const commentsEndRef = useRef(null);

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

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const fetchAchievement = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:8000/api/achievements/${achievementId}`);
      console.log('Response:', response);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Non-JSON response received:', text);
        throw new Error(`Expected JSON but received ${contentType}. Response: ${text.substring(0, 200)}...`);
      }
      
      const data = await response.json();
      setAchievement(data);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (achievementId) {
      fetchAchievement();
    }
  }, [achievementId]);

  const handleLikeToggle = async () => {
    if (!achievement || !user) return;
    
    const currentLikeState = achievement.is_liked;
    
    const updatedAchievement = {
      ...achievement,
      is_liked: !currentLikeState,
      like_count: currentLikeState ? achievement.like_count - 1 : achievement.like_count + 1
    };
    
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
    
    // API Call: you would update this with your API logic
    // try {
    //   await (currentLikeState ? unlikeAchievement : likeAchievement)(achievement.id);
    // } catch (error) {
    //   // Revert on error
    //   setAchievement(achievement);
    // }
  };

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
    
    // API Call: you would add the comment via an API here
    // try {
    //   await addComment(achievement.id, newComment);
    // } catch (error) {
    //   // Handle error
    // }
  };

  const canDeleteComment = (comment) => {
    return user && achievement && (achievement.user_id === user.id || comment.user_profile?.user_id === user.id);
  };

  const handleDeleteComment = async (commentId) => {
    const updatedAchievement = {
      ...achievement,
      comments: achievement.comments.filter(comment => comment.id !== commentId),
      comment_count: Math.max(0, achievement.comment_count - 1)
    };
    
    setAchievement(updatedAchievement);
    
    // API Call: you would delete the comment via an API here
    // try {
    //   await deleteComment(commentId);
    // } catch (error) {
    //   // Handle error
    // }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading achievement...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
          <div className="text-center">
            <div className="bg-red-100 rounded-full p-3 mx-auto w-12 h-12 flex items-center justify-center mb-4">
              <X className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Achievement</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={fetchAchievement}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!achievement) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No achievement found</p>
        </div>
      </div>
    );
  }

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
                
                {/* Likes */}
                <div className="flex items-center space-x-2 mb-4">
                  <button 
                    className={`p-2 rounded-full ${achievement.is_liked ? 'bg-red-100' : 'bg-gray-100'}`}
                    onClick={handleLikeToggle}
                  >
                    <Heart className={`w-6 h-6 ${achievement.is_liked ? 'text-red-500' : 'text-gray-500'}`} />
                  </button>
                  <span className="font-medium text-gray-700">{achievement.like_count} Likes</span>
                </div>
                
                {/* Comment Section */}
                <div>
                  <div className="border-t py-4 mt-6">
                    <h3 className="text-lg font-semibold text-gray-800">Comments</h3>

                    {/* Add Comment */}
                    <div className="mt-4">
                      <textarea 
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                        placeholder="Add a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                      />
                      <button
                        onClick={handleSubmitComment}
                        disabled={isSubmitting || !newComment.trim()}
                        className="mt-2 text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? 'Posting...' : 'Post Comment'}
                      </button>
                    </div>
                  </div>

                  <div className="mt-6">
                    {achievement.comments && achievement.comments.length > 0 ? (
                      <ul className="space-y-4">
                        {achievement.comments.map(comment => (
                          <li key={comment.id} className="flex items-start space-x-4">
                            <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
                              {comment.user_profile?.profile_picture ? (
                                <img 
                                  src={comment.user_profile.profile_picture} 
                                  alt={`${comment.user_profile.first_name} ${comment.user_profile.last_name}`}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xl font-semibold">
                                  {comment.user_profile?.first_name?.charAt(0) || 'U'}
                                </div>
                              )}
                            </div>

                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <div>
                                  <span className="font-semibold">
                                    {comment.user_profile?.first_name} {comment.user_profile?.last_name}
                                  </span>
                                  <span className="text-sm text-gray-500 ml-2">{formatDate(comment.created_at)}</span>
                                </div>
                                {canDeleteComment(comment) && (
                                  <button
                                    onClick={() => handleDeleteComment(comment.id)}
                                    className="text-red-600 hover:text-red-800"
                                  >
                                    <Trash2 className="w-5 h-5" />
                                  </button>
                                )}
                              </div>
                              <p className="text-gray-700 mt-2">{comment.content}</p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500">No comments yet...</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewAchievement;