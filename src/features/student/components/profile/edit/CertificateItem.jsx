// src/features/student/components/profile/edit/CertificateItem.jsx

import React, { useRef } from 'react';
import { FaEdit, FaTrash, FaExternalLinkAlt, FaCertificate, FaCamera } from 'react-icons/fa';

function CertificateItem({ certificate, onEdit, onDelete, onImageUpdate }) {
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
      onImageUpdate(certificate.id, file);
    }
  };

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-xl shadow-md border border-gray-200 mb-4 hover:shadow-lg transition-shadow duration-300">
      <div className="flex justify-between items-start">
        <div className="flex gap-4 flex-1">
          {/* Certificate Image */}
          <div className="flex-shrink-0">
            {(certificate.imagePath || certificate.image_path || certificate.image) ? (
              <div className="relative group cursor-pointer" onClick={handleImageClick}>
                <img 
                  src={certificate.imagePath || certificate.image_path || certificate.image} 
                  alt={certificate.title || 'Certificate'} 
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
                className="w-20 h-20 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors"
                onClick={handleImageClick}
              >
                <div className="text-center">
                  <FaCamera className="text-gray-400 text-lg mx-auto mb-1" />
                  <span className="text-xs text-gray-500">Add Image</span>
                </div>
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
          
          {/* Certificate Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <FaCertificate className="text-iti-primary h-5 w-5 flex-shrink-0" />
              <h3 className="text-lg font-bold text-gray-800 truncate">
                {certificate.title || 'Untitled Certificate'}
              </h3>
            </div>
            
            <p className="text-md text-gray-700 mb-2 truncate">
              <span className="font-medium">Organization:</span> {certificate.organization || 'Unknown Issuer'}
            </p>
            
            {certificate.description && (
              <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                {certificate.description}
              </p>
            )}
            
            <div className="text-sm text-gray-600">
              <p>
                <span className="font-medium">Issued:</span> {formatDate(certificate.achievedAt || certificate.achieved_at)}
              </p>
              
              {(certificate.certificateUrl || certificate.certificate_url) && (
                <div className="mt-2">
                  <a
                    href={certificate.certificateUrl || certificate.certificate_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-iti-primary hover:text-iti-primary-dark transition-colors duration-200"
                  >
                    <FaExternalLinkAlt className="mr-1 h-3 w-3" />
                    View Credential
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-col space-y-2 ml-4 flex-shrink-0">
          <button
            type="button"
            onClick={() => onEdit(certificate)}
            className="p-2 text-gray-500 hover:text-iti-primary hover:bg-gray-100 rounded-full transition-colors duration-200"
            title="Edit Certificate"
          >
            <FaEdit className="w-4 h-4" />
          </button>
          
          <button
            type="button"
            onClick={() => onDelete(certificate.id)}
            className="p-2 text-gray-500 hover:text-red-600 hover:bg-gray-100 rounded-full transition-colors duration-200"
            title="Delete Certificate"
          >
            <FaTrash className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default CertificateItem;
