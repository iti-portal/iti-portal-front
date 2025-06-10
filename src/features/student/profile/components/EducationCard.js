// src/features/Student/Profile/components/EducationCard.js
import React from 'react';
import { FaGraduationCap, FaCalendarAlt, FaBookOpen } from 'react-icons/fa';

function EducationCard({ data }) {
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'long' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg mb-4 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 flex items-center">
        <FaGraduationCap className="mr-2 text-blue-600" /> {data.degree} in {data.fieldOfStudy}
      </h3>
      <p className="text-md text-gray-600 mt-1">{data.institution}</p>
      <p className="text-sm text-gray-500 flex items-center mt-1">
        <FaCalendarAlt className="mr-2 text-gray-500" /> {formatDate(data.startDate)} - {formatDate(data.endDate)}
      </p>
      {data.description && (
        <p className="text-gray-700 mt-3 text-sm leading-relaxed flex items-start">
          <FaBookOpen className="mr-2 mt-1 text-gray-500 flex-shrink-0" /> {data.description}
        </p>
      )}
    </div>
  );
}

export default EducationCard;