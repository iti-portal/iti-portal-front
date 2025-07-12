/**
 * Validation utilities for profile forms
 */

/**
 * Validate required text field with minimum length
 */
export const validateRequiredText = (value, fieldName, minLength = 1) => {
  if (!value || value.trim().length < minLength) {
    return `${fieldName} must be at least ${minLength} character${minLength > 1 ? 's' : ''}`;
  }
  return null;
};

/**
 * Validate email format
 */
export const validateEmail = (email) => {
  if (!email || email.trim() === '') return null; // Optional field
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Please enter a valid email address';
  }
  return null;
};

/**
 * Validate Egyptian phone number format
 */
export const validateEgyptianPhone = (phone) => {
  if (!phone || phone.trim() === '') return null; // Optional field
  
  // Clean the phone number by removing common formatting characters
  const cleanPhone = phone.replace(/[\s\-\(\)\+\.]/g, '');
  
  // Egyptian mobile number validation (010, 011, 012, 015)
  // Can be with or without country code (+20)
  const egyptianMobileRegex = /^(20)?(01[0125])\d{8}$/;
  
  if (!egyptianMobileRegex.test(cleanPhone)) {
    return 'Phone number must be an Egyptian mobile number (e.g., 010, 011, 012, or 015)';
  }
  return null;
};

/**
 * Validate WhatsApp number format (8-20 digits with optional +)
 */
export const validateWhatsAppPhone = (phone) => {
  if (!phone || phone.trim() === '') return null; // Optional field
  
  // Clean the phone number by removing common formatting characters except +
  const cleanPhone = phone.replace(/[\s\-\(\)\.]/g, '');
  
  // WhatsApp number validation (8-20 digits with optional +)
  const whatsappRegex = /^(\+)?\d{8,20}$/;
  
  if (!whatsappRegex.test(cleanPhone)) {
    return 'Please provide a valid WhatsApp number (8–20 digits, with optional +)';
  }
  return null;
};

/**
 * Validate phone number format (keeping for backward compatibility)
 */
export const validatePhone = (phone) => {
  // Use Egyptian phone validation by default
  return validateEgyptianPhone(phone);
};

/**
 * Validate URL format
 */
export const validateUrl = (url, fieldName) => {
  if (!url || url.trim() === '') return null; // Optional field
  
  try {
    new URL(url);
    return null;
  } catch {
    return `Please enter a valid ${fieldName} URL`;
  }
};

/**
 * Validate username format
 */
export const validateUsername = (username) => {
  if (!username || username.trim().length < 3) {
    return 'Username must be at least 3 characters';
  }
  
  const usernameRegex = /^[a-zA-Z0-9_.-]+$/;
  if (!usernameRegex.test(username)) {
    return 'Username can only contain letters, numbers, dots, hyphens, and underscores';
  }
  
  // Note: Username uniqueness can only be validated server-side
  return null;
};

/**
 * Validate entire profile data
 */
export const validateProfileData = (profileData) => {
  const errors = [];
  
  // Required fields validation
  const firstNameError = validateRequiredText(profileData.firstName, 'First name', 2);
  if (firstNameError) errors.push(firstNameError);
  
  const lastNameError = validateRequiredText(profileData.lastName, 'Last name', 2);
  if (lastNameError) errors.push(lastNameError);
  
  const usernameError = validateUsername(profileData.username);
  if (usernameError) errors.push(usernameError);
  
  // Optional fields validation
  const emailError = validateEmail(profileData.email);
  if (emailError) errors.push(emailError);
  
  const phoneError = validatePhone(profileData.phone);
  if (phoneError) errors.push(phoneError);
  
  const whatsappError = validateWhatsAppPhone(profileData.whatsapp);
  if (whatsappError) errors.push('WhatsApp: ' + whatsappError);
  
  const linkedinError = validateUrl(profileData.linkedin, 'LinkedIn');
  if (linkedinError) errors.push(linkedinError);
  
  const githubError = validateUrl(profileData.github, 'GitHub');
  if (githubError) errors.push(githubError);
  
  const portfolioError = validateUrl(profileData.portfolioUrl, 'Portfolio');
  if (portfolioError) errors.push(portfolioError);
  
  return errors;
};

/**
 * Sanitize profile data before sending to server
 */
export const sanitizeProfileData = (profileData) => {
  const sanitized = { ...profileData };
  
  // Trim all string values
  Object.keys(sanitized).forEach(key => {
    if (typeof sanitized[key] === 'string') {
      sanitized[key] = sanitized[key].trim();
    }
  });
  
  // Remove empty optional fields to avoid sending empty strings
  const optionalFields = ['bio', 'phone', 'whatsapp', 'linkedin', 'github', 'portfolioUrl', 'website'];
  optionalFields.forEach(field => {
    if (sanitized[field] === '') {
      delete sanitized[field];
    }
  });
  
  return sanitized;
};
