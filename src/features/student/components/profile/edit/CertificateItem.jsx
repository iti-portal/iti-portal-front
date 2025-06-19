// src/features/student/components/profile/edit/CertificateItem.jsx

import React from 'react';
import { FaEdit, FaTrash, FaExternalLinkAlt, FaCertificate } from 'react-icons/fa';

function CertificateItem({ certificate, onEdit, onDelete }) {
  return (
    <div className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-xl shadow-md border border-gray-200 mb-4 hover:shadow-lg transition-shadow duration-300">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <FaCertificate className="text-iti-primary h-5 w-5" />
            <h3 className="text-lg font-bold text-gray-800">
              {certificate.name || 'Untitled Certificate'}
            </h3>
          </div>
          
          <p className="text-md text-gray-700 mt-1">
            {certificate.issuingBody || 'Unknown Issuer'}
          </p>
          
          <div className="mt-2 text-sm text-gray-600">
            {certificate.dateIssued && (
              <p className="mt-1">
                <span className="font-medium">Issued:</span> {new Date(certificate.dateIssued).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            )}
            
            {certificate.url && (
              <div className="mt-2">
                <a
                  href={certificate.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-iti-primary hover:text-iti-primary-dark text-sm transition-colors duration-200"
                >
                  <FaExternalLinkAlt className="mr-1 h-3 w-3" />
                  View Credential
                </a>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex flex-col space-y-2 ml-4">
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
