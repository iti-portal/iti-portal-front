import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { achievementAPI } from '../services/achievementAPI';
import { useAuth } from '../../../contexts/AuthContext';
import Navbar from '../../../components/Layout/Navbar';

const ViewAchievement = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [achievement, setAchievement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    const fetchAchievement = async () => {
      try {
        const data = await achievementAPI.getAchievementById(id);
        setAchievement(data);
        setLikeCount(data.likes?.length || 0);
        setIsLiked(data.likes?.some(like => like.user_id === user?.id) || false);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchAchievement();
  }, [id, user?.id]);

  const handleAddComment = async () => {
    if (!newComment.trim() || !achievement || !user) return;
    try {
      const commentData = { text: newComment };
      const updatedAchievement = await achievementAPI.addComment(achievement.id, commentData);
      setAchievement(updatedAchievement);
      setNewComment('');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await achievementAPI.deleteComment(achievement.id, commentId);
      setAchievement(prev => ({
        ...prev,
        comments: prev.comments.filter(comment => comment.id !== commentId),
      }));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLike = async () => {
    try {
      if (isLiked) {
        await achievementAPI.unlikeAchievement(achievement.id);
        setIsLiked(false);
        setLikeCount(prev => prev - 1);
      } else {
        await achievementAPI.likeAchievement(achievement.id);
        setIsLiked(true);
        setLikeCount(prev => prev + 1);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#901b20] mx-auto mb-4"></div>
            <p className="text-gray-600">Loading achievement...</p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-500 text-xl mb-4">Error: {error}</div>
            <button onClick={() => navigate(-1)} className="bg-[#901b20] text-white px-4 py-2 rounded hover:bg-[#7a1619]">
              Go Back
            </button>
          </div>
        </div>
      </>
    );
  }

  if (!achievement) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="text-gray-600 text-xl mb-4">Achievement not found.</div>
            <button onClick={() => navigate(-1)} className="bg-[#901b20] text-white px-4 py-2 rounded hover:bg-[#7a1619]">
              Go Back
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-6 border-b">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{achievement.title}</h1>
              <p className="text-gray-600 mb-4">{achievement.description}</p>

              {achievement.imageUrl && (
                <img src={achievement.imageUrl} alt={achievement.title} className="w-full h-64 object-cover rounded-lg mb-4" />
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <span className="text-sm text-gray-500">Type:</span>
                  <p className="font-medium capitalize">{achievement.type}</p>
                </div>
                {achievement.date && (
                  <div>
                    <span className="text-sm text-gray-500">Date:</span>
                    <p className="font-medium">{new Date(achievement.date).toLocaleDateString()}</p>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={handleLike}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    isLiked ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                  <span>{isLiked ? 'Liked' : 'Like'}</span>
                  <span className="bg-white bg-opacity-20 px-2 py-1 rounded text-sm">{likeCount}</span>
                </button>
              </div>
            </div>

            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">Comments</h2>

              {user && (
                <div className="mb-6">
                  <textarea
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#901b20] focus:border-transparent resize-none"
                    rows="3"
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                  />
                  <div className="flex justify-end mt-2">
                    <button
                      onClick={handleAddComment}
                      disabled={!newComment.trim()}
                      className="bg-[#901b20] text-white px-4 py-2 rounded-lg hover:bg-[#7a1619] disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      Add Comment
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                {achievement.comments?.length > 0 ? (
                  achievement.comments.map((comment) => (
                    <div key={comment.id} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-semibold text-gray-900">
                              {comment.username || 'Unknown'}
                            </span>
                            <span className="text-sm text-gray-500">
                              {comment.createdAt && new Date(comment.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-gray-700">{comment.text}</p>
                        </div>
                        {user && (user.id === comment.user_id || user.role === 'admin') && (
                          <button
                            onClick={() => handleDeleteComment(comment.id)}
                            className="text-red-500 hover:text-red-700 text-sm ml-4"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>No comments yet. Be the first to comment!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewAchievement;
