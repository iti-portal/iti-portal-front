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

/**
 * Get achievement display properties
 */
export const getAchievementDisplayProps = (type) => {
  const category = ACHIEVEMENT_CATEGORIES[type];
  return {
    icon: ACHIEVEMENT_ICONS[type] || '📋',
    color: ACHIEVEMENT_COLORS[type] || 'bg-gray-100 text-gray-800 border-gray-200',
    label: category?.label || 'Achievement',
    iconClass: category?.icon || 'article'
  };
};

/**
 * Generate achievement summary text
 */
export const generateAchievementSummary = (achievement) => {
  const { type, title, organization, start_date, end_date } = achievement;
  
  switch (type) {
    case ACHIEVEMENT_TYPES.PROJECT:
      return `Project: ${title}`;
    case ACHIEVEMENT_TYPES.JOB:
      return `${title} at ${organization || 'Company'}`;
    case ACHIEVEMENT_TYPES.CERTIFICATE:
      return `${title} from ${organization || 'Organization'}`;
    case ACHIEVEMENT_TYPES.AWARD:
      return `${title} from ${organization || 'Organization'}`;
    default:
      return title;
  }
};

/**
 * Get achievement time range text
 */
export const getTimeRangeText = (achievement) => {
  const { type, start_date, end_date, issue_date, received_date } = achievement;
  
  switch (type) {
    case ACHIEVEMENT_TYPES.PROJECT:
    case ACHIEVEMENT_TYPES.JOB:
      if (start_date && end_date) {
        return `${formatDate(start_date)} - ${formatDate(end_date)}`;
      } else if (start_date) {
        return `${formatDate(start_date)} - Present`;
      }
      break;
    case ACHIEVEMENT_TYPES.CERTIFICATE:
      if (issue_date) {
        return `Issued ${formatDate(issue_date)}`;
      }
      break;
    case ACHIEVEMENT_TYPES.AWARD:
      if (received_date) {
        return `Received ${formatDate(received_date)}`;
      }
      break;
  }
  
  return '';
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
