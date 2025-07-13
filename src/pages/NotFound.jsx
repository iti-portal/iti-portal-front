import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHome, FaArrowLeft, FaExclamationTriangle } from 'react-icons/fa';

const NotFound = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#203947] via-[#901b20] to-[#203947] px-4">
      <div className="bg-white rounded-xl shadow-xl p-6 sm:p-8 max-w-sm w-full text-center">
        {/* Icon */}
        <div className="mb-6">
          <div className="w-16 h-16 mx-auto bg-[#901b20] rounded-full flex items-center justify-center shadow-md">
            <FaExclamationTriangle className="text-white text-2xl" />
          </div>
        </div>

        {/* Text */}
        <h1 className="text-4xl font-bold text-[#901b20] mb-2">404</h1>
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Page Not Found</h2>
        <p className="text-gray-600 text-sm mb-6">
          Oops! The page you're looking for doesn't exist.
        </p>

        {/* Buttons */}
        <div className="space-y-3 mb-6">
          <button
            onClick={handleGoHome}
            className="w-full bg-[#901b20] hover:bg-[#7a1419] text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center shadow"
          >
            <FaHome className="mr-2" />
            Go to Home
          </button>
          <button
            onClick={handleGoBack}
            className="w-full border-2 border-[#901b20] text-[#901b20] hover:bg-gray-50 font-medium py-2 px-4 rounded-lg flex items-center justify-center shadow-sm"
          >
            <FaArrowLeft className="mr-2" />
            Go Back
          </button>
        </div>

        {/* Help */}
        <div className="text-sm text-gray-500 mb-4">
          <p>If you need help:</p>
          <a
            href="mailto:support@iti.gov.eg"
            className="block text-[#901b20] hover:underline"
          >
            support@iti.gov.eg
          </a>
          <a
            href="tel:+201234567890"
            className="block text-[#901b20] hover:underline"
          >
            +20 123 456 7890
          </a>
        </div>

        {/* Footer */}
        <div className="text-xs text-gray-400">
          <p>Information Technology Institute</p>
          <p>Excellence in Tech Education</p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
