import { INITIAL_FORM_DATA, FORM_ERROR_STRUCTURE } from '../types/registration.types';

/**
 * Initialize form data with default values
 */
export const initializeFormData = () => {
  return { ...INITIAL_FORM_DATA };
};

/**
 * Initialize error state
 */
export const initializeErrors = () => {
  return { ...FORM_ERROR_STRUCTURE };
};

/**
 * Transform form data for API submission
 */
export const transformFormDataForAPI = (formData) => {
  const { role } = formData;
  
  if (role === 'company') {
    return {
      company_name: formData.company_name,
      email: formData.email,
      password: formData.password,
      password_confirmation: formData.confirmPassword,
      phone: formData.phone,
      ...(formData.location && { location: formData.location }),
      ...(formData.website && { website: formData.website }),
      ...(formData.description && { description: formData.description }),      ...(formData.industry && { industry: formData.industry }),
      ...(formData.company_size && { company_size: formData.company_size }),
      ...(formData.established_at && { established_at: formData.established_at }),
      ...(formData.company_logo && { company_logo: formData.company_logo })
    };  } else {
    // Student or Alumni
    const username = formData.username || 
      `${formData.role}_${formData.firstName.replace(/[^\w]/g, '_')}_${Date.now()}`;
    
    return {
      email: formData.email,
      role: formData.role,
      first_name: formData.firstName,
      last_name: formData.lastName,
      password: formData.password,
      password_confirmation: formData.confirmPassword,
      phone: formData.phone,
      branch: formData.branch,
      governorate: formData.branch, // Temporary: map branch to governorate for backend compatibility
      program: formData.program,
      username: username,
      ...(formData.intake && { intake: formData.intake }),
      ...(formData.track && { track: formData.track })
      // Note: Files (profile_picture, idPhotoFront, idPhotoBack) are handled separately in the API service
    };
  }
};

/**
 * Get API endpoint based on role
 */
export const getAPIEndpoint = (role) => {  return role === 'company' ? '/auth/register-company' : '/auth/register';
};

/**
 * Check if a step is completed
 */
export const isStepCompleted = (formData, step, role) => {
  switch (step) {
    case 1: // Account Type
      return !!(formData.email && formData.password && formData.confirmPassword && formData.role);
    
    case 2: // Personal Info
      if (role === 'company') {
        return !!(formData.company_name && formData.description && formData.location);
      } else {
        return !!(formData.firstName && formData.lastName && formData.username && formData.phone && formData.branch && formData.program);
      }
      case 3: // Security (skip for companies)
      if (role === 'company') return true;
      return !!(formData.profile_picture); // Profile picture is now required
    
    case 4: // Review
      return true; // Always considered completed for review
    
    default:
      return false;
  }
};

/**
 * Get form data for a specific step
 */
export const getStepData = (formData, step, role) => {
  switch (step) {
    case 1:
      return {
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        role: formData.role
      };
    
    case 2:
      if (role === 'company') {
        return {
          company_name: formData.company_name,
          description: formData.description,
          location: formData.location,
          industry: formData.industry,
          company_size: formData.company_size,
          website: formData.website,
          established_at: formData.established_at
        };      } else {
        return {
          firstName: formData.firstName,
          lastName: formData.lastName,
          username: formData.username,
          phone: formData.phone,
          branch: formData.branch,
          program: formData.program,
          track: formData.track,
          intake: formData.intake
        };
      }
      case 3:
      if (role === 'company') {
        return {
          company_logo: formData.company_logo
        };
      } else {
        return {
          profile_picture: formData.profile_picture,
          idPhotoFront: formData.idPhotoFront,
          idPhotoBack: formData.idPhotoBack
        };
      }
    
    default:
      return {};
  }
};

/**
 * Clean empty values from form data
 */
export const cleanFormData = (formData) => {
  const cleaned = {};
  Object.keys(formData).forEach(key => {
    const value = formData[key];
    if (value !== '' && value !== null && value !== undefined) {
      cleaned[key] = value;
    }
  });
  return cleaned;
};

/**
 * Format date for form inputs
 */
export const formatDateForInput = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toISOString().split('T')[0];
};

/**
 * Validate file upload
 */
export const validateFileUpload = (file, maxSize = 5 * 1024 * 1024) => {
  if (!file) return { isValid: true };
  
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
  
  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: 'Only image files (JPEG, PNG, GIF) are allowed'
    };
  }
  
  if (file.size > maxSize) {
    return {
      isValid: false,
      error: `File size must be less than ${maxSize / (1024 * 1024)}MB`
    };
  }
  
  return { isValid: true };
};
