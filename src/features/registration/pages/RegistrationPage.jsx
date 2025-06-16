import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { useRegistrationForm } from '../hooks/useRegistrationForm';
import { useFormValidation } from '../hooks/useFormValidation';
import ProgressSteps from '../components/common/ProgressSteps';
import RegistrationHeader from '../components/common/RegistrationHeader';
import AccountTypeForm from '../components/forms/AccountTypeForm';
import PersonalInfoForm from '../components/forms/PersonalInfoForm';
import SecurityForm from '../components/forms/SecurityForm';
import ReviewForm from '../components/forms/ReviewForm';

/**
 * Main Registration Page Component
 * Orchestrates the multi-step registration flow
 */
const RegistrationPage = () => {
  const location = useLocation();
  const [redirectMessage, setRedirectMessage] = useState('');

  const {
    formData,
    errors,
    currentStep,
    isSubmitting,
    submitError,
    handleChange,
    handleFileChange,
    setValidationErrors,
    clearErrors,
    nextStep,
    prevStep,
    handleSubmit,
    getSteps,
    isFirstStep,
    isLastStep,
    totalSteps
  } = useRegistrationForm();
  const { validateStep } = useFormValidation();

  // Handle redirect message from email verification page
  useEffect(() => {
    if (location.state?.message) {
      setRedirectMessage(location.state.message);
      // Clear the message after 5 seconds
      setTimeout(() => setRedirectMessage(''), 5000);
    }
  }, [location.state?.message]);

  // Auto-skip security step for companies
  useEffect(() => {
    if (currentStep === 3 && formData.role === 'company') {
      nextStep();
    }
  }, [currentStep, formData.role, nextStep]);/**
   * Handle step validation and navigation
   */
  const handleStepNext = async (isValid) => {
    if (isValid) {
      clearErrors();
      nextStep();
    }
    // Errors are already set by the form's onValidation callback
  };

  /**
   * Handle step validation for form components
   */
  const handleFormValidation = (validationErrors) => {
    setValidationErrors(validationErrors);
  };

  /**
   * Render the current step component
   */
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <AccountTypeForm
            formData={formData}
            errors={errors}
            onChange={handleChange}
            onNext={handleStepNext}
            onValidation={handleFormValidation}
            isSubmitting={isSubmitting}
          />
        );
        case 2:
        return (
          <PersonalInfoForm
            formData={formData}
            errors={errors}
            onChange={handleChange}
            onNext={handleStepNext}
            onPrev={prevStep}
            onValidation={handleFormValidation}
            isSubmitting={isSubmitting}
          />
        );
        case 3:
        return (
          <SecurityForm
            formData={formData}
            errors={errors}
            onChange={handleChange}
            onFileChange={handleFileChange}
            onNext={handleStepNext}
            onPrev={prevStep}
            onValidation={handleFormValidation}
            isSubmitting={isSubmitting}
          />
        );
      
      case 4:
        return (
          <ReviewForm
            formData={formData}
            errors={errors}
            onPrev={prevStep}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            submitError={submitError}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <RegistrationHeader />
        
        {/* Progress Steps */}
        <ProgressSteps 
          currentStep={currentStep} 
          role={formData.role}
          className="mt-8"
        />
          {/* Form Container */}
        <div className="bg-white py-8 px-6 shadow-lg rounded-lg mt-8">
          {/* Redirect Message Display */}
          {redirectMessage && (
            <div className="mb-6 p-4 border border-yellow-300 rounded-md bg-yellow-50">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">
                    Notice
                  </h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    {redirectMessage}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Error Display */}
          {submitError && (
            <div className="mb-6 p-4 border border-red-300 rounded-md bg-red-50">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Registration Error
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    {submitError}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Step Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderCurrentStep()}
            </motion.div>
          </AnimatePresence>
        </div>
        
        {/* Login Link */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <a
              href="/login"
              className="font-medium text-[#901b20] hover:text-[#7a1419]"
            >
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;
