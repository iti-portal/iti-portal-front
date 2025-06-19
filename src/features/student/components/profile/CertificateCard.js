// src/features/student/components/profile/CertificateCard.js
import React from 'react';
import { FaAward, FaBuilding, FaCalendarAlt, FaExternalLinkAlt } from 'react-icons/fa';

function CertificateCard({ data }) {
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg mb-4 border border-gray-200 flex items-start">
      {data.image && (
        <img src={data.image} alt={data.title} className="w-20 h-20 object-cover rounded-md mr-4 flex-shrink-0" />
      )}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <FaAward className="mr-2 text-yellow-600" /> {data.title}
        </h3>
        <p className="text-md text-gray-600 flex items-center mt-1">
          <FaBuilding className="mr-2 text-gray-500" /> {data.organization}
        </p>
        <p className="text-sm text-gray-500 flex items-center mt-1">
          <FaCalendarAlt className="mr-2 text-gray-500" /> Achieved: {formatDate(data.achievedAt)}
        </p>
        {data.certificateUrl && (
          <a
            href={data.certificateUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-blue-600 hover:underline text-sm mt-2"
          >
            View Certificate <FaExternalLinkAlt className="ml-2 text-xs" />
          </a>
        )}
      </div>
    </div>
  );
}

export default CertificateCard;
