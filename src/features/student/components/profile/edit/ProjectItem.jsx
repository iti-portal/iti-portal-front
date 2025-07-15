import React, { useRef } from 'react';
import { FaEdit, FaTrash, FaExternalLinkAlt, FaProjectDiagram, FaCamera, FaTimes, FaPlus } from 'react-icons/fa';

function ProjectItem({ project, onEdit, onDelete, onImageAdd, onImageDelete }) {
  const fileInputRef = useRef(null);

  const formatDate = (dateString) => {
    if (!dateString) return 'Date not specified';
    try {
      return new Date(dateString).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } catch {
      return 'Invalid date';
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0 && onImageAdd) {
      // Add each selected image
      files.forEach(file => {
        onImageAdd(project.id, file);
      });
    }
    // Clear the input
    e.target.value = '';
  };

  const handleImageDelete = (e, imageId) => {
    e.preventDefault();
    e.stopPropagation();
    if (onImageDelete && window.confirm('Are you sure you want to delete this image?')) {
      onImageDelete(imageId);
    }
  };

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-xl shadow-md border border-gray-200 mb-4 hover:shadow-lg transition-shadow duration-300">
      <div className="flex justify-between items-start">
        <div className="flex gap-4 flex-1">
          {/* Project Images */}
          <div className="flex-shrink-0">
            {(project.project_images && project.project_images.length > 0) ? (
              <div className="flex flex-wrap gap-2 max-w-[200px]">
                {project.project_images.map((img, index) => (
                  <div key={img.id || index} className="relative group">
                    <img 
                      src={`${process.env.REACT_APP_API_ASSET_URL}/${img.image_path}`}
                      alt={img.alt_text || `${project.title} image ${index + 1}`} 
                      className="w-16 h-16 object-cover rounded-lg border border-gray-200 group-hover:opacity-75 transition-opacity"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                    {/* Delete button for each image */}
                    <button
                      type="button"
                      onClick={(e) => handleImageDelete(e, img.id)}
                      className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                      title="Delete image"
                    >
                      <FaTimes className="text-xs" />
                    </button>
                  </div>
                ))}
                {/* Add more images button */}
                <div 
                  className="w-16 h-16 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleImageClick();
                  }}
                  title="Add more images"
                >
                  <FaPlus className="text-gray-400 text-sm" />
                </div>
              </div>
            ) : (
              <div 
                className="w-20 h-20 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors"
                onClick={handleImageClick}
              >
                <div className="text-center">
                  <FaCamera className="text-gray-400 text-lg mx-auto mb-1" />
                  <span className="text-xs text-gray-500">Add Images</span>
                </div>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="hidden"
            />
          </div>
          
          {/* Project Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <FaProjectDiagram className="text-iti-primary h-5 w-5 flex-shrink-0" />
              <h3 className="text-lg font-bold text-gray-800 truncate">
                {project.title || 'Untitled Project'}
              </h3>
            </div>
            
            <p className="text-sm text-gray-600 mb-2 line-clamp-2">
              {project.description || 'No description available'}
            </p>
            
            {(project.technologiesUsed || project.technologies_used) && (
              <p className="text-sm text-gray-600 mb-2">
                <span className="font-medium">Technologies:</span> {project.technologiesUsed || project.technologies_used}
              </p>
            )}
            
            <div className="text-sm text-gray-600">
              <p>
                <span className="font-medium">Created:</span> {formatDate(project.createdAt || project.created_at)}
              </p>
              
              {(project.projectUrl || project.project_url) && (
                <div className="mt-2">
                  <a
                    href={project.projectUrl || project.project_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-iti-primary hover:text-iti-primary-dark transition-colors duration-200"
                  >
                    <FaExternalLinkAlt className="mr-1 h-3 w-3" />
                    View Project
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-col space-y-2 ml-4 flex-shrink-0">
          <button
            type="button"
            onClick={() => onEdit(project)}
            className="p-2 text-gray-500 hover:text-iti-primary hover:bg-gray-100 rounded-full transition-colors duration-200"
            title="Edit Project"
          >
            <FaEdit className="w-4 h-4" />
          </button>
          
          <button
            type="button"
            onClick={() => onDelete(project.id)}
            className="p-2 text-gray-500 hover:text-red-600 hover:bg-gray-100 rounded-full transition-colors duration-200"
            title="Delete Project"
          >
            <FaTrash className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProjectItem;
