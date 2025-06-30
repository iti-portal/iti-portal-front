import { useState, useEffect, useCallback } from 'react';
import { getUserProfile, updateProfilePicture, updateCoverPhoto } from '../services/profileService';

/**
 * Transform backend data to frontend format
 */
const transformProfileData = (data) => {
  if (!data) return null;

  const transformedData = { ...data };

  // Transform educations
  if (transformedData.user?.educations) {
    transformedData.user.educations = transformedData.user.educations.map(edu => ({
      ...edu,
      fieldOfStudy: edu.field_of_study,
      startDate: edu.start_date,
      endDate: edu.end_date
    }));
  }

  // Transform work experiences
  if (transformedData.user?.work_experiences) {
    transformedData.user.work_experiences = transformedData.user.work_experiences.map(exp => ({
      ...exp,
      companyName: exp.company_name,
      startDate: exp.start_date,
      endDate: exp.end_date,
      isCurrent: exp.is_current
    }));
  }

  // Transform certificates
  if (transformedData.user?.certificates) {
    transformedData.user.certificates = transformedData.user.certificates.map(cert => ({
      ...cert,
      achievedAt: cert.achieved_at,
      certificateUrl: cert.certificate_url,
      imagePath: cert.image_path ? `http://127.0.0.1:8000/storage/${cert.image_path}` : null
    }));
  }

  return transformedData;
};

/**
 * Custom hook for managing user profile data
 */
export const useProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Fetch profile data from API
   */
  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await getUserProfile();
      
      if (result.success) {
        setProfile(transformProfileData(result.data));
      } else {
        setError('Failed to fetch profile data');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while fetching profile data');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Refresh profile data
   */
  const refreshProfile = useCallback(() => {
    fetchProfile();
  }, [fetchProfile]);

  /**
   * Update local profile state
   */
  const updateLocalProfile = useCallback((updatedData) => {
    setProfile(prevProfile => ({
      ...prevProfile,
      ...updatedData
    }));
  }, []);

  /**
   * Clear profile data
   */
  const clearProfile = useCallback(() => {
    setProfile(null);
    setError(null);
    setLoading(false);
  }, []);

  /**
   * Update profile picture
   */
  const updatePhoto = useCallback(async (photoFile) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await updateProfilePicture(photoFile);
      
      if (result.success) {
        await fetchProfile();
        return {
          success: true,
          message: result.message
        };
      } else {
        throw new Error('Failed to update profile picture');
      }
    } catch (err) {
      const errorMessage = err.message || 'An error occurred while updating profile picture';
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setLoading(false);
    }
  }, [fetchProfile]);

  /**
   * Update cover photo
   */
  const updateCover = useCallback(async (photoFile) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await updateCoverPhoto(photoFile);
      
      if (result.success) {
        await fetchProfile();
        return {
          success: true,
          message: result.message
        };
      } else {
        throw new Error('Failed to update cover photo');
      }
    } catch (err) {
      const errorMessage = err.message || 'An error occurred while updating cover photo';
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setLoading(false);
    }
  }, [fetchProfile]);

  // Fetch profile data on mount
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return {
    profile,
    loading,
    error,
    refreshProfile,
    updateLocalProfile,
    clearProfile,
    updatePhoto,
    updateCover
  };
};
