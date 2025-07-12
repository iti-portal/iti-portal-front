import { useState, useEffect, useCallback } from 'react';
import { getUserProfile, updateProfilePicture, updateCoverPhoto } from '../services/profileService';
import { getFeaturedProjects } from '../services/featuredProjectsService';
import { useAuth } from '../contexts/AuthContext';
import { constructProfilePictureUrl } from '../services/apiConfig';


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
      imagePath: cert.image_path ? constructProfilePictureUrl(cert.image_path) : null
    }));
  }

  // Transform projects
  if (transformedData.user?.projects) {
    transformedData.user.projects = transformedData.user.projects.map(project => ({
      id: project.id,
      title: project.title,
      description: project.description,
      technologiesUsed: project.technologies_used,
      projectUrl: project.project_url,
      githubUrl: project.github_url,
      startDate: project.start_date,
      endDate: project.end_date,
      isFeatured: project.is_featured,
      // Transform project images
      images: project.project_images?.map(img => ({
        id: img.id,
        imagePath: constructProfilePictureUrl(img.image_path),
        altText: img.alt_text || project.title,
        order: img.order
      })) || []
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
  const { refreshUserProfile } = useAuth();

  /**
   * Fetch profile data from API
   */
  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await getUserProfile();
      
      if (result.success) {
        const profileData = result.data;
        
        // Fetch projects data separately if user ID is available
        if (profileData.user?.id) {
          try {
            const projectsData = await getFeaturedProjects(profileData.user.id);
            // Add projects to the profile data
            profileData.user.projects = projectsData;
          } catch (projectError) {
            console.error('Failed to fetch projects:', projectError);
            // Continue without projects data
            profileData.user.projects = [];
          }
        }
        
        setProfile(transformProfileData(profileData));
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
      
      console.log('🖼️ Starting profile picture upload...');
      const result = await updateProfilePicture(photoFile);
      
      if (result.success) {
        console.log('✅ Profile picture upload successful, refreshing data...');
        
        // Refresh local profile data
        await fetchProfile();
        console.log('📱 Local profile refreshed');
        
        // Refresh AuthContext user data to update navbar immediately
        try {
          await refreshUserProfile();
          console.log('🔄 AuthContext refreshed - Navbar should update now');
        } catch (authError) {
          console.warn('Failed to refresh auth context:', authError);
          // Don't fail the whole operation if auth refresh fails
        }
        
        return {
          success: true,
          message: result.message
        };
      } else {
        throw new Error('Failed to update profile picture');
      }
    } catch (err) {
      const errorMessage = err.message || 'An error occurred while updating profile picture';
      console.error('❌ Profile picture upload failed:', errorMessage);
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setLoading(false);
    }
  }, [fetchProfile, refreshUserProfile]);

  /**
   * Update cover photo
   */
  const updateCover = useCallback(async (photoFile) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await updateCoverPhoto(photoFile);
      
      if (result.success) {
        // Refresh local profile data
        await fetchProfile();
        
        // Refresh AuthContext user data to update navbar immediately
        try {
          await refreshUserProfile();
        } catch (authError) {
          console.warn('Failed to refresh auth context:', authError);
          // Don't fail the whole operation if auth refresh fails
        }
        
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
  }, [fetchProfile, refreshUserProfile]);

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
