
const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY || "AIzaSyCx5rDbMsQ03FrGo6SAHjo4wna0_-VIjQE";
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

  const baseUrl = `${process.env.REACT_APP_API_URL}/itians-for-ai`;
  
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

const API_BASE_URL = `${process.env.REACT_APP_API_URL}`;


export async function getTopDevelopersForJob(jobId, developers, authToken) {
  if (!developers || developers.length === 0) {
    console.error('No developers provided for evaluation');
    return [];
  }

  try {
    // Fetch job details
    const jobResponse = await fetch(`${API_BASE_URL}/jobs/${jobId}`, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (!jobResponse.ok) {
      const errorText = await jobResponse.text();
      throw new Error(`Failed to fetch job data: ${jobResponse.status}`);
    }

    const jobData = await jobResponse.json();
    const jobDetails = jobData.data || jobData;
    const requiredSkills = jobDetails.job_skills?.filter(s => s.is_required).map(s => s.skill?.name || s.name) || [];

    // Pre-process developer data for efficiency
    const devSummaries = developers.map(dev => ({
      id: dev.id,
      name: `${dev.profile?.first_name || ''} ${dev.profile?.last_name || ''}`.trim(),
      skills: (dev.skills || []).map(s => s.name),
      track: dev.profile?.track || 'Not specified',
      summary: dev.profile?.summary || 'No summary'
    }));

    const prompt = `
      Analyze these developers and recommend the best candidates for this job based on the following criteria:

      JOB REQUIREMENTS:
      - Title: "${jobDetails.title || 'No title'}"
      - Required Skills: ${requiredSkills.length > 0 ? requiredSkills.join(', ') : 'None'}
      - Description: "${jobDetails.description || 'No description'}"

      EVALUATION CRITERIA (100 points total):
      1. Required Skills Match (60 points):
         - 10 points per required skill matched
         - Max 60 points
      2. Track Relevance (30 points):
         - Perfect match: 30 points
         - Related field: 20 points
         - Unrelated: 0 points
      3. Summary Relevance (10 points):
         - High relevance: 10 points
         - Some relevance: 5 points
         - No relevance: 0 points

      DEVELOPERS TO ANALYZE (${devSummaries.length} candidates):
      ${devSummaries.map(dev => `
        Developer ID: ${dev.id}
        Name: "${dev.name}"
        Track: "${dev.track}"
        Skills: ${dev.skills.length > 0 ? dev.skills.join(', ') : 'None'}
        Summary: "${dev.summary}"
      `).join('\n')}

      OUTPUT REQUIREMENTS:
      - Return ONLY a JSON array of developers with score >= 40
      - Sort by score descending
      - Include matching details
      - Format:
        [{
          "developer_id": "id",
          "score": number,
          "track_name": "track"
          "developer_skills": "skills",
          "matched_skills": ["skill1", "skill2"],
          "track_relevance": "perfect|related|unrelated",
          "summary_relevance": "high|some|none",
          "reason": "short explanation and must describtive reason for the recommendation"
        }]
    `;

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.2,  
          response_mime_type: "application/json"
        }
      })
    });

    const data = await response.json();
    const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    

    const cleanedResponse = responseText.replace(/```json|```/g, '').trim();
    const recommendations = JSON.parse(cleanedResponse);

    // Map recommendations back to full developer objects and sort
    const matchedDevelopers = recommendations
      .map(rec => {
        const developer = developers.find(d => String(d.id) === String(rec.developer_id));
        return developer ? {
          ...developer,
          matching_score: rec.score,
          matching_details: {
            matched_skills: rec.matched_skills || [],
            track_relevance: rec.track_relevance || 'unrelated',
            summary_relevance: rec.summary_relevance || 'none',
            reason: rec.reason || ''
          }
        } : null;
      })
      .filter(Boolean)
      .sort((a, b) => b.matching_score - a.matching_score);  

    return matchedDevelopers;

  } catch (error) {
    console.error('Error in getTopDevelopersForJob:', error);
    throw error;
  }
}