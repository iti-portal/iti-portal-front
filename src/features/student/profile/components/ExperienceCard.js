// src/features/Student/Profile/components/ExperienceCard.js
import React from 'react';
import { FaBuilding, FaCalendarAlt } from 'react-icons/fa';

function ExperienceCard({ data }) {
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'long' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const endDateText = data.isCurrent ? 'Present' : formatDate(data.endDate);

  return (
    <div className="bg-gray-50 p-4 rounded-lg mb-4 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800">{data.position}</h3>
      <p className="text-md text-gray-600 flex items-center mt-1">
        <FaBuilding className="mr-2 text-gray-500" /> {data.companyName} - {data.location}
      </p>
      <p className="text-sm text-gray-500 flex items-center mt-1">
        <FaCalendarAlt className="mr-2 text-gray-500" /> {formatDate(data.startDate)} - {endDateText}
      </p>
      {data.description && (
        <p className="text-gray-700 mt-3 text-sm leading-relaxed">{data.description}</p>
      )}
    </div>
  );
}

export default ExperienceCard;