import * as Yup from 'yup';

// Account Type Step Validation
export const accountTypeSchema = Yup.object().shape({
  email: Yup.string()
    .email('Email is invalid')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords do not match')
    .required('Confirm Password is required'),
  role: Yup.string()
    .oneOf(['student', 'alumni', 'company'], 'Role must be student, alumni, or company')
    .required('Role is required'),
});

// Student Personal Info Validation
export const studentSchema = Yup.object().shape({
  firstName: Yup.string()
    .required('First name is required')
    .max(255, 'First name must be less than 256 characters'),
  lastName: Yup.string()
    .required('Last name is required')
    .max(255, 'Last name must be less than 256 characters'),
  username: Yup.string()
    .required('Username is required')
    .min(3, 'Username must be at least 3 characters')
    .max(50, 'Username must be less than 51 characters')
    .matches(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  phone: Yup.string()
    .required('Phone is required')
    .max(20, 'Phone must be less than 21 characters'),
  branch: Yup.string()
    .required('ITI branch is required'),
  program: Yup.string()
    .required('Program is required')
    .oneOf(['ptp', 'itp'], 'Program must be ptp or itp'),
  // Optional fields
  track: Yup.string()
    .max(255, 'Track must be less than 256 characters'),
  intake: Yup.string()
    .max(50, 'Intake must be less than 51 characters'),
});

// Alumni Personal Info Validation
export const alumniSchema = Yup.object().shape({
  firstName: Yup.string()
    .required('First name is required')
    .max(255, 'First name must be less than 256 characters'),
  lastName: Yup.string()
    .required('Last name is required')
    .max(255, 'Last name must be less than 256 characters'),
  username: Yup.string()
    .required('Username is required')
    .min(3, 'Username must be at least 3 characters')
    .max(50, 'Username must be less than 51 characters')
    .matches(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  phone: Yup.string()
    .required('Phone is required')
    .max(20, 'Phone must be less than 21 characters'),
  branch: Yup.string()
    .required('ITI branch is required'),
  program: Yup.string()
    .required('Program is required')
    .oneOf(['ptp', 'itp'], 'Program must be ptp or itp'),
});

// Company Personal Info Validation
export const companySchema = Yup.object().shape({
  company_name: Yup.string()
    .required('Company name is required')
    .max(255, 'Company name must be less than 256 characters'),
  description: Yup.string()
    .required('Description is required'),
  location: Yup.string()
    .required('Location is required')
    .max(255, 'Location must be less than 256 characters'),
  // Optional fields
  industry: Yup.string()
    .max(255, 'Industry must be less than 256 characters'),
  company_size: Yup.string()
    .max(50, 'Company size must be less than 51 characters'),
  website: Yup.string()
    .url('Website must be a valid URL'),
  established_at: Yup.date()
    .nullable()
    .typeError('Established date must be a valid date'),
});

// Security Step Validation
export const securitySchema = Yup.object().shape({
  profile_picture: Yup.mixed()
    .required('Profile picture is required')
    .test('fileSize', 'File size is too large (max 5MB)', (value) => {
      if (!value) return false; // Required field
      return value.size <= 5 * 1024 * 1024; // 5MB
    })
    .test('fileType', 'Only image files are allowed', (value) => {
      if (!value) return false; // Required field
      return ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'].includes(value.type);
    }),
});

// Security Step Validation for Students/Alumni (with ID verification)
export const securityWithIDSchema = Yup.object().shape({
  profile_picture: Yup.mixed()
    .required('Profile picture is required')
    .test('fileSize', 'File size is too large (max 5MB)', (value) => {
      if (!value) return false; // Required field
      return value.size <= 5 * 1024 * 1024; // 5MB
    })
    .test('fileType', 'Only image files are allowed', (value) => {
      if (!value) return false; // Required field
      return ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'].includes(value.type);
    }),  idPhotoFront: Yup.mixed()
    .required('ID Photo (Front) is required')
    .test('fileSize', 'File size is too large (max 5MB)', (value) => {
      if (!value) return false; // Required field
      return value.size <= 5 * 1024 * 1024; // 5MB
    })
    .test('fileType', 'Only image files are allowed', (value) => {
      if (!value) return false; // Required field
      return ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'].includes(value.type);
    }),
  idPhotoBack: Yup.mixed()
    .required('ID Photo (Back) is required')
    .test('fileSize', 'File size is too large (max 5MB)', (value) => {
      if (!value) return false; // Required field
      return value.size <= 5 * 1024 * 1024; // 5MB
    })
    .test('fileType', 'Only image files are allowed', (value) => {
      if (!value) return false; // Required field
      return ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'].includes(value.type);
    }),
});

// Security Step Validation for Companies
export const companySecuritySchema = Yup.object().shape({
  company_logo: Yup.mixed()
    .required('Company logo is required')
    .test('fileSize', 'File size is too large (max 5MB)', (value) => {
      if (!value) return false; // Required field
      return value.size <= 5 * 1024 * 1024; // 5MB
    })
    .test('fileType', 'Only image files are allowed', (value) => {
      if (!value) return false; // Required field
      return ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'].includes(value.type);
    }),
});

// Helper function to get schema by role and step
export const getValidationSchema = (role, step) => {
  switch (step) {
    case 1:
      return accountTypeSchema;
    case 2:
      if (role === 'student') return studentSchema;
      if (role === 'alumni') return alumniSchema;
      if (role === 'company') return companySchema;
      break;
    case 3:
      if (role === 'student' || role === 'alumni') return securityWithIDSchema;
      if (role === 'company') return companySecuritySchema;
      break;
    default:
      return null;
  }
  return null;
};

// Combined validation for all steps
export const getFullValidationSchema = (role) => {
  const baseSchema = accountTypeSchema;
  
  let personalInfoSchema;
  if (role === 'student') personalInfoSchema = studentSchema;
  else if (role === 'alumni') personalInfoSchema = alumniSchema;
  else if (role === 'company') personalInfoSchema = companySchema;
  
  let combinedSchema = baseSchema.concat(personalInfoSchema);
  
  // Add security schema based on role
  if (role === 'student' || role === 'alumni') {
    combinedSchema = combinedSchema.concat(securityWithIDSchema);
  } else if (role === 'company') {
    combinedSchema = combinedSchema.concat(companySecuritySchema);
  }
  
  return combinedSchema;
};

/**
 * Format validation errors for display
 */
export const formatValidationErrors = (validationError) => {
  const errors = {};
  if (validationError.inner) {
    validationError.inner.forEach(error => {
      errors[error.path] = error.message;
    });
  }
  return errors;
};
