import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { initializeFormData, initializeErrors } from '../utils/formHelpers';
import { getStepsForRole, getNextStepForRole, getPreviousStepForRole } from '../constants/registrationSteps';
import { submitRegistration } from '../services/registrationAPI';

/**
 * Main registration form hook
 * Manages form state, validation, and submission
 */
export const useRegistrationForm = () => {
  const navigate = useNavigate();
  
  // Form state
  const [formData, setFormData] = useState(initializeFormData());
  const [errors, setErrors] = useState(initializeErrors());
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  /**
   * Handle form field changes
   */
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  }, [errors]);

  /**
   * Handle file uploads
   */
  const handleFileChange = useCallback((e) => {
    const { name, files } = e.target;
    if (files && files.length > 0) {
      setFormData(prev => ({
        ...prev,
        [name]: files[0]
      }));
      
      // Clear error for this field
      if (errors[name]) {
        setErrors(prev => ({
          ...prev,
          [name]: ''
        }));
      }
    }
  }, [errors]);

  /**
   * Update form data programmatically
   */
  const updateFormData = useCallback((updates) => {
    setFormData(prev => ({
      ...prev,
      ...updates
    }));
  }, []);

  /**
   * Set validation errors
   */
  const setValidationErrors = useCallback((validationErrors) => {
    setErrors(prev => ({
      ...prev,
      ...validationErrors
    }));
  }, []);

  /**
   * Clear all errors
   */
  const clearErrors = useCallback(() => {
    setErrors(initializeErrors());
    setSubmitError('');
  }, []);

  /**
   * Clear specific error
   */
  const clearError = useCallback((fieldName) => {
    if (fieldName === 'submit') {
      setSubmitError('');
    } else {
      setErrors(prev => ({
        ...prev,
        [fieldName]: ''
      }));
    }
  }, []);

  /**
   * Get steps for current role
   */
  const getSteps = useCallback(() => {
    return getStepsForRole(formData.role);
  }, [formData.role]);
  /**
   * Navigate to next step
   */
  const nextStep = useCallback(() => {
    const nextStepData = getNextStepForRole(currentStep, formData.role);
    if (nextStepData) {
      setCurrentStep(nextStepData.id);
      setSubmitError(''); // Clear submit error when navigating
    }
  }, [currentStep, formData.role]);

  /**
   * Navigate to previous step
   */
  const prevStep = useCallback(() => {
    const prevStepData = getPreviousStepForRole(currentStep, formData.role);
    if (prevStepData) {
      setCurrentStep(prevStepData.id);
      setSubmitError(''); // Clear submit error when navigating
    }
  }, [currentStep, formData.role]);

  /**
   * Go to specific step
   */
  const goToStep = useCallback((step) => {
    const steps = getStepsForRole(formData.role);
    const stepExists = steps.find(s => s.id === step);
    if (stepExists) {
      setCurrentStep(step);
    }
  }, [formData.role]);  /**
   * Submit registration
   */
  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true);
    setSubmitError('');

    try {
      const result = await submitRegistration(formData);
      
      if (result.success) {
        // Save token for email verification
        if (result.token) {
          localStorage.setItem('verify_token', result.token);
        }
        
        // Navigate to email verification
        navigate('/verify-email', { 
          state: { 
            email: formData.email,
            registrationSuccess: true
          } 
        });
        
        return result;
      } else {
        // Handle registration failure
        setSubmitError(result.error || 'Registration failed');
        return null;
      }
    } catch (error) {
      console.error('Registration error:', error);
      setSubmitError(error.message || 'An unexpected error occurred');
      return null;
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, navigate]);

  /**
   * Reset form to initial state
   */
  const resetForm = useCallback(() => {
    setFormData(initializeFormData());
    setErrors(initializeErrors());
    setCurrentStep(1);
    setIsSubmitting(false);
    setSubmitError('');
  }, []);

  /**
   * Get current step info
   */
  const getCurrentStepInfo = useCallback(() => {
    const steps = getStepsForRole(formData.role);
    return steps.find(step => step.id === currentStep);
  }, [currentStep, formData.role]);

  /**
   * Check if on first step
   */
  const isFirstStep = useCallback(() => {
    const steps = getStepsForRole(formData.role);
    return currentStep === steps[0]?.id;
  }, [currentStep, formData.role]);

  /**
   * Check if on last step
   */
  const isLastStep = useCallback(() => {
    const steps = getStepsForRole(formData.role);
    return currentStep === steps[steps.length - 1]?.id;
  }, [currentStep, formData.role]);
  return {
    // State
    formData,
    errors,
    currentStep,
    isSubmitting,
    submitError,
    
    // Actions
    handleChange,
    handleFileChange,
    updateFormData,
    setValidationErrors,
    clearErrors,
    clearError,
    nextStep,
    prevStep,
    goToStep,
    handleSubmit,
    resetForm,
    
    // Computed
    getSteps,
    getCurrentStepInfo,
    isFirstStep: isFirstStep(),
    isLastStep: isLastStep(),
    totalSteps: getStepsForRole(formData.role).length
  };
};

export default useRegistrationForm;
