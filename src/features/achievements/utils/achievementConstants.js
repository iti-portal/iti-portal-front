/**
 * Achievement Constants
 * Centralized constants for the achievements feature
 */

export const ACHIEVEMENT_ICONS = {
  project: '🚀',
  job: '💼',
  certificate: '🎓',
  award: '🏆'
};

export const ACHIEVEMENT_COLORS = {
  project: 'bg-blue-100 text-blue-800 border-blue-200',
  job: 'bg-green-100 text-green-800 border-green-200',
  certificate: 'bg-purple-100 text-purple-800 border-purple-200',
  award: 'bg-yellow-100 text-yellow-800 border-yellow-200'
};

export const DATE_FORMATS = {
  display: 'MMM yyyy',
  input: 'YYYY-MM-DD',
  api: 'YYYY-MM-DDTHH:mm:ssZ'
};

export const EMPLOYMENT_TYPES = [
  { value: 'full-time', label: 'Full-time' },
  { value: 'part-time', label: 'Part-time' },
  { value: 'contract', label: 'Contract' },
  { value: 'internship', label: 'Internship' },
  { value: 'freelance', label: 'Freelance' }
];

export const VISIBILITY_OPTIONS = [
  { value: 'public', label: 'Public', description: 'Visible to everyone' },
  { value: 'private', label: 'Private', description: 'Only visible to you' },
  { value: 'connections', label: 'Connections', description: 'Visible to your connections' }
];

export const PAGINATION_LIMITS = {
  default: 12,
  mobile: 6,
  desktop: 12
};

export const IMAGE_CONSTRAINTS = {
  maxSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
  maxWidth: 1920,
  maxHeight: 1080
};
