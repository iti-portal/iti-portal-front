// Registration Feature Type Definitions

/**
 * Base registration form data structure
 */
export const INITIAL_FORM_DATA = {
  // Account Type Step
  email: '',
  password: '',
  confirmPassword: '',
  role: '',

  // Personal Info Step - Common
  firstName: '',
  lastName: '',
  phone: '',
  // Personal Info Step - Student/Alumni
  branch: '', // Changed from governorate to branch for ITI branches
  program: '', // New field: PTP or ITP
  intake: '',
  track: '',
  username: '', // Optional, auto-generated if not provided

  // Personal Info Step - Company
  company_name: '',
  description: '',
  location: '',
  industry: '',
  company_size: '',
  website: '',
  established_at: '',  // Security Step - Common
  profile_picture: '', // Changed from null to empty string
  // Security Step - Student/Alumni ID Verification
  idPhotoFront: '', // Changed from null to empty string
  idPhotoBack: '', // Changed from null to empty string

  // Security Step - Company
  company_logo: '', // Changed from null to empty string
};

/**
 * Form validation error structure
 */
export const FORM_ERROR_STRUCTURE = {
  email: '',
  password: '',
  confirmPassword: '',
  role: '',
  firstName: '',
  lastName: '',
  phone: '',
  branch: '', // ITI branch instead of governorate
  program: '', // PTP or ITP program
  intake: '',
  track: '',
  username: '',
  company_name: '',
  description: '',
  location: '',
  industry: '',
  company_size: '',
  website: '',  established_at: '',
  profile_picture: '',
  idPhotoFront: '',
  idPhotoBack: '',
  company_logo: '',
  general: '' // For general form errors
};

/**
 * Step navigation state
 */
export const STEP_NAVIGATION_STATE = {
  currentStep: 1,
  totalSteps: 4,
  canGoNext: false,
  canGoPrevious: false,
  isFirstStep: true,
  isLastStep: false
};

/**
 * Form submission state
 */
export const FORM_SUBMISSION_STATE = {
  isSubmitting: false,
  isSuccess: false,
  error: '',
  submittedAt: null
};

/**
 * Available ITI branches based on the provided images
 */
export const ITI_BRANCHES = [
  'Qena',
  'Sohag', 
  'Tanta',
  'Zagazig',
  'New Valley',
  'Damanhor',
  'Al Arish',
  'Banha',
  'Port Said',
  'Smart Village',
  'New Capital',
  'Cairo University',
  'Alexandria',
  'Assiut',
  'Aswan',
  'Beni Suef',
  'Fayoum',
  'Ismailia',
  'Mansoura',
  'Menofia',
  'Minya'
];

/**
 * Available ITI programs
 */
export const ITI_PROGRAMS = [
  { value: 'ptp', label: 'PTP (Professional Training Program)' },
  { value: 'itp', label: 'ITP (Intensive Training Program)' }
];

/**
 * Company size options
 */
export const COMPANY_SIZE_OPTIONS = [
  { value: '1-10', label: '1-10 employees' },
  { value: '11-50', label: '11-50 employees' },
  { value: '51-200', label: '51-200 employees' },
  { value: '201-500', label: '201-500 employees' },
  { value: '501-1000', label: '501-1000 employees' },
  { value: '1000+', label: '1000+ employees' }
];

/**
 * Industry options for companies
 */
export const INDUSTRY_OPTIONS = [
  'Technology',
  'Healthcare',
  'Finance',
  'Education',
  'Manufacturing',
  'Retail',
  'Consulting',
  'Media & Entertainment',
  'Transportation',
  'Real Estate',
  'Energy',
  'Non-profit',
  'Government',
  'Other'
];
