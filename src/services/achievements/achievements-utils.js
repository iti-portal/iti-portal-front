/**
 * Achievements Utility Functions
 * Helper functions for data transformation and type mapping
 */

/**
 * Map frontend achievement types to backend types
 * This function ensures compatibility between frontend and backend type naming
 */
export const mapFrontendTypeToBackend = (frontendType) => {
  // Map specific types that differ between frontend and backend
  const typeMap = {
    'certificate': 'certification', // Frontend uses 'certificate', backend expects 'certification'
  };
  
  return typeMap[frontendType] || frontendType;
};

/**
 * Map backend achievement types to frontend types
 * This function ensures compatibility between backend and frontend type naming
 */
export const mapBackendTypeToFrontend = (backendType) => {
  // Map specific types that differ between backend and frontend
  const typeMap = {
    'certification': 'certificate', // Backend returns 'certification', frontend uses 'certificate'
  };
  
  return typeMap[backendType] || backendType;
};

/**
 * Transform achievement data for API submission
 * Handles type mapping and field transformation based on achievement type
 */
export const transformAchievementData = (achievementData) => {
  // Map 'certificate' type to 'certification' for backend compatibility
  const mappedType = mapFrontendTypeToBackend(achievementData.type);

  // Transform the data to match API expectations based on achievement type
  const baseData = {
    type: mappedType,
    title: achievementData.title,
  };

  // Add fields based on achievement type and map frontend fields to backend
  switch (achievementData.type) {
    case 'project':
      // Projects: title, description, project_url(nullable), achieved_at, end_date(nullable), image(nullable)
      if (!achievementData.start_date) {
        throw new Error('Start date is required for project achievements');
      }
      baseData.achieved_at = achievementData.start_date;
      baseData.description = achievementData.description || '';
      if (achievementData.url) baseData.project_url = achievementData.url;
      if (achievementData.end_date) baseData.end_date = achievementData.end_date;
      if (achievementData.image) baseData.image = achievementData.image;
      break;
      
    case 'job':
      // Job: title, description(nullable), organization, achieved_at
      if (!achievementData.organization) {
        throw new Error('Organization is required for job achievements');
      }
      if (!achievementData.start_date) {
        throw new Error('Start date is required for job achievements');
      }
      baseData.achieved_at = achievementData.start_date;
      baseData.organization = achievementData.organization;
      if (achievementData.description) baseData.description = achievementData.description;
      break;
      
    case 'certificate':
      // Certificate: title, description, organization, achieved_at, certificate_url(nullable), image(nullable)
      // Note: Frontend uses 'certificate' but backend expects 'certification' (handled in type mapping above)
      if (!achievementData.organization) {
        throw new Error('Organization is required for certificate achievements');
      }
      // Map issue_date to achieved_at for backend compatibility
      const certStartDate = achievementData.start_date || achievementData.issue_date;
      if (!certStartDate) {
        throw new Error('Start date is required for certificate achievements');
      }
      baseData.achieved_at = certStartDate;
      baseData.organization = achievementData.organization;
      baseData.description = achievementData.description || '';
      if (achievementData.url) baseData.certificate_url = achievementData.url;
      if (achievementData.image) baseData.image = achievementData.image;
      break;
      
    case 'award':
      // Award: title, description(nullable), organization, achieved_at, image(nullable)
      if (!achievementData.organization) {
        throw new Error('Organization is required for award achievements');
      }
      // Map received_date to achieved_at for backend compatibility
      const awardStartDate = achievementData.start_date || achievementData.received_date;
      if (!awardStartDate) {
        throw new Error('Start date is required for award achievements');
      }
      baseData.achieved_at = awardStartDate;
      baseData.organization = achievementData.organization;
      if (achievementData.description) baseData.description = achievementData.description;
      if (achievementData.image) baseData.image = achievementData.image;
      break;
      
    default:
      throw new Error(`Unsupported achievement type: ${achievementData.type}`);
  }

  return baseData;
};

/**
 * Build query parameters for API requests
 */
export const buildQueryParams = (params) => {
  const queryParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      queryParams.append(key, value);
    }
  });

  return queryParams;
};

/**
 * Validate achievement data before submission
 */
export const validateAchievementData = (achievementData) => {
  if (!achievementData.title || achievementData.title.trim() === '') {
    throw new Error('Title is required');
  }

  if (!achievementData.type) {
    throw new Error('Achievement type is required');
  }

  const validTypes = ['project', 'job', 'certificate', 'award'];
  if (!validTypes.includes(achievementData.type)) {
    throw new Error(`Invalid achievement type. Must be one of: ${validTypes.join(', ')}`);
  }

  // Type-specific validation
  switch (achievementData.type) {
    case 'job':
    case 'certificate':
    case 'award':
      if (!achievementData.organization || achievementData.organization.trim() === '') {
        throw new Error(`Organization is required for ${achievementData.type} achievements`);
      }
      break;
  }

  return true;
};
