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
  governorate: '',
  graduation_date: '',
  student_status: '', // 'current' | 'graduate'
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
  additional_info: '',

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
  phone: '',  governorate: '',
  graduation_date: '',
  student_status: '',
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
  additional_info: '',
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
 * Available governorates for Egypt
 */
export const GOVERNORATES = [
  'Cairo',
  'Alexandria',
  'Giza',
  'Sharkia',
  'Dakahlia',
  'Beheira',
  'Kafr El Sheikh',
  'Gharbia',
  'Monufia',
  'Qalyubia',
  'Ismailia',
  'Suez',
  'Port Said',
  'North Sinai',
  'South Sinai',
  'Red Sea',
  'Luxor',
  'Aswan',
  'Qena',
  'Sohag',
  'Asyut',
  'Minya',
  'Beni Suef',
  'Fayoum',
  'New Valley',
  'Matrouh'
];

/**
 * Student status options
 */
export const STUDENT_STATUS_OPTIONS = [
  { value: 'current', label: 'Current Student' },
  { value: 'graduate', label: 'Graduate' }
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
