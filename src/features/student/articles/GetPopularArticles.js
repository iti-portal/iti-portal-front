



export async function GetTrendingArticles(baseUrl = `${process.env.REACT_APP_API_URL}/articles/popular`) {
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