// src/features/student/components/profile/edit/EducationSection.jsx

import React from 'react';
import { FaPlus, FaGraduationCap } from 'react-icons/fa';
import EducationItem from './EducationItem';

function EducationSection({ 
  educations, 
  onAdd, 
  onEdit, 
  onDelete 
}) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-800">Your Education</h3>        <button
          type="button"
          onClick={onAdd}
          className="inline-flex items-center px-4 py-2 bg-iti-primary text-white rounded-lg shadow-sm hover:bg-iti-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-iti-primary transition-colors duration-200"
        >          <FaPlus className="mr-2 h-4 w-4" />
          Add Education
        </button>
      </div>      <div className="max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        {educations.length === 0 ? (
          <div
            key="empty-education"
            className="text-center py-10 text-gray-500"
          >
            <FaGraduationCap className="mx-auto h-10 w-10 text-gray-400 mb-3" />
            <p>No education entries yet. Click "Add Education" to get started.</p>
          </div>
        ) : (
          <div>
            {educations.map((education) => (
              <EducationItem
                key={education.id}
                education={education}
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

export default EducationSection;
