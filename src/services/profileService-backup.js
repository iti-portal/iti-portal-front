/**
 * Profile Service - API calls for user profile data
 */

const API_BASE_URL = process.env.REACT_APP_API_URL;

/**
 * Get user profile data
 */
export const getUserProfile = async () => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/profile`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
        'X-Requested-With': 'XMLHttpRequest'
      }
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
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Network error occurred. Please check your connection and try again.');
    }
    throw error;
  }
};

/**
 * Update user profile data
 */
export const updateUserProfile = async (profileData) => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: JSON.stringify(profileData)
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to update profile');
    }

    return {
      success: true,
      data: result.data,
      message: result.message
    };
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Network error occurred. Please check your connection and try again.');
    }
    throw error;
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
 * Add new education entry
 */
export const addEducation = async (educationData) => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/education/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: JSON.stringify(educationData)
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to add education');
    }

    return {
      success: true,
      data: result.data,
      message: result.message
    };
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Network error occurred. Please check your connection and try again.');
    }
    throw error;
  }
};

/**
 * Update existing education entry
 */
export const updateEducation = async (educationId, educationData) => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No authentication token found');
    }

    if (!educationId) {
      throw new Error('Education ID is required');
    }

    const response = await fetch(`${API_BASE_URL}/education/${educationId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: JSON.stringify(educationData)
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to update education');
    }

    return {
      success: true,
      data: result.data,
      message: result.message
    };
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Network error occurred. Please check your connection and try again.');
    }
    throw error;
  }
};

/**
 * Delete education entry
 */
export const deleteEducation = async (educationId) => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No authentication token found');
    }

    if (!educationId) {
      throw new Error('Education ID is required');
    }

    const response = await fetch(`${API_BASE_URL}/education/${educationId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
        'X-Requested-With': 'XMLHttpRequest'
      }
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to delete education');
    }

    return {
      success: true,
      message: result.message
    };
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Network error occurred. Please check your connection and try again.');
    }
    throw error;
  }
};

/**
 * Add new user skill
 */
export const addUserSkill = async (skillName) => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No authentication token found');
    }

    if (!skillName || !skillName.trim()) {
      throw new Error('Skill name is required');
    }

    const response = await fetch(`${API_BASE_URL}/user-skills/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: JSON.stringify({
        skill_name: skillName.trim()
      })
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to add skill');
    }

    return {
      success: true,
      data: result.data,
      message: result.message
    };
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Network error occurred. Please check your connection and try again.');
    }
    throw error;
  }
};

/**
 * Delete user skill
 */
export const deleteUserSkill = async (skillId) => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No authentication token found');
    }

    if (!skillId) {
      throw new Error('Skill ID is required');
    }

    const response = await fetch(`${API_BASE_URL}/user-skills/${skillId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
        'X-Requested-With': 'XMLHttpRequest'
      }
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to delete skill');
    }

    return {
      success: true,
      message: result.message,
      data: result.data
    };
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Network error occurred. Please check your connection and try again.');
    }
    throw error;
  }
};

/**
 * Add a new certificate
 */
export const addCertificate = async (certificateData) => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/certificates/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: JSON.stringify(certificateData)
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to add certificate');
    }

    return {
      success: true,
      data: result.data,
      message: result.message || 'Certificate added successfully'
    };
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Network error occurred. Please check your connection and try again.');
    }
    throw error;
  }
};

/**
 * Update an existing certificate
 */
export const updateCertificate = async (certificateId, certificateData) => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/certificates/${certificateId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: JSON.stringify(certificateData)
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to update certificate');
    }

    return {
      success: true,
      data: result.data,
      message: result.message || 'Certificate updated successfully'
    };
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Network error occurred. Please check your connection and try again.');
    }
    throw error;
  }
};

/**
 * Update certificate image only
 */
export const updateCertificateImage = async (certificateId, imageFile) => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No authentication token found');
    }

    const formData = new FormData();
    formData.append('image', imageFile);

    const response = await fetch(`${API_BASE_URL}/certificates/${certificateId}/image`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: formData
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to update certificate image');
    }

    return {
      success: true,
      data: result.data,
      message: result.message || 'Certificate image updated successfully'
    };
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Network error occurred. Please check your connection and try again.');
    }
    throw error;
  }
};

/**
 * Delete a certificate
 */
export const deleteCertificate = async (certificateId) => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/certificates/${certificateId}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
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
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Network error occurred. Please check your connection and try again.');
    }
    throw error;
  }
};

/**
 * Add a new award
 */
export const addAward = async (awardData) => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/awards`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: JSON.stringify(awardData)
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to add award');
    }

    return {
      success: true,
      data: result.data,
      message: result.message || 'Award added successfully'
    };
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Network error occurred. Please check your connection and try again.');
    }
    throw error;
  }
};

