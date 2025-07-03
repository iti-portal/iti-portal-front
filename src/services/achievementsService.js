/**
 * Achievements Service - Legacy Support
 * 
 * This file maintains backward compatibility by re-exporting all functions
 * from the new modular achievements service structure.
 * 
 * For new development, consider importing directly from:
 * - ./achievements/index.js (for all functions)
 * - ./achievements/achievements-api.js (for CRUD operations)
 * - ./achievements/achievements-interactions.js (for likes/comments)
 * - ./achievements/achievements-utils.js (for utilities)
 */

// Re-export all functions from the modular structure
export * from './achievements/index.js';