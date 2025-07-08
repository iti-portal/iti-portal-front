/**
 * Certificates Service - Certificates management operations
 */

import { 
  API_BASE_URL, 
  getAuthHeaders, 
  getFileUploadHeaders, 
  handleNetworkError,
  constructCertificateImageUrl 
} from './apiConfig';

/**
 * Add a new certificate
 */
export const addCertificate = async (certificateData) => {
  try {
    // Transform frontend data to match backend API
    const apiData = {
      title: certificateData.certificateName || certificateData.title,
      description: certificateData.description,
      organization: certificateData.issuer || certificateData.organization,
      achieved_at: certificateData.issueDate || certificateData.achieved_at,
      certificate_url: certificateData.certificateUrl || certificateData.certificate_url
    };

    // Remove undefined/null/empty values
    Object.keys(apiData).forEach(key => {
      if (apiData[key] === undefined || apiData[key] === null || apiData[key] === '') {
        delete apiData[key];
      }
    });


    const response = await fetch(`${API_BASE_URL}/certificates/add`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(apiData)
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || 'Failed to add certificate');
    }

    // Transform the response data to match frontend expectations
    const transformedData = result.data ? {
      id: result.data.id,
      certificateName: result.data.title,
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
      message: result.message || 'Certificate added successfully'
    };
  } catch (error) {
    handleNetworkError(error);
  }
};

/**
 * Update an existing certificate
 */
export const updateCertificate = async (certificateId, certificateData) => {
  try {
    // Transform frontend data to match backend API
    const apiData = {
      title: certificateData.certificateName || certificateData.title,
      description: certificateData.description,
      organization: certificateData.issuer || certificateData.organization,
      achieved_at: certificateData.issueDate || certificateData.achieved_at,
      certificate_url: certificateData.certificateUrl || certificateData.certificate_url
    };

    // Remove undefined/null/empty values
    Object.keys(apiData).forEach(key => {
      if (apiData[key] === undefined || apiData[key] === null || apiData[key] === '') {
        delete apiData[key];
      }
    });


    const response = await fetch(`${API_BASE_URL}/certificates/${certificateId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(apiData)
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to update certificate');
    }

    // Transform the response data to match frontend expectations
    const transformedData = result.data ? {
      id: result.data.id,
      certificateName: result.data.title,
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
      message: result.message || 'Certificate updated successfully'
    };
  } catch (error) {
    handleNetworkError(error);
  }
};

/**
 * Update certificate image
 */
export const updateCertificateImage = async (certificateId, imageFile) => {
  try {
    if (!imageFile) {
      throw new Error('No image file provided');
    }

    const formData = new FormData();
    formData.append('image', imageFile);

    const response = await fetch(`${API_BASE_URL}/certificates/${certificateId}/image`, {
      method: 'POST',
      headers: getFileUploadHeaders(),
      body: formData
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to update certificate image');
    }

    // Transform the response data to match frontend expectations
    const transformedData = result.data ? {
      id: result.data.id,
      certificateName: result.data.title,
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
      message: result.message || 'Certificate image updated successfully'
    };
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
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'X-Requested-With': 'XMLHttpRequest'
      }
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to delete certificate');
    }

    return {
      success: true,
      message: result.message || 'Certificate deleted successfully'
    };
  } catch (error) {
    handleNetworkError(error);
  }
};
