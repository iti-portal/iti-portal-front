// src/features/student/components/profile/edit/AwardItem.jsx

import React from 'react';
import { FaEdit, FaTrash, FaExternalLinkAlt, FaTrophy } from 'react-icons/fa';

function AwardItem({ award, onEdit, onDelete }) {
  return (
    <div className="bg-gradient-to-br from-white to-yellow-50 p-6 rounded-xl shadow-md border border-gray-200 mb-4 hover:shadow-lg transition-shadow duration-300">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <FaTrophy className="text-yellow-600 h-5 w-5" />
            <h3 className="text-lg font-bold text-gray-800">
              {award.name || award.title || 'Untitled Award'}
            </h3>
          </div>
          
          <p className="text-md text-gray-700 mt-1">
            {award.issuingBody || award.organization || 'Unknown Organization'}
          </p>
          
          <div className="mt-2 text-sm text-gray-600">
            {award.dateIssued && (
              <p className="mt-1">
                <span className="font-medium">Awarded:</span> {new Date(award.dateIssued).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            )}
            
            {award.description && (
              <p className="mt-2 text-gray-600">
                {award.description}
              </p>
            )}
            
            {award.url && (
              <div className="mt-2">
                <a
                  href={award.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-yellow-600 hover:text-yellow-700 text-sm transition-colors duration-200"
                >
                  <FaExternalLinkAlt className="mr-1 h-3 w-3" />
                  View Award
                </a>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex flex-col space-y-2 ml-4">
          <button
            type="button"
            onClick={() => onEdit(award)}
            className="p-2 text-gray-500 hover:text-yellow-600 hover:bg-gray-100 rounded-full transition-colors duration-200"
            title="Edit Award"
          >
            <FaEdit className="w-4 h-4" />
          </button>
          
          <button
            type="button"
            onClick={() => onDelete(award.id)}
            className="p-2 text-gray-500 hover:text-red-600 hover:bg-gray-100 rounded-full transition-colors duration-200"
            title="Delete Award"
          >
            <FaTrash className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default AwardItem;
