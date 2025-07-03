// src/features/student/components/profile/edit/ExperienceSection.jsx

import React from 'react';
import { FaPlus, FaBriefcase } from 'react-icons/fa';
import ExperienceItem from './ExperienceItem';

function ExperienceSection({ 
  workExperiences, 
  onAdd, 
  onEdit, 
  onDelete 
}) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-800">Your Work Experience</h3>        <button
          type="button"
          onClick={onAdd}
          className="inline-flex items-center px-4 py-2 bg-iti-primary text-white rounded-lg shadow-sm hover:bg-iti-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-iti-primary transition-colors duration-200"
        >
          <FaPlus className="mr-2 h-4 w-4" />
          Add Experience
        </button>
      </div>      <div className="max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        {workExperiences.length === 0 ? (
          <div
            key="empty-experience"
            className="text-center py-10 text-gray-500"
          >
            <FaBriefcase className="mx-auto h-10 w-10 text-gray-400 mb-3" />
            <p>No work experience entries yet. Click "Add Experience" to get started.</p>
          </div>
        ) : (
          <div>
            {workExperiences.map((experience) => (
              <ExperienceItem
                key={experience.id}
                experience={experience}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ExperienceSection;
