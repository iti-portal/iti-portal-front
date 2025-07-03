/**
 * Auth Feature Service Layer
 * Centralized API calls for authentication
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api';

/**
 * Login user
 */
export const loginUser = async (credentials) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: JSON.stringify(credentials)
    });

    const data = await response.json();
    return { ok: response.ok, data };
  } catch (error) {
    throw new Error('Network error occurred. Please try again.');
  }
};

/**
 * Forgot password request
 */
export const forgotPassword = async (email) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: JSON.stringify({ email })
    });

    return response;
  } catch (error) {
    throw new Error('Network error occurred. Please try again.');
  }
};

/**
 * Reset password
 */
export const resetPassword = async (resetData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: JSON.stringify(resetData)
    });

    return response;
  } catch (error) {
    throw new Error('Network error occurred. Please try again.');
  }
};

/**
 * Logout user
 */
export const logoutUser = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
        'X-Requested-With': 'XMLHttpRequest'
      }
    });

    return response;
  } catch (error) {
    throw new Error('Network error occurred. Please try again.');
  }
};

/**
 * Get current user
 */
export const getCurrentUser = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }

    const response = await fetch(`${API_BASE_URL}/auth/user`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
        'X-Requested-With': 'XMLHttpRequest'
      }
    });

    const data = await response.json();
    return { ok: response.ok, data };
  } catch (error) {
    throw new Error('Network error occurred. Please try again.');
  }
};
