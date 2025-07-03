// src/features/student/utils/idGenerator.js

/**
 * Generates a unique ID for form items
 * @returns {string} A unique identifier string
 */
export const generateUniqueId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};
