const API_TOKEN = localStorage.getItem('token') ;
const BASE_API_URL = 'http://127.0.0.1:8000/api/jobs';

export async function fetchAllJobs() {
  let allJobs = [];
  let currentPage = 1;
  let hasMorePages = true;
  
  try {
    while (hasMorePages) {
      const response = await fetch(`${BASE_API_URL}?page=${currentPage}`, {
        headers: {
          'Authorization': `Bearer ${API_TOKEN}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (!data.data || !Array.isArray(data.data.data)) {
        throw new Error('Invalid API response structure');
      }

      allJobs = [...allJobs, ...data.data.data];
      hasMorePages = data.data.next_page_url !== null;
      currentPage++;
      
      if (hasMorePages) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    return { 
      jobs: allJobs, 
      total: allJobs.length, 
      pagesFetched: currentPage - 1
    };
    
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return { 
      jobs: allJobs,
      total: allJobs.length,
      error: error.message,
      partial: true
    };
  }
}

export async function fetchUserSkills(token) {
  try {
    const response = await fetch(`http://127.0.0.1:8000/api/profile`, {
      method: "GET",
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': "application/json"
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user profile');
    }

    const data = await response.json();
    if (data.success && data.data?.user?.skills) {
      return data.data.user.skills.map(skill => skill.name.toLowerCase());
    }
    return []; 
  } catch (error) {
    console.error("Error fetching user skills:", error);
    return [];
  }
}

export async function fetchGovernorates() {
  try {
    const response = await fetch('https://raw.githubusercontent.com/Tech-Labs/egypt-governorates-and-cities-db/master/governorates.json');
    
    if (!response.ok) {
      throw new Error('Failed to fetch governorates');
    }

    const data = await response.json();
    const table = data.find(item => item.type === "table" && item.name === "governorates");
    
    if (table && Array.isArray(table.data)) {
      return table.data;
    }
    return [];
  } catch (error) {
    console.error('Error fetching governorates:', error);
    throw error;
  }
}

export const formatSalary = (min, max) => {
  if (!min && !max) return 'Salary not specified';
  return `$${min?.toLocaleString()} - $${max?.toLocaleString()}`;
};

export const getExperienceLevel = (level) => {
  const levels = {
    'entry': 'Entry Level',
    'junior': 'Junior',
    'mid': 'Mid-Level',
    'senior': 'Senior',
    'lead': 'Lead'
  };
  return levels[level] || level;
};

export const getJobType = (type) => {
  const types = {
    'full_time': 'Full Time',
    'part_time': 'Part Time',
    'contract': 'Contract',
    'freelance': 'Freelance',
    'internship': 'Internship'
  };
  return types[type] || type;
};

const GEMINI_API_KEY = "AIzaSyD_fmGbLK4oQlfUge83zIFtLNMp-Qo_FQE";
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent";

export async function getRecommendedJobs(userSkills, jobs) {
  console.log('Starting job recommendation process...');
  
  if (!userSkills || !jobs || jobs.length === 0) {
    console.warn('Invalid input: missing user skills or jobs');
    return [];
  }

  try {
    const prompt = `
      Analyze these jobs and recommend the top 10 based on the user's skills.
      For each recommended job, provide:
      - The job ID
      - A matching score (0-100)
      - A brief reason for the recommendation
      - Which user skills match the job requirements

      USER SKILLS: ${JSON.stringify(userSkills)}

      JOBS TO ANALYZE:
      ${jobs.map(job => `
        - ID: ${job.id}, Title: "${job.title}", 
        Required Skills: ${job.skills?.join(', ') }, 
        Description: "${job.description || 'No description'}",
        JobRequirements: "${job.requirement}"
      `).join('\n')}

      RESPONSE FORMAT (STRICT JSON):
      {
        "recommendations": [
          {
            "job_id": "id1",
            "score": 85 "high score for higher number of matching skills and high score based on the effect of every skill in job title",
            "reason": "Matches 3 of 4 required skills" ,
            "matched_skills": ["skill1", "skill2", "skill3"]
          },
          ...
        ]
      }
    `;

    console.log('Sending request to Gemini API...');
    
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
      })
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!responseText) {
      throw new Error('No response text from Gemini');
    }

    let recommendationData;
    try {
      const jsonMatch = responseText.match(/\{.*\}/s);
      if (!jsonMatch) throw new Error('No JSON object found');
      recommendationData = JSON.parse(jsonMatch[0]);
      if (!recommendationData.recommendations) throw new Error('Invalid recommendations format');
    } catch (e) {
      console.error('Failed to parse response:', e);
      throw new Error('Invalid response format');
    }

    const recommendedJobs = recommendationData.recommendations
      .slice(0, 10)
      .map(rec => {
        const job = jobs.find(j => j.id == rec.job_id);
        if (!job) return null;
        
        return {
          ...job,
          matching_score: rec.score,
          matching_reason: rec.reason,
          matched_skills: rec.matched_skills,
          is_recommended: true,
          recommendation_date: new Date().toISOString()
        };
      })
      .filter(job => job !== null);

    console.log('Successfully retrieved recommendations with details');
    return recommendedJobs;

  } catch (error) {
    console.error('Error in job recommendation:', error);
    throw error;
  }
}