/**
 * Update an existing award
 */
export const updateAward = async (awardId, awardData) => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/awards/${awardId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: JSON.stringify(awardData)
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to update award');
    }

    return {
      success: true,
      data: result.data,
      message: result.message || 'Award updated successfully'
    };
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Network error occurred. Please check your connection and try again.');
    }
    throw error;
  }
};

/**
 * Delete an award
 */
export const deleteAward = async (awardId) => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/awards/${awardId}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
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
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Network error occurred. Please check your connection and try again.');
    }
    throw error;
  }
};

/**
 * Helper function to attempt profile picture upload with a specific field name
 */
const attemptProfilePictureUpload = async (photoFile, fieldName) => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No authentication token found');
    }

    if (!photoFile) {
      throw new Error('No photo file provided');
    }

    const formData = new FormData();
    formData.append(fieldName, photoFile);

    const response = await fetch(`${API_BASE_URL}/profile-picture`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
        'X-Requested-With': 'XMLHttpRequest'
      },
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
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Network error occurred. Please check your connection and try again.');
    }
    throw error;
  }
};

/**
 * Helper function to attempt cover photo upload with a specific field name
 */
const attemptCoverPhotoUpload = async (photoFile, fieldName) => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No authentication token found');
    }

    if (!photoFile) {
      throw new Error('No photo file provided');
    }

    const formData = new FormData();
    formData.append(fieldName, photoFile);

    const response = await fetch(`${API_BASE_URL}/cover-photo`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
        'X-Requested-With': 'XMLHttpRequest'
      },
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
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Network error occurred. Please check your connection and try again.');
    }
    throw error;
  }
};

/**
 * Helper function to construct profile picture URL with multiple fallbacks
 */
const constructProfilePictureUrl = (picturePath) => {
  if (!picturePath || picturePath.startsWith('http')) {
    return picturePath;
  }

  const baseUrl = 'http://127.0.0.1:8000';
  
  // Return the most likely URL pattern for Laravel
  if (picturePath.startsWith('storage/')) {
    return `${baseUrl}/${picturePath}`;
  } else if (picturePath.startsWith('media/')) {
    return `${baseUrl}/${picturePath}`;
  } else {
    // Default: try storage path first (Laravel standard)
    return `${baseUrl}/storage/${picturePath}`;
  }
};

// ===== PROJECT API FUNCTIONS =====

/**
 * Add a new project
 */
export const addProject = async (projectData) => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: JSON.stringify(projectData)
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to add project');
    }

    return {
      success: true,
      data: result.data,
      message: result.message || 'Project added successfully'
    };
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Network error occurred. Please check your connection and try again.');
    }
    throw error;
  }
};

/**
 * Update an existing project
 */
export const updateProject = async (projectId, projectData) => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/projects/${projectId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: JSON.stringify(projectData)
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to update project');
    }

    return {
      success: true,
      data: result.data,
      message: result.message || 'Project updated successfully'
    };
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Network error occurred. Please check your connection and try again.');
    }
    throw error;
  }
};

/**
 * Delete a project
 */
export const deleteProject = async (projectId) => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/projects/${projectId}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
        'X-Requested-With': 'XMLHttpRequest'
      }
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to delete project');
    }

    return {
      success: true,
      message: result.message || 'Project deleted successfully'
    };
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Network error occurred. Please check your connection and try again.');
    }
    throw error;
  }
};
