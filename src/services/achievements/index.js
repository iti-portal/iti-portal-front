/**
 * Achievements Service - Main Entry Point
 * 
 * This file exports all achievement-related functions from the modular services.
 * Import from this file to maintain compatibility with existing code.
 */

// Core API operations
export {
  getAchievements,
  getMyAchievements,
  getAllAchievements,
  getConnectionsAchievements,
  getPopularAchievements,
  getAchievementDetails,
  createAchievement,
  updateAchievement,
  deleteAchievement,
} from './achievements-api';

// Interactions (likes and comments)
export {
  likeAchievement,
  unlikeAchievement,
  addComment,
  getComments,
  deleteComment,
} from './achievements-interactions';

// Utility functions
export {
  mapFrontendTypeToBackend,
  mapBackendTypeToFrontend,
  transformAchievementData,
  buildQueryParams,
  validateAchievementData,
} from './achievements-utils';

// Legacy exports for backward compatibility
// These can be removed once all imports are updated
export * from './achievements-api';
export * from './achievements-interactions';
export * from './achievements-utils';
