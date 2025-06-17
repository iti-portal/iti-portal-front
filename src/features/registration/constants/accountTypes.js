// Account Types Configuration

export const ACCOUNT_TYPES = {
  STUDENT: 'student',
  ALUMNI: 'alumni',
  COMPANY: 'company'
};

export const ACCOUNT_TYPE_OPTIONS = [
  {
    value: ACCOUNT_TYPES.STUDENT,
    label: 'Student',
    description: 'Current or prospective ITI student',
    icon: '🎓',
    features: [
      'Connect with classmates',
      'Job opportunities',
      'Achievement tracking'
    ]
  },
  {
    value: ACCOUNT_TYPES.ALUMNI,
    label: 'Graduate',
    description: 'ITI graduate and alumni network member',
    icon: '👨‍💼',
    features: [
      'Alumni network access',
      'Mentorship opportunities',
      'Professional networking'
    ]
  },
  {
    value: ACCOUNT_TYPES.COMPANY,
    label: 'Company',
    description: 'Organization looking to hire ITI talent',
    icon: '🏢',
    features: [
      'Post job openings',
      'Access to talent pool',
      'Company profile',
      'Recruitment tools'
    ]
  }
];

// Helper function to get account type by value
export const getAccountTypeByValue = (value) => {
  return ACCOUNT_TYPE_OPTIONS.find(type => type.value === value);
};

// Helper function to get account type label
export const getAccountTypeLabel = (value) => {
  const type = getAccountTypeByValue(value);
  return type ? type.label : '';
};

// Validation helper
export const isValidAccountType = (value) => {
  return Object.values(ACCOUNT_TYPES).includes(value);
};
