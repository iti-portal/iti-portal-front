export async function getCompanyJobs(baseUrl = 'http://127.0.0.1:8000/api/companies/jobs') {
  const token = localStorage.getItem("token");
  let allJobs = [];
  let currentPage = 1;
  let hasMorePages = true;

  try {
    while (hasMorePages) {
      const url = `${baseUrl}?page=${currentPage}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success && data.data && data.data.data) {
        allJobs = [...allJobs, ...data.data.data];

        if (data.data.next_page_url) {
          currentPage++;
        } else {
          hasMorePages = false;
        }
      } else {
        hasMorePages = false;
        if (!data.success) {
          console.error('API returned unsuccessful response:', data.message);
        }
      }
    }

    console.log(`Retrieved ${allJobs.length} jobs from the company API.`);
    return {
      success: true,
      message: `Retrieved ${allJobs.length} jobs`,
      data: allJobs
    };
  } catch (error) {
    console.error('Error fetching company jobs:', error);
    return {
      success: false,
      message: `Failed to retrieve jobs: ${error.message}`,
      data: []
    };
  }
}
