/**
 * Awards Service - Awards management operations
 */

import { 
  API_BASE_URL, 
  getAuthHeaders, 
  getFileUploadHeaders, 
  handleApiResponse, 
  handleNetworkError,
  constructCertificateImageUrl 
} from './apiConfig';

/**
 * Add a new award
 */
export const addAward = async (awardData) => {
  try {
    // Transform frontend data to match backend API
    const apiData = {
      title: awardData.awardName || awardData.title,
      description: awardData.description,
      organization: awardData.issuer || awardData.organization,
      achieved_at: awardData.issueDate || awardData.achieved_at,
      certificate_url: awardData.certificateUrl || awardData.certificate_url
    };

    // Remove undefined/null/empty values
    Object.keys(apiData).forEach(key => {
      if (apiData[key] === undefined || apiData[key] === null || apiData[key] === '') {
        delete apiData[key];
      }
    });

    console.log('Sending award data to API:', apiData);

    const response = await fetch(`${API_BASE_URL}/awards/add`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(apiData)
    });

    const result = await response.json();
    console.log('Add award API response:', result);

    if (!response.ok) {
      throw new Error(result.message || 'Failed to add award');
    }

    // Transform the response data to match frontend expectations
    const transformedData = result.data ? {
      id: result.data.id,
      awardName: result.data.title,
      issuer: result.data.organization,
      issueDate: result.data.achieved_at,
      description: result.data.description,
      certificateUrl: result.data.certificate_url,
      imageUrl: result.data.image_path ? constructCertificateImageUrl(result.data.image_path) : null,
      // Keep original fields for compatibility
      ...result.data
    } : null;

    return {
      success: true,
      data: transformedData,
      message: result.message || 'Award added successfully'
    };
  } catch (error) {
    handleNetworkError(error);
  }
};

/**
 * Update an existing award
 */
export const updateAward = async (awardId, awardData) => {
  try {
    // Transform frontend data to match backend API
    const apiData = {
      title: awardData.awardName || awardData.title,
      description: awardData.description,
      organization: awardData.issuer || awardData.organization,
      achieved_at: awardData.issueDate || awardData.achieved_at,
      certificate_url: awardData.certificateUrl || awardData.certificate_url
    };

    // Remove undefined/null/empty values
    Object.keys(apiData).forEach(key => {
      if (apiData[key] === undefined || apiData[key] === null || apiData[key] === '') {
        delete apiData[key];
      }
    });

    console.log('Updating award data to API:', apiData);

    const response = await fetch(`${API_BASE_URL}/awards/${awardId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(apiData)
    });

    const result = await response.json();
    console.log('Update award API response:', result);

    if (!response.ok) {
      throw new Error(result.message || 'Failed to update award');
    }

    // Transform the response data to match frontend expectations
    const transformedData = result.data ? {
      id: result.data.id,
      awardName: result.data.title,
      issuer: result.data.organization,
      issueDate: result.data.achieved_at,
      description: result.data.description,
      certificateUrl: result.data.certificate_url,
      imageUrl: result.data.image_path ? constructCertificateImageUrl(result.data.image_path) : null,
      // Keep original fields for compatibility
      ...result.data
    } : null;

    return {
      success: true,
      data: transformedData,
      message: result.message || 'Award updated successfully'
    };
  } catch (error) {
    handleNetworkError(error);
  }
};

/**
 * Update award image
 */
export const updateAwardImage = async (awardId, imageFile) => {
  try {
    if (!imageFile) {
      throw new Error('No image file provided');
    }

    const formData = new FormData();
    formData.append('image', imageFile);

    const response = await fetch(`${API_BASE_URL}/awards/image/${awardId}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'X-Requested-With': 'XMLHttpRequest'
        // DO NOT set 'Content-Type' here for FormData
      },
      body: formData
    });

    const result = await response.json();
    console.log('Update award image API response:', result);

    if (!response.ok) {
      throw new Error(result.message || 'Failed to update award image');
    }

    // Transform the response data to match frontend expectations
    const transformedData = result.data ? {
      id: result.data.id,
      title: result.data.title,
      awardName: result.data.title,
      issuer: result.data.organization,
      organization: result.data.organization,
      issueDate: result.data.achieved_at,
      achieved_at: result.data.achieved_at,
      description: result.data.description,
      certificateUrl: result.data.certificate_url,
      certificate_url: result.data.certificate_url,
      image_path: result.data.image_path,
      imagePath: result.data.image_path ? `http://127.0.0.1:8000/storage/${result.data.image_path}` : null,
      imageUrl: result.data.image_path ? constructCertificateImageUrl(result.data.image_path) : null,
      // Keep original fields for compatibility
      ...result.data
    } : null;

    return {
      success: true,
      data: transformedData,
      message: result.message || 'Award image updated successfully'
    };
  } catch (error) {
    console.error('Error in updateAwardImage service:', error);
    throw error;
  }
};

/**
 * Get all awards for a user
 */
export const getUserAwards = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/awards`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'X-Requested-With': 'XMLHttpRequest'
      }
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || 'Failed to fetch awards');
    }
    
    // Process image URLs for each award
    const awardsWithImages = (result.data || []).map(award => ({
      ...award,
      imagePath: award.image_path ? `http://127.0.0.1:8000/storage/${award.image_path}` : null,
      imageUrl: award.image_path ? constructCertificateImageUrl(award.image_path) : null
    }));
    
    return {
      success: true,
      data: awardsWithImages
    };
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
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'X-Requested-With': 'XMLHttpRequest'
      }
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to delete award');
    }

    return {
      success: true,
      message: result.message || 'Award deleted successfully'
    };
  } catch (error) {
    handleNetworkError(error);
  }
};

/**
 * Add image to award
 */
export const addAwardImage = async (awardId, imageFile, altText = '') => {
  try {
    const formData = new FormData();
    formData.append('image', imageFile);
    if (altText) {
      formData.append('alt_text', altText);
    }
    
    const response = await fetch(`${API_BASE_URL}/awards/image/${awardId}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'X-Requested-With': 'XMLHttpRequest'
        // DO NOT set 'Content-Type' here for FormData
      },
      body: formData
    });

    return await handleApiResponse(response);
  } catch (error) {
    handleNetworkError(error);
  }
};

/**
 * Delete award image
 */
export const deleteAwardImage = async (imageId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/awards/image/${imageId}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'X-Requested-With': 'XMLHttpRequest'
      }
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.message || 'Failed to delete award image');
    }

    return {
      success: true,
      data: result.data,
      message: result.message || 'Image deleted successfully'
    };
  } catch (error) {
    console.error('Error in deleteAwardImage service:', error);
    throw error;
  }
};
