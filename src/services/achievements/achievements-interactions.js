/**
 * Achievements Interactions Service
 * Handles likes and comments for achievements
 */

import { API_BASE_URL, getAuthHeaders, handleApiResponse } from '../apiConfig';

/**
 * Like an achievement
 */
export const likeAchievement = async (id) => { 
  try {
    const response = await fetch(`${API_BASE_URL}/achievements/like`, {
      method: 'POST',
      headers: {
        ...getAuthHeaders(), // should include 'Content-Type': 'application/json' and Authorization token
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ achievement_id: id }),
    });

    return await handleApiResponse(response);
  } catch (error) {
    throw new Error(`Failed to like achievement: ${error.message}`);
  }
};

/**
 * Unlike an achievement (uses same API as like - toggles based on current state)
 */
export const unlikeAchievement = async (id) => { 
  try {
    const response = await fetch(`${API_BASE_URL}/achievements/like`, {
      method: 'POST',
      headers: {
        ...getAuthHeaders(), // should include 'Content-Type': 'application/json' and Authorization token
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ achievement_id: id }),
    });

    return await handleApiResponse(response);
  } catch (error) {
    throw new Error(`Failed to unlike achievement: ${error.message}`);
  }
};

/**
 * Add comment to an achievement
 */
export const addComment = async (achievementId, content) => {
  try {
    console.log('💬 Adding comment:', { achievementId, content });
    
    const response = await fetch(`${API_BASE_URL}/achievements/comment`, {
      method: 'POST',
      headers: {
        ...getAuthHeaders(), // should include Authorization and Content-Type
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        achievement_id: achievementId,
        content: content,
      }),
    });

    console.log('💬 Comment response status:', response.status);
    
    // Check if response is HTML (error page) instead of JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const textResponse = await response.text();
      console.error('💬 Non-JSON response:', textResponse);
      throw new Error(`Server returned non-JSON response: ${response.status} ${response.statusText}`);
    }

    const result = await handleApiResponse(response);
    console.log('💬 Comment result:', result);
    
    return result;
  } catch (error) {
    console.error('❌ Add comment error:', error);
    throw new Error(`Failed to add comment: ${error.message}`);
  }
};

/**
 * Get comments for an achievement
 */
export const getComments = async (achievementId, params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page);
    if (params.per_page) queryParams.append('per_page', params.per_page);

    const url = `${API_BASE_URL}/achievements/${achievementId}/comments${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    return await handleApiResponse(response);
  } catch (error) {
    throw new Error(`Failed to fetch comments: ${error.message}`);
  }
};

/**
 * Delete a comment
 */
export const deleteComment = async (commentId) => {
  try {
    const url = `${API_BASE_URL}/achievements/comment/${commentId}`;
    
    console.log('🗑️ Attempting to delete comment:', commentId, 'URL:', url);
    
    const response = await fetch(url, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    console.log('🗑️ Delete comment response status:', response.status, response.statusText);
    
    // Check if response is HTML (error page) instead of JSON
    const contentType = response.headers.get('content-type');
    if (!response.ok) {
      let errorMessage = `${response.status} ${response.statusText}`;
      
      if (contentType && contentType.includes('application/json')) {
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          // If JSON parsing fails, fall back to text
          const errorText = await response.text();
          errorMessage = errorText || errorMessage;
        }
      } else {
        const errorText = await response.text();
        errorMessage = errorText || errorMessage;
      }
      
      console.error('🗑️ Delete comment error response:', errorMessage);
      throw new Error(`API error: ${errorMessage}`);
    }
    
    // Only try to parse JSON if the response is OK and has JSON content type
    let result;
    if (contentType && contentType.includes('application/json')) {
      result = await response.json();
    } else {
      // Some DELETE endpoints return empty responses
      result = { success: true, message: 'Comment deleted successfully' };
    }
    
    console.log('✅ Delete comment success response:', result);
    
    return result;
  } catch (error) {
    console.error('❌ Delete comment error:', error);
    throw new Error(`Failed to delete comment: ${error.message}`);
  }
};
