/**
 * Email Verification API Service
 * Handles email verification and resend functionality
 */

const API_BASE_URL = process.env.REACT_APP_API_URL;

/**
 * Verify email with verification code
 */
export const verifyEmail = async (verificationCode, token = null) => {
  try {
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    };

    // Add authorization header if token is provided
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/auth/verify-email`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        verification_code: verificationCode
      })
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Email verification failed');
    }

    return {
      success: true,
      data: result.data,
      message: result.message || 'Email verified successfully'
    };

  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Network error occurred. Please check your connection and try again.');
    }
    throw error;
  }
};

/**
 * Resend verification email
 */
export const resendVerificationEmail = async (token) => {
  const response = await fetch(`${API_BASE_URL}/auth/resend-verification`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  
  return response;
};

/**
 * Check verification status
 */
export const checkVerificationStatus = async (email, token = null) => {
  try {
    const headers = {
      'Accept': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    };

    // Add authorization header if token is provided
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const url = new URL(`${API_BASE_URL}/auth/verification-status`);
    url.searchParams.append('email', email);

    const response = await fetch(url, {
      method: 'GET',
      headers
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to check verification status');
    }

    return {
      success: true,
      isVerified: result.is_verified,
      data: result.data
    };

  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Network error occurred. Please check your connection and try again.');
    }
    throw error;
  }
};
