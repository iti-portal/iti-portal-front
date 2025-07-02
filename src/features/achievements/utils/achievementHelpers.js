/**
 * Achievement Helper Functions
 * Utility functions for achievement data manipulation and formatting
 */

import { ACHIEVEMENT_TYPES, ACHIEVEMENT_CATEGORIES } from '../types/achievementTypes';
import { ACHIEVEMENT_ICONS, ACHIEVEMENT_COLORS, DATE_FORMATS } from './achievementConstants';

/**
 * Format date for display
 */
export const formatDate = (dateString, format = DATE_FORMATS.display) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  
  const options = {
    year: 'numeric',
    month: 'short'
  };
  
  return date.toLocaleDateString('en-US', options);
};

/**
 * Calculate duration between two dates
 */
export const calculateDuration = (startDate, endDate) => {
  if (!startDate) return '';
  
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : new Date();
  
  if (isNaN(start.getTime()) || isNaN(end.getTime())) return '';
  
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const diffMonths = Math.round(diffDays / 30);
  const diffYears = Math.round(diffMonths / 12);
  
  if (diffYears > 0) {
    const remainingMonths = diffMonths % 12;
    return remainingMonths > 0 ? `${diffYears}y ${remainingMonths}m` : `${diffYears}y`;
  } else if (diffMonths > 0) {
    return `${diffMonths}m`;
  } else {
    return `${diffDays}d`;
  }
};

// Achievement type configurations for Twitter-like display
export const ACHIEVEMENT_TYPE_CONFIG = {
  job: {
    label: 'Job',
    icon: '💼',
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-800',
    borderColor: 'border-blue-200'
  },
  project: {
    label: 'Project',
    icon: '🚀',
    bgColor: 'bg-green-100',
    textColor: 'text-green-800',
    borderColor: 'border-green-200'
  },
  education: {
    label: 'Education',
    icon: '🎓',
    bgColor: 'bg-purple-100',
    textColor: 'text-purple-800',
    borderColor: 'border-purple-200'
  },
  certification: {
    label: 'Certification',
    icon: '🏆',
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-800',
    borderColor: 'border-yellow-200'
  },
  award: {
    label: 'Award',
    icon: '🥇',
    bgColor: 'bg-orange-100',
    textColor: 'text-orange-800',
    borderColor: 'border-orange-200'
  },
  skill: {
    label: 'Skill',
    icon: '⚡',
    bgColor: 'bg-indigo-100',
    textColor: 'text-indigo-800',
    borderColor: 'border-indigo-200'
  },
  achievement: {
    label: 'Achievement',
    icon: '✨',
    bgColor: 'bg-pink-100',
    textColor: 'text-pink-800',
    borderColor: 'border-pink-200'
  }
};

/**
 * Get display properties for an achievement type
 */
export const getAchievementDisplayProps = (type) => {
  const normalizedType = type?.toLowerCase() || 'achievement';
  return ACHIEVEMENT_TYPE_CONFIG[normalizedType] || ACHIEVEMENT_TYPE_CONFIG.achievement;
};

/**
 * Generate a time range text for an achievement
 */
export const getTimeRangeText = (achievement) => {
  if (!achievement) return null;
  
  const { start_date, end_date, created_at } = achievement;
  
  if (start_date && end_date) {
    const start = new Date(start_date);
    const end = new Date(end_date);
    
    const startFormatted = start.toLocaleDateString('en-US', { 
      month: 'short', 
      year: 'numeric' 
    });
    const endFormatted = end.toLocaleDateString('en-US', { 
      month: 'short', 
      year: 'numeric' 
    });
    
    return `${startFormatted} - ${endFormatted}`;
  } else if (start_date) {
    const start = new Date(start_date);
    const startFormatted = start.toLocaleDateString('en-US', { 
      month: 'short', 
      year: 'numeric' 
    });
    return `Started ${startFormatted}`;
  } else if (created_at) {
    const created = new Date(created_at);
    return `Added ${created.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric' 
    })}`;
  }
  
  return null;
};

