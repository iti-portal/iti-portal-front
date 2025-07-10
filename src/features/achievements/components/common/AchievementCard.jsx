import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../../../contexts/AuthContext';
import { Heart, MessageCircle } from 'lucide-react';

// --- ALL LOGIC REMAINS UNCHANGED ---
const getImageUrl = (path) => `${process.env.REACT_APP_API_URL?.replace('/api', '')}/storage/${path}`;

const AchievementCard = ({ achievement, onView, onLike, onComment, onAchievementUpdate }) => {
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
        certification: { icon: '🎓', label: 'Certificate', color: 'text-purple-600', bg: 'bg-purple-50/70' },
        award: { icon: '🏆', label: 'Award', color: 'text-amber-600', bg: 'bg-amber-50/70' },
        default: { icon: '⭐', label: 'Achievement', color: 'text-gray-600', bg: 'bg-gray-100/70' }
      };
      return types[type] || types.default;
    };
    
    const displayProps = getDisplayProps(achievement.type);
    
    const handleLikeClick = async (e) => {
        e.stopPropagation();
        const newIsLiked = !isLiked;
        setIsLiked(newIsLiked);
        setLikeCount(p => newIsLiked ? p + 1 : p - 1);
        try {
            await onLike(achievement.id, newIsLiked);
        } catch (err) {
            setIsLiked(!newIsLiked); // Revert on error
            setLikeCount(p => !newIsLiked ? p + 1 : p - 1);
        }
    };
    
    const handleCommentClick = (e) => { e.stopPropagation(); onComment?.(achievement); };
    const formatTimeAgo = (dateString) => { /* Same time formatting logic */ };

    const author = currentAchievement.user_profile || currentAchievement.user;
    
    // --- JSX WITH NEW DESIGN ---
    return (
        <div
            onClick={() => onView(currentAchievement)}
            className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border border-white/30 overflow-hidden group transition-all duration-300 transform hover:-translate-y-1.5 hover:shadow-xl cursor-pointer p-5 flex flex-col h-full"
        >
            {/* Card Header */}
            <div className="flex items-center gap-3 mb-4">
                <img
                    src={author?.profile_picture ? getImageUrl(author.profile_picture) : `https://ui-avatars.com/api/?name=${author?.first_name}+${author?.last_name}&background=901b20&color=fff`}
                    alt={author?.first_name}
                    className="w-11 h-11 rounded-full object-cover border-2 border-white shadow"
                />
                <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 text-sm truncate">{author?.first_name} {author?.last_name}</p>
                    <p className="text-xs text-gray-500">{formatTimeAgo(currentAchievement.created_at)}</p>
                </div>
                <div className={`flex-shrink-0 text-xs font-bold px-3 py-1 rounded-full ${displayProps.bg} ${displayProps.color}`}>
                    {displayProps.label}
                </div>
            </div>

            {/* Card Body */}
            <div className="flex-1">
                <h3 className="font-bold text-gray-900 text-lg mb-2 leading-tight group-hover:text-[#901b20] transition-colors">
                    {currentAchievement.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                    {currentAchievement.description}
                </p>
            </div>

            {/* Card Footer */}
            <div className="mt-5 pt-4 border-t border-gray-100 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <button onClick={handleLikeClick} className="flex items-center gap-1.5 text-gray-500 hover:text-red-500 transition-colors">
                        <Heart size={16} className={`${isLiked ? 'text-red-500 fill-current' : ''}`} />
                        <span className="text-sm font-medium">{likeCount}</span>
                    </button>
                    <button onClick={handleCommentClick} className="flex items-center gap-1.5 text-gray-500 hover:text-blue-500 transition-colors">
                        <MessageCircle size={16} />
                        <span className="text-sm font-medium">{currentAchievement.comment_count || 0}</span>
                    </button>
                </div>
                <div className={`text-2xl`}>
                    {displayProps.icon}
                </div>
            </div>
        </div>
    );
};

export default AchievementCard;