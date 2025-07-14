import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../contexts/AuthContext';
import { Heart, MessageCircle, Edit, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    const baseUrl = process.env.REACT_APP_API_URL;
    const cleanBaseUrl = baseUrl.replace('/api', '');
    return `${cleanBaseUrl}/storage/${path}`;
};

const AchievementCard = ({
  achievement,
  onView,
  onLike,
  onComment,
  onEdit,
  onDelete,
  showActions = true,
  showUser = true
}) => {
    const { user } = useAuth();
    const [currentAchievement, setCurrentAchievement] = useState(achievement);
    const [isLiked, setIsLiked] = useState(achievement.is_liked || false);
    const [likeCount, setLikeCount] = useState(achievement.like_count || 0);

    useEffect(() => {
        setCurrentAchievement(achievement);
        setIsLiked(achievement.is_liked || false);
        setLikeCount(achievement.like_count || 0);
    }, [achievement]);
    
    const getDisplayProps = (type) => {
      const types = {
        job: { icon: '💼', label: 'Job', color: 'text-green-600', bg: 'bg-green-50/70' },
        project: { icon: '🚀', label: 'Project', color: 'text-blue-600', bg: 'bg-blue-50/70' },
        certificate: { icon: '🎓', label: 'Certificate', color: 'text-purple-600', bg: 'bg-purple-50/70' },
        certification: { icon: '🎓', label: 'Certificate', color: 'text-purple-600', bg: 'bg-purple-50/70' },
        award: { icon: '🏆', label: 'Award', color: 'text-amber-600', bg: 'bg-amber-50/70' },
        education: { icon: '🎓', label: 'Education', color: 'text-indigo-600', bg: 'bg-indigo-50/70' },
        achievement: { icon: '⭐', label: 'Achievement', color: 'text-yellow-600', bg: 'bg-yellow-50/70' },
        default: { icon: '📄', label: 'Other', color: 'text-gray-600', bg: 'bg-gray-100/70' }
      };
      return types[type] || types.default;
    };
    
    const displayProps = getDisplayProps(achievement.type);
    
    const handleLikeClick = async (e) => { e.stopPropagation(); /* ... */ };
    const handleCommentClick = (e) => { e.stopPropagation(); onComment?.(achievement); };
    const handleEditClick = (e) => { e.stopPropagation(); onEdit?.(achievement); };
    const handleDeleteClick = (e) => { e.stopPropagation(); onDelete?.(achievement); };
    const formatTimeAgo = (dateString) => { /* ... */ };

    const author = currentAchievement.user_profile || currentAchievement.user;
    
    return (
        <div
            onClick={() => onView(currentAchievement)}
            className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border border-white/30 overflow-hidden group transition-all duration-300 transform hover:-translate-y-1.5 hover:shadow-xl cursor-pointer p-5 flex flex-col h-full"
        >
            <div className="flex items-start gap-3 mb-4">
                {showUser && author && (
                    <img
                        src={author.profile_picture ? getImageUrl(author.profile_picture) : `https://ui-avatars.com/api/?name=${author.first_name}+${author.last_name}&background=901b20&color=fff`}
                        alt={author.first_name}
                        className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-sm"
                    />
                )}
                <div className="flex-1 min-w-0">
                    {showUser && author && <p className="font-semibold text-gray-800 text-sm truncate">{author.first_name} {author.last_name}</p>}
                    <p className="text-xs text-gray-500">{formatTimeAgo(currentAchievement.created_at)}</p>
                </div>
                <div className={`flex-shrink-0 text-xs font-bold px-3 py-1 rounded-full ${displayProps.bg} ${displayProps.color}`}>
                    {displayProps.label}
                </div>
            </div>

            <div className="flex-1 flex flex-col">
                <h3 className="font-bold text-gray-900 text-lg mb-2 leading-tight group-hover:text-[#901b20] transition-colors">
                    {currentAchievement.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed line-clamp-4 flex-grow">
                    {currentAchievement.description}
                </p>
            </div>

            <div className="mt-5 pt-4 border-t border-gray-100 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    {showActions && onLike && ( <button onClick={handleLikeClick} className="flex items-center gap-1.5 text-gray-500 hover:text-red-500 transition-colors"><Heart size={16} className={`${isLiked ? 'text-red-500 fill-current' : ''}`} /> <span className="text-sm font-medium">{likeCount}</span></button> )}
                    {showActions && onComment && ( <button onClick={handleCommentClick} className="flex items-center gap-1.5 text-gray-500 hover:text-blue-500 transition-colors"><MessageCircle size={16} /> <span className="text-sm font-medium">{currentAchievement.comment_count || 0}</span></button> )}
                </div>
                <div className="flex items-center gap-2">
                    {onEdit && ( <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={handleEditClick} className="p-1.5 rounded-full hover:bg-gray-200/70 text-gray-500 hover:text-gray-700"><Edit size={16} /></motion.button> )}
                    {onDelete && ( <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={handleDeleteClick} className="p-1.5 rounded-full hover:bg-red-100 text-gray-500 hover:text-red-600"><Trash2 size={16} /></motion.button> )}
                </div>
            </div>
        </div>
    );
};

export default AchievementCard;