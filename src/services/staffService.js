/**
 * Staff Service
 * Handles all staff-related API calls for admin panel
 */

import { API_BASE_URL, getAuthHeaders, handleApiResponse } from './apiConfig';

/**
 * Retrieve all staff users
 * @returns {Promise} Staff data with pagination
 */
export const retrieveStaff = async () => {
  try {
    console.log('🔄 Fetching staff users...');
    
    const response = await fetch(`${API_BASE_URL}/admin/retrieve-staff`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    const result = await handleApiResponse(response);
    
    console.log('✅ Staff users retrieved successfully:', result);
    return result;
    
  } catch (error) {
    console.error('❌ Failed to retrieve staff users:', error);
    throw error;
  }
};

/**
 * Create a new staff user
 * @param {Object} staffData - Staff user data
 * @returns {Promise} Created staff user data
 */
export const createStaff = async (staffData) => {
  try {
    console.log('🔄 Creating staff user...', staffData);
    
    const response = await fetch(`${API_BASE_URL}/admin/create-staff`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(staffData),
    });

    const result = await handleApiResponse(response);
    
    console.log('✅ Staff user created successfully:', result);
    return result;
    
  } catch (error) {
    console.error('❌ Failed to create staff user:', error);
    throw error;
  }
};

/**
 * Update a staff user
 * @param {number} staffId - Staff user ID
 * @param {Object} staffData - Updated staff user data
 * @returns {Promise} Updated staff user data
 */
export const updateStaff = async (staffId, staffData) => {
  try {
    console.log('🔄 Updating staff user...', { staffId, staffData });
    
    const response = await fetch(`${API_BASE_URL}/admin/update-staff/${staffId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(staffData),
    });

    const result = await handleApiResponse(response);
    
    console.log('✅ Staff user updated successfully:', result);
    return result;
    
  } catch (error) {
    console.error('❌ Failed to update staff user:', error);
    throw error;
  }
};

/**
 * Delete a staff user
 * @param {number} staffId - Staff user ID
 * @returns {Promise} Deletion result
 */
export const deleteStaff = async (staffId) => {
  try {
    console.log('🔄 Deleting staff user...', staffId);
    
    const response = await fetch(`${API_BASE_URL}/admin/delete-staff/${staffId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    const result = await handleApiResponse(response);
    
    console.log('✅ Staff user deleted successfully:', result);
    return result;
    
  } catch (error) {
    console.error('❌ Failed to delete staff user:', error);
    throw error;
  }
};

/**
 * Get staff user details
 * @param {number} staffId - Staff user ID
 * @returns {Promise} Staff user details
 */
export const getStaffDetails = async (staffId) => {
  try {
    console.log('🔄 Fetching staff user details...', staffId);
    
    const response = await fetch(`${API_BASE_URL}/admin/staff/${staffId}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    const result = await handleApiResponse(response);
    
    console.log('✅ Staff user details retrieved successfully:', result);
    return result;
    
  } catch (error) {
    console.error('❌ Failed to retrieve staff user details:', error);
    throw error;
  }
};

/**
 * Suspend a user
 * @param {number} userId - User ID to suspend
 * @returns {Promise} Suspension result
 */
export const suspendUser = async (userId) => {
  try {
    console.log('🔄 Suspending user...', userId);
    
    const response = await fetch(`${API_BASE_URL}/admin/suspend-user/${userId}`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });

    const result = await handleApiResponse(response);
    
    console.log('✅ User suspended successfully:', result);
    return result;
    
  } catch (error) {
    console.error('❌ Failed to suspend user:', error);
    throw error;
  }
};

/**
 * Unsuspend a user
 * @param {number} userId - User ID to unsuspend
 * @returns {Promise} Unsuspension result
 */
export const unsuspendUser = async (userId) => {
  try {
    console.log('🔄 Unsuspending user...', userId);
    
    const response = await fetch(`${API_BASE_URL}/admin/unsuspend-user/${userId}`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });

    const result = await handleApiResponse(response);
    
    console.log('✅ User unsuspended successfully:', result);
    return result;
    
  } catch (error) {
    console.error('❌ Failed to unsuspend user:', error);
    throw error;
  }
};
