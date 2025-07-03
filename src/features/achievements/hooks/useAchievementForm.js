/**
 * useAchievementForm Hook
 * Custom hook for managing achievement form state and validation
 */

import { useState, useCallback, useEffect } from 'react';
import { 
  createProjectAchievement,
  createJobAchievement,
  createCertificateAchievement,
  createAwardAchievement,
  ACHIEVEMENT_TYPES
} from '../types/achievementTypes';
import { validateAchievement } from '../utils/achievementHelpers';

const getInitialFormData = (type) => {
  switch (type) {
    case ACHIEVEMENT_TYPES.PROJECT:
      return createProjectAchievement();
    case ACHIEVEMENT_TYPES.JOB:
      return createJobAchievement();
    case ACHIEVEMENT_TYPES.CERTIFICATE:
      return createCertificateAchievement();
    case ACHIEVEMENT_TYPES.AWARD:
      return createAwardAchievement();
    default:
      return createProjectAchievement();
  }
};

export const useAchievementForm = (initialData = null, initialType = ACHIEVEMENT_TYPES.PROJECT) => {
  const [formData, setFormData] = useState(() => 
    initialData || getInitialFormData(initialType)
  );
  const [errors, setErrors] = useState({});
  const [isValid, setIsValid] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Validate form whenever formData changes
  useEffect(() => {
    const validationErrors = validateAchievement(formData);
    setErrors(validationErrors);
    setIsValid(Object.keys(validationErrors).length === 0);
  }, [formData]);

  // Update form data
  const updateFormData = useCallback((field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
      updated_at: new Date().toISOString()
    }));
    setIsDirty(true);
  }, []);

  // Handle input change
  const handleInputChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;
    updateFormData(name, fieldValue);
  }, [updateFormData]);

  // Handle type change (reset form with new type structure)
  const handleTypeChange = useCallback((newType) => {
    const newFormData = getInitialFormData(newType);
    // Preserve common fields
    newFormData.title = formData.title;
    newFormData.description = formData.description;
    newFormData.image = formData.image;
    newFormData.tags = formData.tags;
    
    setFormData(newFormData);
    setIsDirty(true);
  }, [formData.title, formData.description, formData.image, formData.tags]);

  // Handle image upload
  const handleImageUpload = useCallback((file) => {
    if (!file) return;
    
    setImageFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
      updateFormData('image', reader.result);
    };
    reader.readAsDataURL(file);
  }, [updateFormData]);

  // Remove image
  const removeImage = useCallback(() => {
    setImageFile(null);
    setImagePreview(null);
    updateFormData('image', null);
  }, [updateFormData]);

  // Handle array fields (tags, technologies, etc.)
  const addArrayItem = useCallback((field, item) => {
    const currentArray = formData[field] || [];
    if (!currentArray.includes(item)) {
      updateFormData(field, [...currentArray, item]);
    }
  }, [formData, updateFormData]);

  const removeArrayItem = useCallback((field, index) => {
    const currentArray = formData[field] || [];
    const newArray = currentArray.filter((_, i) => i !== index);
    updateFormData(field, newArray);
  }, [formData, updateFormData]);

  // Reset form
  const resetForm = useCallback((type = ACHIEVEMENT_TYPES.PROJECT) => {
    setFormData(getInitialFormData(type));
    setErrors({});
    setIsDirty(false);
    setImageFile(null);
    setImagePreview(null);
  }, []);

  // Set form data (for editing)
  const setInitialData = useCallback((data) => {
    setFormData(data);
    setIsDirty(false);
    if (data.image) {
      setImagePreview(data.image);
    }
  }, []);

  // Get form data for submission
  const getFormDataForSubmission = useCallback(() => {
    const submissionData = { ...formData };
    
    // Clean up empty fields
    Object.keys(submissionData).forEach(key => {
      const value = submissionData[key];
      if (value === '' || 
          (Array.isArray(value) && value.length === 0) ||
          value === null) {
        delete submissionData[key];
      }
    });
    
    return submissionData;
  }, [formData]);

  // Validate specific field
  const validateField = useCallback((field) => {
    const fieldErrors = validateAchievement({ ...formData, [field]: formData[field] });
    return fieldErrors[field] || null;
  }, [formData]);

  return {
    // Form state
    formData,
    errors,
    isValid,
    isDirty,
    imageFile,
    imagePreview,
    
    // Form actions
    updateFormData,
    handleInputChange,
    handleTypeChange,
    handleImageUpload,
    removeImage,
    addArrayItem,
    removeArrayItem,
    resetForm,
    setInitialData,
    
    // Validation
    validateField,
    
    // Utilities
    getFormDataForSubmission
  };
};
