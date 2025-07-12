const getJobdetails = async (jobId, baseUrl = 'http://127.0.0.1:8000/api/jobs') => {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch(`${baseUrl}/${jobId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch job details');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching job details:', error);
    throw error;
  }
}; export default getJobdetails;