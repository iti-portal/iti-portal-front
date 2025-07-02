/**
 * AchievementCard Component
 * Reusable card component for displaying achievement data
 */

import React from 'react';
import { motion } from 'framer-motion';
import { 
  getAchievementDisplayProps, 
  getTimeRangeText, 
  generateAchievementSummary 
} from '../../utils/achievementHelpers';

const AchievementCard = ({ 
  achievement, 
  onEdit, 
  onDelete, 
  onView,
  showActions = false,
  showUser = false,
  compact = false,
  className = '' 
}) => {
  const displayProps = getAchievementDisplayProps(achievement.type);
  const timeRange = getTimeRangeText(achievement);
  const summary = generateAchievementSummary(achievement);

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -2, boxShadow: '0 8px 25px rgba(0,0,0,0.1)' }}
      onClick={handleView}
      className={`
        bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md 
        transition-all duration-200 cursor-pointer overflow-hidden
        ${compact ? 'p-3' : 'p-4'}
        ${className}
      `}
    >
      {/* User Info (if showing user) */}
      {showUser && achievement.user && (
        <div className="flex items-center space-x-2 mb-2.5 pb-2.5 border-b border-gray-100">
          <img 
            src={achievement.user.avatar} 
            alt={achievement.user.name}
            className="w-6 h-6 rounded-full object-cover"
          />
          <div className="flex flex-col">
            <span className="text-xs font-medium text-gray-900">{achievement.user.name}</span>
            <span className="text-xs text-gray-500">{achievement.user.role}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center space-x-2">
          {/* Type Badge */}
          <div className={`
            px-2 py-0.5 rounded-full text-xs font-medium border
            ${displayProps.color}
          `}>
            <span className="mr-1">{displayProps.icon}</span>
            {displayProps.label}
          </div>
          
          {/* Status indicator */}
          {achievement.status && (
            <div className={`
              w-1.5 h-1.5 rounded-full
              ${achievement.status === 'published' ? 'bg-green-500' : 
                achievement.status === 'draft' ? 'bg-yellow-500' : 'bg-gray-500'}
            `} />
          )}
        </div>
        
        {/* Actions */}
        {showActions && (
          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handleEdit}
              className="p-1 rounded-md text-gray-400 hover:text-blue-600 hover:bg-blue-50"
              title="Edit"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={handleDelete}
              className="p-1 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50"
              title="Delete"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        )}
      </div>
      
      {/* Image */}
      {achievement.image && !compact && (
        <div className="mb-3">
          <img
            src={achievement.image}
            alt={achievement.title}
            className="w-full h-28 object-cover rounded-lg"
          />
        </div>
      )}
      
      {/* Content */}
      <div className="space-y-1.5">
        {/* Title */}
        <h3 className={`font-semibold text-gray-900 line-clamp-1 ${compact ? 'text-xs' : 'text-sm'}`}>
          {achievement.title}
        </h3>
        
        {/* Summary */}
        {!compact && (
          <p className="text-xs text-gray-600 line-clamp-1">
            {summary}
          </p>
        )}
        
        {/* Description */}
        <p className={`text-gray-600 ${compact ? 'text-xs line-clamp-1' : 'text-xs line-clamp-2'}`}>
          {achievement.description}
        </p>
        
        {/* Time range */}
        {timeRange && (
          <p className="text-xs text-gray-500">
            {timeRange}
          </p>
        )}
        
        {/* Tags */}
        {achievement.tags && achievement.tags.length > 0 && !compact && (
          <div className="flex flex-wrap gap-1 mt-2">
            {achievement.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-1.5 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-md"
              >
                {tag}
              </span>
            ))}
            {achievement.tags.length > 3 && (
              <span className="text-xs text-gray-500">
                +{achievement.tags.length - 3} more
              </span>
            )}
          </div>
        )}
        
        {/* Organization/URL */}
        {(achievement.organization || achievement.url) && (
          <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
            {achievement.organization && (
              <span className="text-xs truncate">{achievement.organization}</span>
            )}
            {achievement.url && (
              <a
                href={achievement.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-blue-600 hover:text-blue-800 text-xs ml-2"
              >
                View
              </a>
            )}
          </div>
        )}

        {/* Social Interaction */}
        {(achievement.like_count > 0 || achievement.comment_count > 0) && (
          <div className="flex items-center justify-between pt-2 mt-2 border-t border-gray-100">
            <div className="flex items-center space-x-3 text-xs text-gray-500">
              {achievement.like_count > 0 && (
                <div className="flex items-center space-x-1">
                  <svg 
                    className={`w-3.5 h-3.5 ${achievement.is_liked ? 'text-red-500 fill-current' : 'text-gray-400'}`} 
                    fill={achievement.is_liked ? 'currentColor' : 'none'} 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <span>{achievement.like_count}</span>
                </div>
              )}
              
              {achievement.comment_count > 0 && (
                <div className="flex items-center space-x-1">
                  <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.955 8.955 0 01-4.126-.98L3 21l1.98-5.874A8.955 8.955 0 013 12c0-4.418 3.582-8 8-8s8 3.582 8 8z" />
                  </svg>
                  <span>{achievement.comment_count}</span>
                </div>
              )}
            </div>
            
            <div className="text-xs text-gray-400">
              {new Date(achievement.created_at).toLocaleDateString()}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default AchievementCard;
