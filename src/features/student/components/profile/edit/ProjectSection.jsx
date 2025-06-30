// src/features/student/components/profile/edit/ProjectSection.jsx

import React from 'react';
import { FaPlus, FaCode } from 'react-icons/fa';
import ProjectItem from './ProjectItem';

function ProjectSection({ 
  projects, 
  onAdd, 
  onEdit, 
  onDelete 
}) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-800">Your Projects & Portfolio</h3>
        <button
          type="button"
          onClick={onAdd}
          className="inline-flex items-center px-4 py-2 bg-iti-primary text-white rounded-lg shadow-sm hover:bg-iti-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-iti-primary transition-colors duration-200"
        >
          <FaPlus className="mr-2 h-4 w-4" />
          Add Project
        </button>
      </div>

      <div className="max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
        {projects.length === 0 ? (
          <div
            key="empty-projects"
            className="text-center py-10 text-gray-500"
          >
            <FaCode className="mx-auto h-10 w-10 text-gray-400 mb-3" />
            <p>No projects added yet. Click "Add Project" to showcase your work.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {projects.map((project) => (
              <ProjectItem key={project.id} project={project} onEdit={onEdit} onDelete={onDelete} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProjectSection;
