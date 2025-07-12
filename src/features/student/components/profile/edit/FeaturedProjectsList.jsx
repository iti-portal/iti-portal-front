import React, { useEffect, useState } from 'react';
import { getFeaturedProjects } from '../../../../../services/featuredProjectsService';
import { API_BASE_URL } from '../../../../../services/apiConfig';
import ProjectItem from './ProjectItem';

function FeaturedProjectsList({ userId, onEdit, onDelete }) {
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

  if (loading) return <div>Loading featured projects...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!projects.length) return <div>No featured projects found.</div>;

  return (
    <div className="space-y-6">
      {projects.map((project) => (
        <ProjectItem
          key={project.id}
          project={project}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

export default FeaturedProjectsList;
