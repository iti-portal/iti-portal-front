// src/features/student/components/profile/edit/AwardItem.jsx

import React, { useRef } from 'react';
import { FaEdit, FaTrash, FaExternalLinkAlt, FaTrophy, FaCamera } from 'react-icons/fa';

function AwardItem({ award, onEdit, onDelete, onImageUpdate }) {
  const fileInputRef = useRef(null);
  const formatDate = (dateString) => {
    if (!dateString) return 'Date not specified';
    try {
      return new Date(dateString).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } catch {
      return 'Invalid date';
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && onImageUpdate) {
      onImageUpdate(award.id, file);
    }
  };

  return (
    <div className="bg-gradient-to-br from-white to-yellow-50 p-6 rounded-xl shadow-md border border-gray-200 mb-4 hover:shadow-lg transition-shadow duration-300">
      <div className="flex justify-between items-start">
        <div className="flex gap-4 flex-1">
          {/* Award Image */}
          <div className="flex-shrink-0">
            {(award.imagePath || award.image_path || award.image) ? (
              <div className="relative group cursor-pointer" onClick={handleImageClick}>
                <img 
                  src={award.imagePath || award.image_path || award.image} 
                  alt={award.title || award.name || 'Award'} 
                  className="w-20 h-20 object-cover rounded-lg border border-gray-200 group-hover:opacity-75 transition-opacity"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black bg-opacity-50 rounded-lg">
                  <FaCamera className="text-white text-xl" />
                </div>
              </div>
            ) : (
              <div 
                className="w-20 h-20 bg-yellow-100 border-2 border-dashed border-yellow-300 rounded-lg flex items-center justify-center cursor-pointer hover:bg-yellow-200 transition-colors group"
                onClick={handleImageClick}
                title="Upload award image"
              >
                <FaCamera className="text-yellow-500 text-xl group-hover:text-yellow-600" />
              </div>
            )}
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>

          {/* Award Content */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <FaTrophy className="text-yellow-600 h-5 w-5" />
              <h3 className="text-lg font-bold text-gray-800">
                {award.title || award.name || 'Untitled Award'}
              </h3>
            </div>
            
            <p className="text-md text-gray-700 mt-1">
              {award.organization || award.issuingBody || 'Unknown Organization'}
            </p>
            
            <div className="mt-2 text-sm text-gray-600">
              {(award.achieved_at || award.dateIssued) && (
                <p className="mt-1">
                  <span className="font-medium">Awarded:</span> {formatDate(award.achieved_at || award.dateIssued)}
                </p>
              )}
              
              {award.description && (
                <p className="mt-2 text-gray-600">
                  {award.description}
                </p>
              )}
              
              {(award.certificate_url || award.url) && (
                <div className="mt-2">
                  <a
                    href={award.certificate_url || award.url}
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
