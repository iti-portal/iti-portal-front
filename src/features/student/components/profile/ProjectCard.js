// src/features/student/components/profile/ProjectCard.js
import React from 'react';
import { FaGithub, FaLink } from 'react-icons/fa';

function ProjectCard({ data }) {
  return (
    <div className="bg-gray-50 rounded-lg shadow-sm overflow-hidden border border-gray-200">
      {data.images && data.images.length > 0 && (
        <img
          src={data.images[0].imagePath}
          alt={data.images[0].altText || data.title}
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{data.title}</h3>
        <p className="text-gray-700 text-sm mb-3 line-clamp-3">{data.description}</p>
        
        {data.technologiesUsed && (
          <p className="text-xs text-gray-600 mb-3">
            <strong className="font-medium">Technologies:</strong> {data.technologiesUsed}
          </p>
        )}

        <div className="flex flex-wrap gap-2 mt-auto">
          {data.projectUrl && (
            <a
              href={data.projectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200 text-sm"
            >
              <FaLink className="mr-1" /> View Project
            </a>
          )}
          {data.githubUrl && (
            <a
              href={data.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-gray-700 hover:text-gray-900 transition-colors duration-200 text-sm"
            >
              <FaGithub className="mr-1" /> GitHub
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProjectCard;
