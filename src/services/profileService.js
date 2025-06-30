/**
 * Profile Service - Core profile data and photo uploads
 */

import { 
  API_BASE_URL, 
  getAuthHeaders, 
  getFileUploadHeaders, 
  handleApiResponse, 
  handleNetworkError,
  constructProfilePictureUrl 
} from './apiConfig';

/**
 * Get user profile data
 */
export const getUserProfile = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/profile`, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to fetch profile data');
    }

    // Fix profile picture URL if it exists
    if (result.data?.user?.profile?.profile_picture) {
      const picturePath = result.data.user.profile.profile_picture;
      result.data.user.profile.profile_picture = constructProfilePictureUrl(picturePath);
    }

    // Fix cover photo URL if it exists
    if (result.data?.user?.profile?.cover_photo) {
      const coverPath = result.data.user.profile.cover_photo;
      result.data.user.profile.cover_photo = constructProfilePictureUrl(coverPath);
    }

    return {
      success: true,
      data: result.data,
      message: result.message
    };
  } catch (error) {
    handleNetworkError(error);
  }
};

/**
 * Update user profile data
 */
export const updateUserProfile = async (profileData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/profile`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(profileData)
    });

    return await handleApiResponse(response);
  } catch (error) {
    handleNetworkError(error);
  }
};

/**
 * Update user profile picture
 */
export const updateProfilePicture = async (photoFile) => {
  const fieldNames = ['profile_picture', 'photo', 'image', 'picture', 'avatar'];
  
  for (const fieldName of fieldNames) {
    try {
      const result = await attemptProfilePictureUpload(photoFile, fieldName);
      return result;
    } catch (error) {
      if (fieldName === fieldNames[fieldNames.length - 1]) {
        throw error;
      }
    }
  }
};

/**
 * Update user cover photo
 */
export const updateCoverPhoto = async (photoFile) => {
  const fieldNames = ['cover_photo', 'cover', 'photo', 'image'];
  
  for (const fieldName of fieldNames) {
    try {
      const result = await attemptCoverPhotoUpload(photoFile, fieldName);
      return result;
    } catch (error) {
      if (fieldName === fieldNames[fieldNames.length - 1]) {
        throw error;
      }
    }
  }
};

/**
 * Helper function to attempt profile picture upload with a specific field name
 */
const attemptProfilePictureUpload = async (photoFile, fieldName) => {
  try {
    if (!photoFile) {
      throw new Error('No photo file provided');
    }

    const formData = new FormData();
    formData.append(fieldName, photoFile);

    const response = await fetch(`${API_BASE_URL}/profile-picture`, {
      method: 'POST',
      headers: getFileUploadHeaders(),
      body: formData
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || `Failed to update profile picture with field: ${fieldName}`);
    }

    return {
      success: result.success || true,
      data: result.data,
      message: result.message || 'Profile picture updated successfully'
    };
  } catch (error) {
    handleNetworkError(error);
  }
};

/**
 * Helper function to attempt cover photo upload with a specific field name
 */
const attemptCoverPhotoUpload = async (photoFile, fieldName) => {
  try {
    if (!photoFile) {
      throw new Error('No photo file provided');
    }

    const formData = new FormData();
    formData.append(fieldName, photoFile);

    const response = await fetch(`${API_BASE_URL}/cover-photo`, {
      method: 'POST',
      headers: getFileUploadHeaders(),
      body: formData
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || `Failed to update cover photo with field: ${fieldName}`);
    }

    return {
      success: result.success || true,
      data: result.data,
      message: result.message || 'Cover photo updated successfully'
    };
  } catch (error) {
    handleNetworkError(error);
  }
};

/**
 * Education API Functions
 */

/**
 * Add a new education entry
 */
