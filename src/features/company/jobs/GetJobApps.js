const getAllJobApplications = async (jobId, baseUrl = `${process.env.REACT_APP_API_URL}/company/applications`) => {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch(`${baseUrl}?job_id=${jobId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      if (response.status === 404) {
        // Return empty data for 404
        return { data: [] };
      }
    }

    const apps = await response.json();
    return apps;
  } catch (error) {
    console.error('Error fetching job details:', error);
    throw error;
  }
}; export default getAllJobApplications


// GetJobApps.js
