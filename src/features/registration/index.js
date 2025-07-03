// Registration Feature - Main Export File

// Pages
export { default as RegistrationPage } from './pages/RegistrationPage';
export { default as EmailVerificationPage } from './pages/EmailVerificationPage';

// Components
export { default as ProgressSteps } from './components/common/ProgressSteps';
export { default as RegistrationHeader } from './components/common/RegistrationHeader';
export { default as AccountTypeForm } from './components/forms/AccountTypeForm';
export { default as PersonalInfoForm } from './components/forms/PersonalInfoForm';
export { default as SecurityForm } from './components/forms/SecurityForm';
export { default as ReviewForm } from './components/forms/ReviewForm';

// Hooks
export { default as useRegistrationForm } from './hooks/useRegistrationForm';
export { default as useFormValidation } from './hooks/useFormValidation';
export { default as useStepNavigation } from './hooks/useStepNavigation';

// Services
export * from './services/registrationAPI';
export * from './services/emailVerificationAPI';

// Types
export * from './types/registration.types';

// Utils
export * from './utils/validationSchemas';
export * from './utils/formHelpers';

// Constants
export * from './constants/registrationSteps';
export * from './constants/accountTypes';
