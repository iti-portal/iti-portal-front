import { useState, useCallback } from 'react';
import { forgotPassword } from '../services/authAPI';
import { initializeAuthErrors, formatAuthError } from '../utils/authHelpers';

/**
 * Forgot Password form hook
 * Manages forgot password form state and submission
 */
export const useForgotPassword = () => {
  // Form state
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState(initializeAuthErrors());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [message, setMessage] = useState('');

  /**
   * Handle email input change
   */
  const handleEmailChange = useCallback((e) => {
    setEmail(e.target.value);
    
    // Clear errors
    if (errors.email) {
      setErrors(prev => ({
        ...prev,
        email: ''
      }));
    }
    setMessage('');
  }, [errors.email]);

  /**
   * Clear all errors and messages
   */
  const clearErrors = useCallback(() => {
    setErrors(initializeAuthErrors());
    setMessage('');
  }, []);

  /**
   * Submit forgot password form
   */
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');
    clearErrors();

    try {
      const response = await forgotPassword(email);
      const data = await response.json();
      
      if (response.ok) {
        setMessage(data.message || 'Check your email for the reset link.');
        setSent(true);
      } else {
        setMessage(data.message || 'Failed to send reset link.');
      }
    } catch (error) {
      setMessage(formatAuthError(error));
    } finally {
      setIsSubmitting(false);
    }
  }, [email, clearErrors]);

  /**
   * Reset form to initial state
   */
  const resetForm = useCallback(() => {
    setEmail('');
    setErrors(initializeAuthErrors());
    setSent(false);
    setMessage('');
  }, []);

  return {
    email,
    errors,
    isSubmitting,
    sent,
    message,
    handleEmailChange,
    handleSubmit,
    clearErrors,
    resetForm
  };
};
