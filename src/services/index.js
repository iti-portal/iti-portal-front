/**
 * Services Index - Re-exports all service functions for easy importing
 * This provides backward compatibility for existing imports
 */

// All profile-related service exports
export { 
  getUserProfile, 
  updateUserProfile, 
  updateProfilePicture, 
  updateCoverPhoto,
  // Education
  addEducation, 
  updateEducation, 
  deleteEducation,
  // Work Experience
  addWorkExperience,
  updateWorkExperience,
  deleteWorkExperience,
  // Skills
  addUserSkill, 
  deleteUserSkill,
  // Certificates
  addCertificate, 
  updateCertificate, 
  updateCertificateImage, 
  deleteCertificate,
  // Awards
  addAward, 
  updateAward, 
  deleteAward,
  // Projects
  addProject, 
  updateProject, 
  deleteProject 
} from './profileService';

// API config exports (for advanced usage)
export { 
  API_BASE_URL, 
  getAuthHeaders, 
  getFileUploadHeaders, 
  constructProfilePictureUrl, 
  constructCertificateImageUrl 
} from './apiConfig';
