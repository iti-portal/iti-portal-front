// Auth Feature Type Definitions

/**
 * Login form data structure
 */
export const INITIAL_LOGIN_DATA = {
  email: '',
  password: ''
};

/**
 * Forgot password form data structure
 */
export const INITIAL_FORGOT_PASSWORD_DATA = {
  email: ''
};

/**
 * Reset password form data structure
 */
export const INITIAL_RESET_PASSWORD_DATA = {
  password: '',
  confirmPassword: ''
};

/**
 * Auth form validation error structure
 */
export const AUTH_ERROR_STRUCTURE = {
  email: '',
  password: '',
  confirmPassword: '',
  general: ''
};

/**
 * Auth state structure
 */
export const INITIAL_AUTH_STATE = {
  isAuthenticated: false,
  user: null,
  token: null,
  loading: false,
  error: null
};

/**
 * User roles enum
 */
export const USER_ROLES = {
  ADMIN: 'admin',
  STUDENT: 'student',
  ALUMNI: 'alumni',
  COMPANY: 'company',
  STAFF: 'staff'
};

/**
 * Auth action types
 */
export const AUTH_ACTIONS = {
  LOGIN_START: 'LOGIN_START',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  LOGOUT: 'LOGOUT',
  SET_USER: 'SET_USER',
  CLEAR_ERROR: 'CLEAR_ERROR'
};
