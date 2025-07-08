export async function GetAllArticles(baseUrl = 'http://127.0.0.1:8000/api/articles') {
  const token = localStorage.getItem("token");
     try {
    const response = await fetch(`${baseUrl}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch Articles ');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching Articles details:', error);
    throw error;
  }
    
}