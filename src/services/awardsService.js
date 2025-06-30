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
      headers: getFileUploadHeaders(),
      body: formData
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to update award image');
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
      message: result.message || 'Award image updated successfully'
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
