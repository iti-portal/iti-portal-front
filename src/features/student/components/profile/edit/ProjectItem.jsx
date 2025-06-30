import React from 'react';
// Use correct relative import for API_BASE_URL (no .js extension, lowercase 'a')
import { API_BASE_URL } from '../../../../../services/apiConfig';

function ProjectItem({ project, onEdit, onDelete }) {
  // Prevent default on button clicks to avoid form submission/page reload
  const handleEdit = (e) => {
    e.preventDefault();
    onEdit(project);
  };
  const handleDelete = (e) => {
    e.preventDefault();
    onDelete(project.id);
  };

  // Helper to get image URL (assuming backend returns relative path)
  const getImageUrl = (img) => {
    if (!img) return null;
    if (img.image_path?.startsWith('http')) return img.image_path;
    // Try both /storage/ and root for Laravel typical setups
    if (img.image_path.startsWith('storage/')) {
      return `http://127.0.0.1:8000/${img.image_path}`;
    }
    return `http://127.0.0.1:8000/storage/${img.image_path.replace(/^\/?storage\//, '')}`;
  };

  return (
    <div className="border rounded p-4 flex flex-col md:flex-row justify-between items-start md:items-center">
      <div>
        <h4 className="font-bold text-lg">{project.title}</h4>
        <p className="text-sm text-gray-600">{project.description}</p>
        <div className="text-xs text-gray-400 mt-1">
          {project.technologiesUsed || project.technologies_used}
        </div>
        {/* Show project images if available */}
        {project.project_images && project.project_images.length > 0 && (
          <div className="flex gap-2 mt-2 flex-wrap">
            {project.project_images.map((img) => (
              <img
                key={img.id}
                src={getImageUrl(img)}
                alt={img.alt_text || 'Project image'}
                className="w-20 h-20 object-cover rounded border"
                title={img.alt_text}
              />
            ))}
          </div>
        )}
      </div>
      <div className="flex gap-2 mt-2 md:mt-0">
        <button type="button" onClick={handleEdit} className="text-blue-600 hover:underline">Edit</button>
        <button type="button" onClick={handleDelete} className="text-red-600 hover:underline">Delete</button>
      </div>
    </div>
  );
}

export default ProjectItem;
