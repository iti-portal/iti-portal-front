/**
 * Certificates Service - Certificates management operations
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
 * Add a new certificate
 */
export const addCertificate = async (certificateData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/certificates`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(certificateData)
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to add certificate');
    }

    // Transform the response data to match frontend expectations
    const transformedData = result.data ? {
      ...result.data,
      id: result.data.id,
      certificateName: result.data.certificate_name || result.data.certificateName,
      issuer: result.data.issuer,
      issueDate: result.data.issue_date || result.data.issueDate,
      expiryDate: result.data.expiry_date || result.data.expiryDate,
      description: result.data.description,
      certificateUrl: result.data.certificate_url || result.data.certificateUrl,
      imageUrl: result.data.image_url ? constructCertificateImageUrl(result.data.image_url) : null
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
    const response = await fetch(`${API_BASE_URL}/certificates/${certificateId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(certificateData)
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to update certificate');
    }

    // Transform the response data to match frontend expectations
    const transformedData = result.data ? {
      ...result.data,
      id: result.data.id,
      certificateName: result.data.certificate_name || result.data.certificateName,
      issuer: result.data.issuer,
      issueDate: result.data.issue_date || result.data.issueDate,
      expiryDate: result.data.expiry_date || result.data.expiryDate,
      description: result.data.description,
      certificateUrl: result.data.certificate_url || result.data.certificateUrl,
      imageUrl: result.data.image_url ? constructCertificateImageUrl(result.data.image_url) : null
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
      ...result.data,
      id: result.data.id,
      certificateName: result.data.certificate_name || result.data.certificateName,
      issuer: result.data.issuer,
      issueDate: result.data.issue_date || result.data.issueDate,
      expiryDate: result.data.expiry_date || result.data.expiryDate,
      description: result.data.description,
      certificateUrl: result.data.certificate_url || result.data.certificateUrl,
      imageUrl: result.data.image_url ? constructCertificateImageUrl(result.data.image_url) : null
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
