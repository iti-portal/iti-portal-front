/**
 * Data transformation utilities for achievements
 * Maps API response format to component expected format
 */

/**
 * Transform API achievement data to component format
 */
export const transformAchievementData = (apiAchievement) => {
  if (!apiAchievement) return null;

  return {
    id: apiAchievement.id,
    type: apiAchievement.type || 'certification',
    title: apiAchievement.title,
    description: apiAchievement.description,
    
    // Map user profile data
    user: apiAchievement.user_profile ? {
      name: `${apiAchievement.user_profile.first_name} ${apiAchievement.user_profile.last_name}`,
      avatar: apiAchievement.user_profile.profile_picture 
        ? `${process.env.REACT_APP_API_ASSET_URL}/${apiAchievement.user_profile.profile_picture}`
        : '/avatar.png',
      role: 'Community Member' // Default role since API doesn't provide this
    } : null,
    
    // Add social interaction data
    like_count: apiAchievement.like_count || 0,
    comment_count: apiAchievement.comment_count || 0,
    is_liked: apiAchievement.is_liked || false,
    
    // Date mapping
    created_at: apiAchievement.created_at,
    start_date: apiAchievement.start_date || apiAchievement.created_at,
    end_date: apiAchievement.end_date,
    issue_date: apiAchievement.issue_date,
    
    // Additional data
    url: apiAchievement.url,
    image: apiAchievement.image,
    tags: apiAchievement.tags || [],
    status: 'published', // Default since API data is published
    organization: apiAchievement.organization,
    
    // Keep original API data for reference
    _original: apiAchievement
  };
};

/**
 * Transform array of API achievements
 */
export const transformAchievementsArray = (apiAchievements) => {
  if (!Array.isArray(apiAchievements)) return [];
  
  return apiAchievements
    .map(transformAchievementData)
    .filter(Boolean); // Remove any null transformations
};
