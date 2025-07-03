import React, { useEffect, useState } from 'react';
import { getFeaturedProjects } from 'src/services/featuredProjectsService';
import { API_BASE_URL } from 'src/services/apiConfig';

function FeaturedProjectsGallery({ userId }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    getFeaturedProjects(userId)
      .then(setProjects)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [userId]);

  const getImageUrl = (img) => {
    if (!img) return null;
    if (img.image_path?.startsWith('http')) return img.image_path;
    return `${API_BASE_URL.replace(/\/$/, '')}/${img.image_path?.replace(/^\//, '')}`;
  };

  if (loading) return <div>Loading featured projects...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!projects.length) return <div>No featured projects found.</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Featured Projects</h2>
      <div className="space-y-8">
        {projects.map((project) => (
          <div key={project.id} className="border rounded-lg p-4 bg-white shadow">
            <h3 className="text-lg font-semibold mb-2">{project.title}</h3>
            <p className="text-gray-700 mb-2">{project.description}</p>
            <div className="flex flex-wrap gap-2 mb-2">
              {project.project_images && project.project_images.length > 0 ? (
                project.project_images.map((img) => (
                  <img
                    key={img.id}
                    src={getImageUrl(img)}
                    alt={img.alt_text || 'Project image'}
                    className="w-24 h-24 object-cover rounded border"
                    title={img.alt_text}
                  />
                ))
              ) : (
                <span className="text-gray-400">No images</span>
              )}
            </div>
            <div className="text-xs text-gray-500">
              {project.technologies_used}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FeaturedProjectsGallery;
