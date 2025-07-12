import { useState, useCallback } from 'react';
import { getValidationSchema, formatValidationErrors } from '../utils/validationSchemas';

/**
 * Form validation hook
 * Handles validation logic for registration forms
 */
export const useFormValidation = () => {
  const [isValidating, setIsValidating] = useState(false);

  /**
   * Validate a specific step
   */
  const validateStep = useCallback(async (formData, step, role) => {
    setIsValidating(true);
    
    try {
      const schema = getValidationSchema(role, step);
      if (!schema) {
        return { isValid: true, errors: {} };
      }

      await schema.validate(formData, { abortEarly: false });
      return { isValid: true, errors: {} };
    } catch (validationError) {
      const errors = formatValidationErrors(validationError);
      return { isValid: false, errors };
    } finally {
      setIsValidating(false);
    }
  }, []);

  /**
   * Validate a specific field
   */
  const validateField = useCallback(async (fieldName, value, formData, step, role) => {
    setIsValidating(true);
    
    try {
      const schema = getValidationSchema(role, step);
      if (!schema) {
        return { isValid: true, error: '' };
      }

      // Create a test object with just this field
      const testData = { ...formData, [fieldName]: value };
      
      // Validate just this field
      await schema.validateAt(fieldName, testData);
      return { isValid: true, error: '' };
    } catch (validationError) {
      return { isValid: false, error: validationError.message };
    } finally {
      setIsValidating(false);
    }
  }, []);

  /**
   * Validate entire form (all steps)
   */
  const validateFullForm = useCallback(async (formData, role) => {
    setIsValidating(true);
    
    const allErrors = {};
    let isValid = true;

    try {
      // Validate each step
      for (let step = 1; step <= 4; step++) {
        const schema = getValidationSchema(role, step);
        if (schema) {
          try {
            await schema.validate(formData, { abortEarly: false });
          } catch (validationError) {
            const stepErrors = formatValidationErrors(validationError);
            Object.assign(allErrors, stepErrors);
            isValid = false;
          }
        }
      }

      return { isValid, errors: allErrors };
    } finally {
      setIsValidating(false);
    }
  }, []);

  /**
   * Check if a step can be completed
   */
  const canCompleteStep = useCallback(async (formData, step, role) => {
    const validation = await validateStep(formData, step, role);
    return validation.isValid;
  }, [validateStep]);

  /**
   * Get validation schema for a step
   */
  const getSchemaForStep = useCallback((role, step) => {
    return getValidationSchema(role, step);
  }, []);
  return {
    // State
    isValidating,
    
    // Actions
    validateStep,
    validateField,
    validateFullForm,
    canCompleteStep,
    getSchemaForStep
  };
};

export default useFormValidation;