export const addEducation = async (educationData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/education/add`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(educationData)
    });

    return await handleApiResponse(response);
  } catch (error) {
    handleNetworkError(error);
  }
};

/**
 * Update an existing education entry
 */
export const updateEducation = async (educationId, educationData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/education/${educationId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(educationData)
    });

    return await handleApiResponse(response);
  } catch (error) {
    handleNetworkError(error);
  }
};

/**
 * Delete an education entry
 */
export const deleteEducation = async (educationId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/education/${educationId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    return await handleApiResponse(response);
  } catch (error) {
    handleNetworkError(error);
  }
};

/**
 * Skills API Functions
 */

/**
 * Add a new user skill
 */
export const addUserSkill = async (skillData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/user-skills/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(skillData)
    });

    return await handleApiResponse(response);
  } catch (error) {
    handleNetworkError(error);
  }
};

/**
 * Delete a user skill
 */
export const deleteUserSkill = async (skillId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/user-skills/${skillId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    return await handleApiResponse(response);
  } catch (error) {
    handleNetworkError(error);
  }
};

/**
 * Certificates API Functions
 */

/**
 * Add a new certificate
 */
export const addCertificate = async (certificateData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/certificates/add`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(certificateData)
    });

    return await handleApiResponse(response);
  } catch (error) {
    handleNetworkError(error);
  }
};

/**
 * Update an existing certificate
 */
export const updateCertificate = async (certificateId, certificateData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/certificates/${certificateId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(certificateData)
    });

    return await handleApiResponse(response);
  } catch (error) {
    handleNetworkError(error);
  }
};

/**
 * Delete a certificate
 */
export const deleteCertificate = async (certificateId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/certificates/${certificateId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    return await handleApiResponse(response);
  } catch (error) {
    handleNetworkError(error);
  }
};

/**
 * Update certificate image only
 */
export const updateCertificateImage = async (certificateId, imageFile) => {
  try {
    const formData = new FormData();
    formData.append('image', imageFile);

    const response = await fetch(`${API_BASE_URL}/certificates/${certificateId}/image`, {
      method: 'POST',
      headers: getFileUploadHeaders(),
      body: formData
    });

    return await handleApiResponse(response);
  } catch (error) {
    handleNetworkError(error);
  }
};

/**
 * Awards API Functions
 */

/**
 * Add a new award
 */
export const addAward = async (awardData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/awards`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(awardData)
    });

    return await handleApiResponse(response);
  } catch (error) {
    handleNetworkError(error);
  }
};

/**
 * Update an existing award
 */
export const updateAward = async (awardId, awardData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/awards/${awardId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(awardData)
    });

    return await handleApiResponse(response);
  } catch (error) {
    handleNetworkError(error);
  }
};

/**
 * Delete an award
 */
export const deleteAward = async (awardId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/awards/${awardId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    return await handleApiResponse(response);
  } catch (error) {
    handleNetworkError(error);
  }
};

/**
 * Work Experience API Functions
 */

/**
 * Add a new work experience entry
 */
export const addWorkExperience = async (experienceData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/work-experience/add`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(experienceData)
    });

    return await handleApiResponse(response);
  } catch (error) {
    handleNetworkError(error);
  }
};

/**
 * Update an existing work experience entry
 */
export const updateWorkExperience = async (experienceId, experienceData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/work-experience/${experienceId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(experienceData)
    });

    return await handleApiResponse(response);
  } catch (error) {
    handleNetworkError(error);
  }
};

/**
 * Delete a work experience entry
 */
export const deleteWorkExperience = async (experienceId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/work-experience/${experienceId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    return await handleApiResponse(response);
  } catch (error) {
    handleNetworkError(error);
  }
};

/**
 * Projects API Functions
 */

/**
 * Add a new project
 */
export const addProject = async (projectData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/projects`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(projectData)
    });

    return await handleApiResponse(response);
  } catch (error) {
    handleNetworkError(error);
  }
};

/**
 * Update an existing project
 */
export const updateProject = async (projectId, projectData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/projects/${projectId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(projectData)
    });

    return await handleApiResponse(response);
  } catch (error) {
    handleNetworkError(error);
  }
};

/**
 * Delete a project
 */
export const deleteProject = async (projectId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/projects/${projectId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    return await handleApiResponse(response);
  } catch (error) {
    handleNetworkError(error);
  }
};
