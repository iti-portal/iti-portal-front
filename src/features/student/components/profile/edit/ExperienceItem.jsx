// src/features/student/components/profile/edit/ExperienceItem.jsx

import React from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';

function ExperienceItem({ experience, onEdit, onDelete }) {
  return (
    <div className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-xl shadow-md border border-gray-200 mb-4 hover:shadow-lg transition-shadow duration-300">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-800">
            {experience.position || 'Untitled Position'}
          </h3>
          <p className="text-md text-gray-700 mt-1">
            {experience.companyName || 'Unknown Company'}
            {experience.location && <span className="text-gray-500"> • {experience.location}</span>}
          </p>
          
          <div className="mt-2 text-sm text-gray-600">
            <p className="mt-1">
              {experience.startDate && new Date(experience.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
              {experience.startDate && (experience.endDate || experience.isCurrent) && ' - '}
              {experience.isCurrent ? (
                <span className="text-iti-primary font-medium">Present</span>
              ) : experience.endDate ? (
                new Date(experience.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
              ) : ''}
            </p>
          </div>
          
          {experience.description && (
            <div className="mt-3 text-gray-600 text-sm">
              <p className="whitespace-pre-line">{experience.description}</p>
            </div>
          )}
        </div>
        
        <div className="flex flex-col space-y-2 ml-4">            <button
              type="button"
              onClick={() => onEdit(experience)}
              className="p-2 text-gray-500 hover:text-iti-primary hover:bg-gray-100 rounded-full transition-colors duration-200"
              title="Edit Experience"
            >
              <FaEdit className="w-4 h-4" />
            </button>
            
            <button
              type="button"
              onClick={() => onDelete(experience.id)}
              className="p-2 text-gray-500 hover:text-red-600 hover:bg-gray-100 rounded-full transition-colors duration-200"
              title="Delete Experience"            >
              <FaTrash className="w-4 h-4" />
            </button>
        </div>
      </div>
    </div>
  );
}

export default ExperienceItem;
