/**
 * Admin feature type definitions
 */

/**
 * @typedef {Object} AdminStats
 * @property {number} totalUsers - Total number of users
 * @property {number} newUsers - New users in the last period
 * @property {number} activeUsers - Currently active users
 * @property {number} totalJobs - Total number of jobs
 * @property {number} pendingApprovals - Pending approval requests
 */

/**
 * @typedef {Object} User
 * @property {string} id - User ID
 * @property {string} name - User name
 * @property {string} email - User email
 * @property {string} role - User role
 * @property {string} status - User status
 * @property {Date} createdAt - Account creation date
 */

/**
 * @typedef {Object} PaginatedResponse
 * @property {Array} items - Array of items
 * @property {number} total - Total number of items
 * @property {number} page - Current page
 * @property {number} totalPages - Total number of pages
 * @property {number} limit - Items per page
 */
