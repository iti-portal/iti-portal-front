// Registration Steps Configuration

export const REGISTRATION_STEPS = [
  {
    id: 1,
    label: 'Basic Info',
    key: 'account-type',
    description: 'Choose account type and credentials'
  },
  {
    id: 2,
    label: 'Personal Info',
    key: 'personal-info',
    description: 'Provide personal or company information'
  },
  {
    id: 3,
    label: 'Security',
    key: 'security',
    description: 'Additional security information',
    excludeForRoles: ['company'] // Companies skip this step
  },
  {
    id: 4,
    label: 'Review',
    key: 'review',
    description: 'Review and submit registration'
  }
];

// Helper function to get steps for a specific role
export const getStepsForRole = (role) => {
  return REGISTRATION_STEPS.filter(step => 
    !step.excludeForRoles || !step.excludeForRoles.includes(role)
  );
};

// Helper function to get step by key
export const getStepByKey = (key) => {
  return REGISTRATION_STEPS.find(step => step.key === key);
};

// Helper function to get next step for role
export const getNextStepForRole = (currentStep, role) => {
  const steps = getStepsForRole(role);
  const currentIndex = steps.findIndex(step => step.id === currentStep);
  return currentIndex < steps.length - 1 ? steps[currentIndex + 1] : null;
};

// Helper function to get previous step for role
export const getPreviousStepForRole = (currentStep, role) => {
  const steps = getStepsForRole(role);
  const currentIndex = steps.findIndex(step => step.id === currentStep);
  return currentIndex > 0 ? steps[currentIndex - 1] : null;
};