/**
 * Generate a summary text for an achievement
 */
export const generateAchievementSummary = (achievement) => {
  if (!achievement) return '';
  
  const { type, title, description } = achievement;
  const typeConfig = getAchievementDisplayProps(type);
  
  let summary = `${typeConfig.icon} ${typeConfig.label}`;
  
  if (title) {
    summary += `: ${title}`;
  }
  
  return summary;
};

/**
 * Sort achievements by date (most recent first)
 */
export const sortAchievementsByDate = (achievements) => {
  return [...achievements].sort((a, b) => {
    const getDate = (achievement) => {
      return achievement.start_date || 
             achievement.issue_date || 
             achievement.received_date || 
             achievement.created_at;
    };
    
    const dateA = new Date(getDate(a));
    const dateB = new Date(getDate(b));
    
    return dateB - dateA; // Most recent first
  });
};

/**
 * Filter achievements by type
 */
export const filterAchievementsByType = (achievements, type) => {
  if (!type || type === 'all') return achievements;
  return achievements.filter(achievement => achievement.type === type);
};

/**
 * Search achievements by text
 */
export const searchAchievements = (achievements, searchText) => {
  if (!searchText.trim()) return achievements;
  
  const searchLower = searchText.toLowerCase();
  return achievements.filter(achievement => 
    achievement.title.toLowerCase().includes(searchLower) ||
    achievement.description.toLowerCase().includes(searchLower) ||
    (achievement.organization && achievement.organization.toLowerCase().includes(searchLower)) ||
    (achievement.tags && achievement.tags.some(tag => tag.toLowerCase().includes(searchLower)))
  );
};

/**
 * Validate achievement data
 */
export const validateAchievement = (achievement) => {
  const errors = {};
  
  if (!achievement.title?.trim()) {
    errors.title = 'Title is required';
  }
  
  if (!achievement.description?.trim()) {
    errors.description = 'Description is required';
  }
  
  // Type-specific validations
  switch (achievement.type) {
    case ACHIEVEMENT_TYPES.PROJECT:
      if (!achievement.start_date) {
        errors.start_date = 'Start date is required';
      }
      break;
    case ACHIEVEMENT_TYPES.JOB:
      if (!achievement.organization?.trim()) {
        errors.organization = 'Organization is required';
      }
      if (!achievement.position?.trim()) {
        errors.position = 'Position is required';
      }
      break;
    case ACHIEVEMENT_TYPES.CERTIFICATE:
      if (!achievement.organization?.trim()) {
        errors.organization = 'Issuing organization is required';
      }
      if (!achievement.issue_date) {
        errors.issue_date = 'Issue date is required';
      }
      break;
    case ACHIEVEMENT_TYPES.AWARD:
      if (!achievement.organization?.trim()) {
        errors.organization = 'Awarding organization is required';
      }
      if (!achievement.received_date) {
        errors.received_date = 'Award date is required';
      }
      break;
  }
  
  return errors;
};

/**
 * Get achievement completion percentage
 */
export const getAchievementCompletionPercentage = (achievement) => {
  const category = ACHIEVEMENT_CATEGORIES[achievement.type];
  if (!category) return 0;
  
  const requiredFields = category.fields.filter(field => 
    ['title', 'description'].includes(field) // Always required
  );
  
  const filledFields = requiredFields.filter(field => {
    const value = achievement[field];
    return value && (typeof value === 'string' ? value.trim() : true);
  });
  
  return Math.round((filledFields.length / requiredFields.length) * 100);
};

/**
 * Export achievement data for sharing
 */
export const exportAchievementData = (achievement) => {
  const exportData = {
    title: achievement.title,
    type: achievement.type,
    description: achievement.description,
    ...getTimeRangeText(achievement) && { timeRange: getTimeRangeText(achievement) },
    ...achievement.organization && { organization: achievement.organization },
    ...achievement.url && { url: achievement.url },
    exportedAt: new Date().toISOString()
  };
  
  return exportData;
};
