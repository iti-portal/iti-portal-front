import { useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { resetPassword } from '../services/authAPI';
import { initializeAuthErrors, formatAuthError } from '../utils/authHelpers';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

/**
 * Reset Password form hook
 * Manages reset password form state and submission
 */
export const useResetPassword = () => {
  const query = useQuery();
  const email = query.get('email') || '';
  const token = query.get('token') || '';
  
  // Form state
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState(initializeAuthErrors());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reset, setReset] = useState(false);
  const [message, setMessage] = useState('');

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
    setMessage('');
  }, [errors]);

  /**
   * Clear all errors and messages
   */
  const clearErrors = useCallback(() => {
    setErrors(initializeAuthErrors());
    setMessage('');
  }, []);

  /**
   * Submit reset password form
   */
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');
    clearErrors();

    // Client-side validation
    if (formData.password !== formData.confirmPassword) {
      setErrors(prev => ({
        ...prev,
        confirmPassword: 'Passwords do not match'
      }));
      setIsSubmitting(false);
      return;
    }

    if (formData.password.length < 8) {
      setErrors(prev => ({
        ...prev,
        password: 'Password must be at least 8 characters'
      }));
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await resetPassword({
        email,
        token,
        password: formData.password,
        password_confirmation: formData.confirmPassword,
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setMessage(data.message || 'Password reset successful!');
        setReset(true);
      } else {
        setMessage(data.message || 'Failed to reset password.');
      }
    } catch (error) {
      setMessage(formatAuthError(error));
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, email, token, clearErrors]);

  /**
   * Reset form to initial state
   */
  const resetForm = useCallback(() => {
    setFormData({
      password: '',
      confirmPassword: ''
    });
    setErrors(initializeAuthErrors());
    setReset(false);
    setMessage('');
  }, []);

  return {
    formData,
    errors,
    isSubmitting,
    reset,
    message,
    email,
    token,
    handleChange,
    handleSubmit,
    clearErrors,
    resetForm
  };
};
