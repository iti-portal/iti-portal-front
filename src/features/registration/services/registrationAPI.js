import { transformFormDataForAPI, getAPIEndpoint } from '../utils/formHelpers';

/**
 * Registration API Service
 * Handles all registration-related API calls
 */

const API_BASE_URL = process.env.REACT_APP_API_URL;

/**
 * Submit user registration
 */
export const submitRegistration = async (formData) => {
  try {
    const endpoint = getAPIEndpoint(formData.role);
    const transformedData = transformFormDataForAPI(formData);
      // Prepare request body and headers
    const hasFiles = (formData.role !== 'company') && 
                     ((formData.profile_picture && formData.profile_picture instanceof File) || 
                      (formData.idPhotoFront && formData.idPhotoFront instanceof File) || 
                      (formData.idPhotoBack && formData.idPhotoBack instanceof File));
    
    let body, headers;
      if (hasFiles) {
      body = new FormData();
      Object.entries(transformedData).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          body.append(key, value);
        }
      });
      
      // Add file uploads - only if they actually contain files
      if (formData.profile_picture && formData.profile_picture instanceof File) {
        body.append('profile_picture', formData.profile_picture);
      }
      if (formData.idPhotoFront && formData.idPhotoFront instanceof File) {
        body.append('nid_front', formData.idPhotoFront);
      }
      if (formData.idPhotoBack && formData.idPhotoBack instanceof File) {
        body.append('nid_back', formData.idPhotoBack);
      }
      
      headers = {};
    } else {
      // Remove empty values for JSON requests
      const cleanedData = {};
      Object.entries(transformedData).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          cleanedData[key] = value;
        }
      });
      
      body = JSON.stringify(cleanedData);
      headers = { 'Content-Type': 'application/json' };
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        ...headers,
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      },
      body,
      redirect: 'manual'
    });

    const contentType = response.headers.get('content-type');
    let result;
    
    if (contentType && contentType.includes('application/json')) {
      result = await response.json();
    } else {
      const textResult = await response.text();
      result = { message: textResult };
    }    if (!response.ok) {
      if (response.status === 422) {
        // Validation errors - return structured error instead of throwing
        const errorMessage = result.errors 
          ? Object.values(result.errors).flat().join(', ')
          : result.message || 'Validation failed';
        
        return {
          success: false,
          error: errorMessage,
          validationErrors: result.errors || {},
          status: response.status
        };
      } else {
        // Other server errors
        return {
          success: false,
          error: result.message || `Server error: ${response.status}`,
          status: response.status
        };
      }
    }

    if (result.success === false) {
      return {
        success: false,
        error: result.message || 'Registration failed'
      };
    }

    return {
      success: true,
      data: result.data,
      token: result.data?.token,      message: result.message || 'Registration successful'
    };

  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      return {
        success: false,
        error: 'Network error occurred. Please check your connection and try again.'
      };
    }
    return {
      success: false,
      error: error.message || 'An unexpected error occurred'
    };
  }
};

/**
 * Check email availability
 */
export const checkEmailAvailability = async (email) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/check-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: JSON.stringify({ email })
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.message || 'Failed to check email availability');
    }

    return {
      available: result.available,
      message: result.message
    };

  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Network error occurred. Please check your connection and try again.');
    }
    throw error;
  }
};

/**
 * Validate form data before submission
 */
export const validateRegistrationData = async (formData, schema) => {
  try {
    await schema.validate(formData, { abortEarly: false });
    return { isValid: true, errors: {} };
  } catch (validationError) {
    const errors = {};
    if (validationError.inner) {
      validationError.inner.forEach(error => {
        errors[error.path] = error.message;
      });
    }
    return { isValid: false, errors };
  }
};
