import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/authAPI';
import { initializeLoginData, initializeAuthErrors, getDashboardRoute, formatAuthError } from '../utils/authHelpers';

/**
 * Login form hook
 * Manages login form state, validation, and submission
 */
export const useLogin = () => {
  const navigate = useNavigate();
  
  // Form state
  const [formData, setFormData] = useState(initializeLoginData());
  const [errors, setErrors] = useState(initializeAuthErrors());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: '', message: '', persistent: false });

  /**
   * Handle form field changes
   */
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear field error
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  }, [errors]);

  /**
   * Show alert message
   */
  const showAlert = useCallback((type, message, persistent = false) => {
    setAlert({ show: true, type, message, persistent });
    if (!persistent) {
      setTimeout(() => setAlert({ show: false, type: '', message: '', persistent: false }), 4000);
    }
  }, []);

  /**
   * Close alert
   */
  const handleCloseAlert = useCallback(() => {
    setAlert({ show: false, type: '', message: '', persistent: false });
  }, []);

  /**
   * Clear all errors
   */
  const clearErrors = useCallback(() => {
    setErrors(initializeAuthErrors());
    setAlert({ show: false, type: '', message: '', persistent: false });
  }, []);

  /**
   * Submit login form
   */
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    clearErrors();

    try {
      const { ok, data } = await loginUser(formData);
      
      if (ok && data.success && data.data?.token) {
        // Store token
        localStorage.setItem('token', data.data.token);        // Handle different user states
        if (data.data.role === 'admin') {
          showAlert('success', 'Login successful! Redirecting to admin dashboard...');
          setTimeout(() => {
            navigate('/admin/dashboard');
          }, 1500);
        } else if (!data.data.isVerified) {
          showAlert('warning', data.message || 'Please verify your email to complete the login.');
          setTimeout(() => {
            navigate('/verify-email', { state: { email: formData.email } });
          }, 1500);
        } else if (!data.data.isApproved) {
          showAlert('warning', 'Your account is pending approval. Please wait until an admin approves your account.', true);
        } else {
          // For all non-admin users (student, alumni, company, staff), redirect to homepage
          showAlert('success', 'Login successful! Redirecting to home page...');
          setTimeout(() => {
            navigate('/');
          }, 1500);
        }
      } else {
        showAlert('error', data.message || 'Login failed');
      }
    } catch (error) {
      showAlert('error', formatAuthError(error));
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, navigate, clearErrors, showAlert]);

  /**
   * Reset form to initial state
   */
  const resetForm = useCallback(() => {
    setFormData(initializeLoginData());
    setErrors(initializeAuthErrors());
    setAlert({ show: false, type: '', message: '', persistent: false });
  }, []);

  return {
    formData,
    errors,
    isSubmitting,
    alert,
    handleChange,
    handleSubmit,
    showAlert,
    handleCloseAlert,
    clearErrors,
    resetForm
  };
};
