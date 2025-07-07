/**
 * Services Index - Re-exports all service functions for easy importing
 * This provides backward compatibility for existing imports
 */

// All profile-related service exports
export { 
  getUserProfile, 
  updateUserProfile, 
  updateProfilePicture, 
  updateCoverPhoto
} from './profileService';

// Articles service exports
export {
  getPopularArticles,
  getArticles,
  getArticle,
  toggleArticleLike
} from './articlesService';

// Education service exports
export {
  addEducation, 
  updateEducation, 
  deleteEducation
} from './educationService';

// Work Experience service exports
export {
  addWorkExperience,
  updateWorkExperience,
  deleteWorkExperience
} from './workExperienceService';

// Skills service exports
export {
  addUserSkill, 
  deleteUserSkill
} from './skillsService';

// Certificates service exports
export {
  addCertificate, 
  updateCertificate, 
  updateCertificateImage, 
  deleteCertificate
} from './certificatesService';

// Awards service exports
export {
  addAward, 
  updateAward, 
  updateAwardImage,
  addAwardImage,
  deleteAwardImage,
  deleteAward
} from './awardsService';

// Projects service exports
export {
  addProject, 
  updateProject, 
  updateProjectImage,
  addProjectImage,
  deleteProjectImage,
  deleteProject 
} from './projectsService';

// Achievements service exports
export {
  getAllAchievements,
  getConnectionsAchievements,
  getPopularAchievements,
  getAchievementById,
  createAchievement,
  updateAchievement,
  deleteAchievement
} from './achievementsService';

// API config exports (for advanced usage)
export { 
  API_BASE_URL, 
  getAuthHeaders, 
  getFileUploadHeaders, 
  constructProfilePictureUrl, 
  constructCertificateImageUrl 
} from './apiConfig';

// Staff service exports
export {
  retrieveStaff,
  createStaff,
  updateStaff,
  deleteStaff,
  getStaffDetails,
  suspendUser,
  unsuspendUser
} from './staffService';

// Services service exports
export {
  getUsedServices,
  getAlumniServiceDetails,
  getUnusedServices,
  evaluateService
} from './servicesService';
