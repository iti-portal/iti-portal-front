// src/services/featuredProjectsService.js
import { API_BASE_URL } from './apiConfig';

export const getFeaturedProjects = async (userId) => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No authentication token found');

  const response = await fetch(`${API_BASE_URL}/projects/${userId}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
      'X-Requested-With': 'XMLHttpRequest',
    },
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.message || 'Failed to fetch projects');
  }
  return result.data;
};

// Transform projects data for profile display
export const getProjectsForProfile = async (userId) => {
  const projectsData = await getFeaturedProjects(userId);
  
  // Transform the API response to match ProjectCard component expectations
  const transformedProjects = projectsData.map(project => ({
    id: project.id,
    title: project.title,
    description: project.description,
    technologiesUsed: project.technologies_used,
    projectUrl: project.project_url,
    githubUrl: project.github_url,
    startDate: project.start_date,
    endDate: project.end_date,
    isFeatured: project.is_featured,
    // Transform project images
    images: project.project_images?.map(img => ({
      id: img.id,
      imagePath: `${API_BASE_URL.replace('/api', '')}/storage/${img.image_path}`,
      altText: img.alt_text || project.title,
      order: img.order
    })) || []
  }));

  return transformedProjects;
};
