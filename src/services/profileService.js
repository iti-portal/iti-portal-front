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
  console.log('🔍 Starting cover photo upload with file:', {
    fileName: photoFile?.name,
    fileSize: photoFile?.size,
    fileType: photoFile?.type
  });
  
  try {
    // Use the exact field name that works in Postman
    const result = await attemptCoverPhotoUpload(photoFile, 'cover_photo');
    console.log(`✅ Cover photo upload successful`, result);
    return result;
  } catch (error) {
    console.log(`❌ Cover photo upload failed:`, error.message);
    throw error;
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

    // Check if response is JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error(`Server returned HTML instead of JSON. This usually means there's a server error. Status: ${response.status}`);
    }

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || `Failed to update profile picture with field: ${fieldName}. Status: ${response.status}`);
    }

    return {
      success: result.success || true,
      data: result.data,
      message: result.message || 'Profile picture updated successfully'
    };
  } catch (error) {
    console.error(`Profile picture upload error (field: ${fieldName}):`, error);
    throw error;
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

    console.log(`🔍 Preparing FormData for cover photo upload with field: ${fieldName}`, {
      fileName: photoFile.name,
      fileSize: photoFile.size,
      fileType: photoFile.type,
      lastModified: photoFile.lastModified
    });

    // Verify the file is actually a valid file object
    if (!(photoFile instanceof File)) {
      throw new Error('photoFile is not a valid File object');
    }

    const formData = new FormData();
    formData.append(fieldName, photoFile);

    // Debug: Log FormData entries
    console.log('🔍 FormData entries:');
    for (let [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(`  ${key}: File(name: ${value.name}, size: ${value.size} bytes, type: ${value.type})`);
      } else {
        console.log(`  ${key}:`, value);
      }
    }

    // Debug: Log headers being sent
    const headers = getFileUploadHeaders();
    console.log('🔍 Headers being sent:', headers);
    
    // Also log the token for debugging (first 10 chars only)
    const token = localStorage.getItem('token');
    console.log('🔍 Auth token (first 10 chars):', token ? token.substring(0, 10) + '...' : 'NO TOKEN');

    console.log('🔍 Making request to:', `${API_BASE_URL}/cover-photo`);

    const response = await fetch(`${API_BASE_URL}/cover-photo`, {
      method: 'POST',
      headers: headers,
      body: formData
    });

    console.log(`🔍 Cover photo upload response status: ${response.status} ${response.statusText}`);
    
    // Log response headers for debugging
    console.log('🔍 Response headers:');
    for (let [key, value] of response.headers.entries()) {
      console.log(`  ${key}: ${value}`);
    }

    // Check if response is JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const responseText = await response.text();
      console.log('🔍 Non-JSON response body:', responseText);
      throw new Error(`Server returned HTML instead of JSON. This usually means there's a server error. Status: ${response.status}`);
    }

    const result = await response.json();
    console.log(`🔍 Cover photo upload response body:`, result);

    if (!response.ok) {
      throw new Error(result.message || `Failed to update cover photo with field: ${fieldName}. Status: ${response.status}`);
    }

    return {
      success: result.success || true,
      data: result.data,
      message: result.message || 'Cover photo updated successfully'
    };
  } catch (error) {
    console.error(`Cover photo upload error (field: ${fieldName}):`, error);
    throw error;
  }
};
