
const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY || "AIzaSyCJBsEKT4cvojOBf2tsoRHqYIKx99m1geQ";
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent";

export const getAllDevelopers = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    console.error('Authentication token not found in localStorage');
    return {
      success: false,
      data: [],
      error: 'Authentication token not found',
      count: 0,
      message: 'Please login to access this resource'
    };
  }

  const baseUrl = 'http://127.0.0.1:8000/api/itians-for-ai';
  
  try {
    const queryParams = new URLSearchParams();
    queryParams.append('include', 'skills,projects,education');
    const url = `${baseUrl}?${queryParams.toString()}`;

    console.log('Fetching developers from:', url); 

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    console.log('Response status:', response.status); 

    if (!response.ok) {
      let errorData = {};
      try {
        errorData = await response.json();
        console.error('Error response data:', errorData); 
      } catch (e) {
        console.error('Failed to parse error response:', e);
      }
      throw new Error(errorData.message || `Request failed with status ${response.status}`);
    }

    const responseData = await response.json();
    console.log('Full API response:', responseData);


    const users = Array.isArray(responseData) 
      ? responseData 
      : Array.isArray(responseData.data) 
        ? responseData.data 
        : responseData.data 
          ? [responseData.data] 
          : [];

    console.log('Processed users:', users); // Debug log

    if (users.length === 0) {
      console.warn('No user data found in response');
    }

    const enhancedUsers = users.map(user => ({
      ...user,
      skills: user.skills || [],
      track: user.profile?.track || 'Not specified',
      skillNames: (user.skills || []).map(skill => skill.name),
      hasSkills: (user.skills || []).length > 0
    }));

    return {
      success: true,
      data: enhancedUsers,
      error: null,
      count: enhancedUsers.length,
      message: 'Developers fetched successfully'
    };

  } catch (error) {
    console.error('Error in getAllDevelopers:', error);
    return {
      success: false,
      data: [],
      error: error.message,
      count: 0,
      message: `Failed to fetch developers: ${error.message}`
    };
  }
};

const API_BASE_URL = 'http://127.0.0.1:8000/api';

export async function getTopDevelopersForJob(jobId, developers, authToken) {
  if (!developers || developers.length === 0) {
    console.error('No developers provided for evaluation');
    return []; 
  }

  try {
    console.log(`Fetching job details for jobId: ${jobId}`);
    const jobResponse = await fetch(`${API_BASE_URL}/jobs/${jobId}`, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (!jobResponse.ok) {
      const errorText = await jobResponse.text();
      console.error(`Failed to fetch job data. Status: ${jobResponse.status}, Response: ${errorText}`);
      throw new Error(`Failed to fetch job data: ${jobResponse.status}`);
    }

    const jobData = await jobResponse.json();
    console.log('Job data received:', jobData);

    if (!jobData || (!jobData.data && !jobData.title)) {
      console.error('Invalid job data structure:', jobData);
      throw new Error('Invalid job data received - missing required fields');
    }

    const jobDetails = jobData.data || jobData;
    const requiredSkills = jobDetails.job_skills?.filter(s => s.is_required).map(s => s.skill?.name || s.name) || [];
    const preferredSkills = jobDetails.job_skills?.filter(s => !s.is_required).map(s => s.skill?.name || s.name) || [];

    const prompt = `
      Analyze these developers and recommend the best candidates for this job based strictly on the following criteria:
      
      JOB REQUIREMENTS:
      - Title: "${jobDetails.title || 'No title'}"
      - Required Skills: ${requiredSkills.join(', ') || 'None'}
      - Preferred Skills: ${preferredSkills.join(', ') || 'None'}
      - Experience Level: ${jobDetails.experience_level || 'Not specified'}
      - Description: "${jobDetails.description || 'No description'}"
      - Requirements: "${jobDetails.requirements || 'No requirements'}"
      
      DEVELOPERS TO ANALYZE:
      ${developers.map(dev => `
        - ID: ${dev.id}
        Name: "${dev.profile?.first_name || ''} ${dev.profile?.last_name || ''}"
        Skills: ${dev.skills?.map(s => s.name).join(', ') || 'None'}
        Experience: ${dev.profile?.years_of_experience || 0} years
        Track: ${dev.profile?.track || 'Not specified'}
        Education: ${dev.education?.map(e => `${e.degree} at ${e.institution}`).join('; ') || 'None'}
      `).join('\n')}
      
      EVALUATION INSTRUCTIONS:
      1. Analyze each developer's profile against the job requirements
      2. Only include developers who meet at least one required skill
      3. Score each candidate 0-100 based on:
         - Required skills match (50% weight)
         - Preferred skills match (20% weight)
         - Experience level alignment (15% weight)
         - Project relevance (10% weight)
         - Education background (5% weight)
      4. Return only developers with score > 10
      5. Provide detailed matching reasons and analysis
      
      RESPONSE FORMAT (STRICT JSON):
      {
        "recommendations": [
          {
            "developer_id": "id1",
            "developer_name": "John Doe",
            "score": 85,
            "matching_details": {
              "required_skill_completeness": 75,
              "matched_skills": ["skill1", "skill2"],
              "experience_match": "exact|adjacent|mismatch",
              "track_relevance": "perfect|related|unrelated",
              "strengths": ["Strong backend experience", "Relevant education"],
              "weaknesses": ["Lacking in frontend skills"],
              "reason": "Matches 3/4 required skills and has relevant project experience"
            }
          }
        ],
        "analysis_summary": "Found 3 qualified candidates out of 10"
      }
    `;


    
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          response_mime_type: "application/json"
        }
      })
    });
    

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', errorText);
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Gemini API response:', data);

    const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!responseText) {
      console.error('No response text from Gemini API');
      throw new Error('No response text from Gemini');
    }

    console.log('Gemini response text:', responseText);

    let recommendationData;
    try {
      const jsonString = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      recommendationData = JSON.parse(jsonString);
    } catch (e) {
      console.error('JSON parsing error:', e);
      console.error('Original response text:', responseText);
      throw new Error('Invalid response format from Gemini');
    }

    if (!recommendationData.recommendations || recommendationData.recommendations.length === 0) {
      console.log('No developers matched the criteria');
      return [];
    }

    // Debug: Log IDs for comparison
    console.log('Original developer IDs:', developers.map(d => d.id));
    console.log('Recommended developer IDs:', recommendationData.recommendations.map(r => r.developer_id));

    const topDevelopers = recommendationData.recommendations.map(rec => {
      // Handle both string and numeric IDs
      const developer = developers.find(d => String(d.id) === String(rec.developer_id));
      if (!developer) {
        console.warn(`Developer with ID ${rec.developer_id} not found in original list`);
        return null;
      }
      
      return {
        ...developer,
        matching_score: rec.score,
        matching_details: rec.matching_details,
        is_top_candidate: true,
        evaluation_date: new Date().toISOString()
      };
    }).filter(dev => dev !== null);

        if (!Array.isArray(topDevelopers)) {
        console.error('topDevelopers is not an array');
        return [];
        }

  } catch (error) {
    console.error('Error in getTopDevelopersForJob:', error);
    throw error;
  }
}