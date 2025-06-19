// src/features/student/components/profile/edit/ProjectItem.jsx

import React from 'react';
import { FaEdit, FaTrash, FaGithub, FaExternalLinkAlt, FaCode, FaImage } from 'react-icons/fa';

function ProjectItem({ project, onEdit, onDelete }) {
  // Parse technologies string into array for display
  const technologies = project.technologiesUsed 
    ? project.technologiesUsed.split(',').map(tech => tech.trim()).filter(tech => tech)
    : [];

  const hasImage = project.images && project.images.length > 0 && project.images[0].imagePath;

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-xl shadow-md border border-gray-200 mb-4 hover:shadow-lg transition-shadow duration-300">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <FaCode className="text-iti-primary h-5 w-5" />
            <h3 className="text-lg font-bold text-gray-800">
              {project.title || 'Untitled Project'}
            </h3>
            {project.type && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-iti-secondary text-iti-primary">
                {project.type}
              </span>
            )}
          </div>
          
          {project.description && (
            <p className="text-gray-700 text-sm mb-3 line-clamp-2">
              {project.description}
            </p>
          )}
          
          {/* Technologies */}
          {technologies.length > 0 && (
            <div className="mb-3">
              <p className="text-xs font-medium text-gray-600 mb-1">Technologies:</p>
              <div className="flex flex-wrap gap-1">
                {technologies.slice(0, 4).map((tech, index) => (
                  <span 
                    key={index}
                    className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700"
                  >
                    {tech}
                  </span>
                ))}
                {technologies.length > 4 && (
                  <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-200 text-gray-600">
                    +{technologies.length - 4} more
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Project Links */}
          <div className="flex items-center gap-4 text-sm">
            {project.projectUrl && (
              <a
                href={project.projectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-iti-primary hover:text-iti-primary-dark transition-colors duration-200"
              >
                <FaExternalLinkAlt className="mr-1 h-3 w-3" />
                Live Demo
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-gray-600 hover:text-gray-800 transition-colors duration-200"
              >
                <FaGithub className="mr-1 h-3 w-3" />
                Source Code
              </a>
            )}
            {hasImage && (
              <span className="inline-flex items-center text-gray-500 text-xs">
                <FaImage className="mr-1 h-3 w-3" />
                Has Image
              </span>
            )}
          </div>
        </div>
        
        {/* Project Image Preview */}
        {hasImage && (
          <div className="ml-4 flex-shrink-0">
            <img 
              src={project.images[0].imagePath} 
              alt={project.images[0].altText || project.title || 'Project preview'}
              className="w-16 h-16 object-cover rounded-lg border border-gray-200"
            />
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="flex flex-col space-y-2 ml-4">
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
