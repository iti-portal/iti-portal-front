/**
 * Work Experience API Example
 * This file demonstrates how to use the work experience API endpoints
 */

// Example API Usage for Work Experience

/**
 * 1. ADD WORK EXPERIENCE
 * 
 * API: POST http://127.0.0.1:8000/api/user-work-experiences
 * Headers: 
 *   - Authorization: Bearer {token}
 *   - Content-Type: application/json
 * 
 * Body:
 */
const addWorkExperienceExample = {
  "company_name": "Tech Solutions Inc.",
  "position": "Java Backend Developer",
  "start_date": "2020-01-01",
  "end_date": "2023-12-31",
  "is_current": false,
  "description": "Developed and maintained web applications."
};

/**
 * Response:
 */
const addWorkExperienceResponse = {
  "success": true,
  "message": "Work experience added successfully",
  "data": {
    "company_name": "Tech Solutions Inc.",
    "start_date": "2020-01-01T00:00:00.000000Z",
    "end_date": "2023-12-31T00:00:00.000000Z",
    "description": "Developed and maintained web applications.",
    "is_current": false,
    "position": "Java Backend Developer",
    "user_id": 4,
    "updated_at": "2025-06-30T16:17:49.000000Z",
    "created_at": "2025-06-30T16:17:49.000000Z",
    "id": 74
  }
};

/**
 * 2. UPDATE WORK EXPERIENCE
 * 
 * API: PUT http://127.0.0.1:8000/api/user-work-experiences/{work_experience_id}
 * Headers: 
 *   - Authorization: Bearer {token}
 *   - Content-Type: application/json
 * 
 * Body: (same structure as add)
 */
const updateWorkExperienceExample = {
  "company_name": "Tech Solutions Inc.",
  "position": "Senior Java Backend Developer",
  "start_date": "2020-01-01",
  "end_date": "2023-12-31",
  "is_current": false,
  "description": "Led development team and maintained web applications."
};

/**
 * 3. DELETE WORK EXPERIENCE
 * 
 * API: DELETE http://127.0.0.1:8000/api/user-work-experiences/{work_experience_id}
 * Headers: 
 *   - Authorization: Bearer {token}
 * 
 * No body required
 */

/**
 * 4. GET ALL WORK EXPERIENCES
 * 
 * API: GET http://127.0.0.1:8000/api/user-work-experiences
 * Headers: 
 *   - Authorization: Bearer {token}
 * 
 * No body required
 */

/**
 * Example implementation using our service:
 */
async function exampleUsage() {
  try {
    // Import the service
    const { addWorkExperience, updateWorkExperience, deleteWorkExperience, getUserWorkExperiences } = require('./workExperienceService');
    
    // 1. Add new work experience
    const newExperience = await addWorkExperience({
      companyName: "Tech Solutions Inc.",
      position: "Java Backend Developer",
      startDate: "2020-01-01",
      endDate: "2023-12-31",
      isCurrent: false,
      description: "Developed and maintained web applications."
    });
    
    // 2. Update existing work experience
    if (newExperience.success && newExperience.data.id) {
      const updatedExperience = await updateWorkExperience(newExperience.data.id, {
        companyName: "Tech Solutions Inc.",
        position: "Senior Java Backend Developer",
        startDate: "2020-01-01",
        endDate: "2023-12-31",
        isCurrent: false,
        description: "Led development team and maintained web applications."
      });
      
    }
    
    // 3. Get all work experiences
    const allExperiences = await getUserWorkExperiences();
    
    // 4. Delete work experience
    if (newExperience.success && newExperience.data.id) {
      const deleteResult = await deleteWorkExperience(newExperience.data.id);
    }
    
  } catch (error) {
    console.error('Error in example usage:', error);
  }
}

// Field mapping between frontend and backend:
const fieldMapping = {
  // Frontend -> Backend
  "companyName": "company_name",
  "position": "position",
  "startDate": "start_date", 
  "endDate": "end_date",
  "isCurrent": "is_current",
  "description": "description",
  
  // Backend -> Frontend (for responses)
  "company_name": "companyName",
  "start_date": "startDate",
  "end_date": "endDate", 
  "is_current": "isCurrent",
  "created_at": "createdAt",
  "updated_at": "updatedAt"
};

export { 
  addWorkExperienceExample, 
  addWorkExperienceResponse, 
  updateWorkExperienceExample,
  fieldMapping,
  exampleUsage 
};
