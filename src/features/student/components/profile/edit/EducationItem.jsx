// src/features/student/components/profile/edit/EducationItem.jsx

import React from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';

function EducationItem({ education, onEdit, onDelete }) {
  return (
    <div className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-xl shadow-md border border-gray-200 mb-4 hover:shadow-lg transition-shadow duration-300">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-800">
            {education.degree || 'Untitled Degree'}
          </h3>
          <p className="text-md text-gray-700 mt-1">
            {education.institution || 'Unknown Institution'}
          </p>
          
          <div className="mt-2 text-sm text-gray-600">
            {education.fieldOfStudy && (
              <p><span className="font-medium">{education.fieldOfStudy}</span></p>
            )}
            <p className="mt-1">
              {education.startDate && new Date(education.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
              {education.startDate && education.endDate && ' - '}
              {education.endDate ? new Date(education.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : education.startDate ? 'Present' : ''}
            </p>
          </div>
          
          {education.description && (
            <div className="mt-3 text-gray-600 text-sm">
              <p className="whitespace-pre-line">{education.description}</p>
            </div>
          )}
        </div>
        
        <div className="flex flex-col space-y-2 ml-4">            <button
              type="button"
              onClick={() => onEdit(education)}
              className="p-2 text-gray-500 hover:text-iti-primary hover:bg-gray-100 rounded-full transition-colors duration-200"
              title="Edit Education"
            >
              <FaEdit className="w-4 h-4" />
            </button>
            
            <button
              type="button"
              onClick={() => onDelete(education.id)}
              className="p-2 text-gray-500 hover:text-red-600 hover:bg-gray-100 rounded-full transition-colors duration-200"
              title="Delete Education"            >
              <FaTrash className="w-4 h-4" />
            </button>
        </div>
      </div>
    </div>
  );
}

export default EducationItem;
