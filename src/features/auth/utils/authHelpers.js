import { INITIAL_LOGIN_DATA, AUTH_ERROR_STRUCTURE } from '../types/auth.types';

/**
 * Initialize form data with default values
 */
export const initializeLoginData = () => {
  return { ...INITIAL_LOGIN_DATA };
};

/**
 * Initialize error state
 */
export const initializeAuthErrors = () => {
  return { ...AUTH_ERROR_STRUCTURE };
};

/**
 * Validate email format
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 */
export const isValidPassword = (password) => {
  return password && password.length >= 8;
};

/**
 * Get user role display name
 */
export const getRoleDisplayName = (role) => {
  const roleNames = {
    admin: 'Administrator',
    student: 'Student',
    alumni: 'Alumni',
    company: 'Company',
    staff: 'Staff'
  };
  return roleNames[role] || 'User';
};

/**
 * Get dashboard route based on user role
 */
export const getDashboardRoute = (role) => {
  const routes = {
    admin: '/admin/dashboard',
    student: '/student/dashboard',
    alumni: '/alumni/dashboard',
    company: '/company/dashboard',
    staff: '/staff/dashboard'
  };
  return routes[role] || '/';
};

/**
 * Check if user has required permissions
 */
export const hasPermission = (userRole, requiredRole) => {
  const roleHierarchy = {
    admin: 5,
    staff: 4,
    company: 3,
    alumni: 2,
    student: 1
  };
  
  return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
};

/**
 * Format auth error messages
 */
export const formatAuthError = (error) => {
  if (typeof error === 'string') {
    return error;
  }
  
  if (error?.message) {
    return error.message;
  }
  
  return 'An unexpected error occurred. Please try again.';
};
