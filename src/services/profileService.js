/**
 * Profile Service - Core profile data and photo uploads only
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
      method: 'PUT',
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
  const fieldNames = ['profile_picture'];
  
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
