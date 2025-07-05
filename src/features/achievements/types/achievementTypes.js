/**
 * Achievement Types and Interfaces
 * Centralized type definitions for the achievements feature
 */

export const ACHIEVEMENT_TYPES = {
  PROJECT: 'project',
  JOB: 'job',
  CERTIFICATE: 'certificate',
  AWARD: 'award'
};

export const ACHIEVEMENT_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ARCHIVED: 'archived'
};

export const ACHIEVEMENT_CATEGORIES = {
  [ACHIEVEMENT_TYPES.PROJECT]: {
    label: 'Project',
    icon: 'work',
    color: 'blue',
    fields: ['title', 'description', 'start_date', 'end_date', 'url', 'technologies', 'team_size']
  },
  [ACHIEVEMENT_TYPES.JOB]: {
    label: 'Job',
    icon: 'business',
    color: 'green',
    fields: ['title', 'description', 'start_date', 'end_date', 'organization', 'position', 'responsibilities']
  },
  [ACHIEVEMENT_TYPES.CERTIFICATE]: {
    label: 'Certificate',
    icon: 'school',
    color: 'purple',
    fields: ['title', 'description', 'issue_date', 'expiry_date', 'organization', 'url', 'credential_id']
  },
  [ACHIEVEMENT_TYPES.AWARD]: {
    label: 'Award',
    icon: 'emoji_events',
    color: 'yellow',
    fields: ['title', 'description', 'received_date', 'organization', 'category', 'prize_value']
  }
};

/**
 * Base Achievement Schema
 */
export const createBaseAchievement = () => ({
  id: null,
  type: ACHIEVEMENT_TYPES.PROJECT,
  title: '',
  description: '',
  status: ACHIEVEMENT_STATUS.DRAFT,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  user_id: null,
  image: null,
  tags: [],
  visibility: 'public' // public, private, connections
});

/**
 * Type-specific achievement schemas
 */
export const createProjectAchievement = () => ({
  ...createBaseAchievement(),
  type: ACHIEVEMENT_TYPES.PROJECT,
  start_date: '',
  end_date: '',
  url: '',
  technologies: [],
  team_size: 1,
  github_url: '',
  demo_url: ''
});

export const createJobAchievement = () => ({
  ...createBaseAchievement(),
  type: ACHIEVEMENT_TYPES.JOB,
  start_date: '',
  end_date: '',
  organization: '',
  position: '',
  responsibilities: [],
  employment_type: 'full-time', // full-time, part-time, contract, internship
  location: ''
});

export const createCertificateAchievement = () => ({
  ...createBaseAchievement(),
  type: ACHIEVEMENT_TYPES.CERTIFICATE,
  start_date: '',
  expiry_date: '',
  organization: '',
  url: '',
  credential_id: '',
  skills: []
});

export const createAwardAchievement = () => ({
  ...createBaseAchievement(),
  type: ACHIEVEMENT_TYPES.AWARD,
  start_date: '',
  organization: '',
  category: '',
  prize_value: '',
  competition_name: ''
});

/**
 * Validation schemas for different achievement types
 */
export const VALIDATION_RULES = {
  [ACHIEVEMENT_TYPES.PROJECT]: {
    required: ['title', 'description', 'start_date'],
    optional: ['end_date', 'url', 'technologies', 'team_size', 'image']
  },
  [ACHIEVEMENT_TYPES.JOB]: {
    required: ['title', 'organization', 'start_date'],
    optional: ['description', 'end_date', 'responsibilities', 'employment_type', 'location']
  },
  [ACHIEVEMENT_TYPES.CERTIFICATE]: {
    required: ['title', 'description', 'organization', 'start_date'],
    optional: ['expiry_date', 'url', 'credential_id', 'skills', 'image']
  },
  [ACHIEVEMENT_TYPES.AWARD]: {
    required: ['title', 'organization', 'start_date'],
    optional: ['description', 'category', 'prize_value', 'competition_name', 'image']
  }
};
