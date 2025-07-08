const GEMINI_API_KEY = "AIzaSyD_fmGbLK4oQlfUge83zIFtLNMp-Qo_FQE";
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent";
export async function getTopApplicationsForJob(jobId, applications, jobData) {
  console.log('Starting application recommendation process for job:', jobId);
  
  if (!applications || applications.length === 0) {
    console.warn('No applications available for this job');
    return [];
  }

  if (!jobData) {
    console.warn('No job data provided');
    return [];
  }
  console.log('Job data retrieved in app reco:', jobData.title);
  console.log('Job data retrieved in app reco:', jobData.experience_level); 


  console.log('Applications data retrieved:',jobData.description);
  try {
    const prompt = `
      Analyze these job applications and recommend the top 5 candidates for this specific job.
      For each recommended application, provide:
      - The application ID
      - A matching score (0-100) based on:
        * Skills match (50% weight)
        * Experience level match (20% weight)
        * Cover letter relevance (20% weight)
        * Education/program match (10% weight)
      - A brief reason for the recommendation
      - Which applicant skills match the job requirements
      - 2-3 key strengths of the candidate

      JOB DETAILS:
      - Title: "${jobData.title}"
      - Required Skills: ${jobData.job_skills?.filter(s => s.is_required).map(s => s.skill?.name || s.name).join(', ')}
      - Experience Level: ${jobData.experience_level}
      - Description: "${jobData.description || 'No description'}"
      - Requirements: "${jobData.requirements || 'No requirements'}"

      
      APPLICATIONS TO ANALYZE:
      ${applications.map(app => `
        - ID: ${app.id}, 
        Applicant: "${app.user.profile.first_name} ${app.user.profile.last_name}",
        Skills: ${app.user.skills.map(s => s.name).join(', ') || 'None'},
        Experience: ${app.user?.profile?.student_status === 'graduate' ? 'Graduate' : 'Student'},
        Program: ${app.user?.profile?.program || 'Not specified'},
        Track: ${app.user?.profile?.track || 'Not specified'},
        Cover Letter: "${app.cover_letter || 'No cover letter'}"
      `).join('\n')}

      RESPONSE FORMAT (STRICT JSON):
      {
        "recommendations": [
          {
            "application_id": "id1",
            "score": 92,
            "reason": "Matches all required skills and has relevant experience",
            "matched_skills": ["skill1", "skill2"],
            "strengths": ["Strong cover letter", "Relevant education"]
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

    const topApplications = recommendationData.recommendations
      .slice(0, 5) 
      .map(rec => {
        const application = applications.find(a => a.id == rec.application_id);
        if (!application) return null;
        
        return {
          ...application,
          matching_score: rec.score,
          matching_reason: rec.reason,
          matched_skills: rec.matched_skills,
          strengths: rec.strengths || [],
          is_top_candidate: true,
          evaluation_date: new Date().toISOString()
        };
      })
      .filter(app => app !== null);

    console.log('Successfully retrieved top applications with details');
    return topApplications;

  } catch (error) {
    console.error('Error in application recommendation:', error);
    throw error;
  }
}



