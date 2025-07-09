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
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-[#203947] via-[#901b20] to-[#203947]">
      <div className="max-w-md w-full text-center bg-white">
        {/* ITI Logo or Icon */}
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto bg-iti-primary rounded-full flex items-center justify-center shadow-lg">
            <FaExclamationTriangle className="text-white text-3xl" />
          </div>
        </div>

        {/* 404 Text */}
        <div className="mb-6">
          <h1 className="text-6xl font-bold text-iti-primary mb-2">404</h1>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Page Not Found</h2>
          <p className="text-gray-600 leading-relaxed">
            Oops! The page you're looking for doesn't exist. It might have been moved, 
            deleted, or you entered the wrong URL.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <button
            onClick={handleGoHome}
            className="w-full bg-iti-primary hover:bg-iti-primary-dark text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center shadow-md hover:shadow-lg"
          >
            <FaHome className="mr-2" />
            Go to Home
          </button>
          
          <button
            onClick={handleGoBack}
            className="w-full bg-white hover:bg-gray-50 text-iti-primary border-2 border-iti-primary font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center shadow-md hover:shadow-lg"
          >
            <FaArrowLeft className="mr-2" />
            Go Back
          </button>
        </div>

        {/* Additional Help */}
        <div className="mt-8 p-4 bg-white rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Need Help?</h3>
          <p className="text-sm text-gray-600 mb-3">
            If you believe this is an error, please contact our support team.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 text-sm">
            <a 
              href="mailto:support@iti.gov.eg" 
              className="text-iti-primary hover:text-iti-primary-dark transition-colors duration-200"
            >
              support@iti.gov.eg
            </a>
            <span className="hidden sm:inline text-gray-400">|</span>
            <a 
              href="tel:+201234567890" 
              className="text-iti-primary hover:text-iti-primary-dark transition-colors duration-200"
            >
              +20 123 456 7890
            </a>
          </div>
        </div>

        {/* ITI Branding */}
        <div className="mt-6 text-xs text-gray-500">
          <p>Information Technology Institute (ITI)</p>
          <p>Excellence in Technology Education</p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
