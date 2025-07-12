import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Unauthorized = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 bg-gradient-to-br from-[#203947] via-[#901b20] to-[#203947]">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Icon */}
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
            <svg 
              className="h-8 w-8 text-red-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 18.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          
          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Access Denied
          </h1>
          
          {/* Message */}
          <p className="text-gray-600 mb-6">
            You don't have permission to access this page. 
            {user && (
              <span className="block mt-2 text-sm">
                Current role: <span className="font-medium text-gray-900">{user.role}</span>
              </span>
            )}
          </p>
          
          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={() => navigate(-1)}
              className="w-full bg-[#901b20] text-white py-2 px-4 rounded-md hover:bg-[#7a1419] transition-colors duration-200"
            >
              Go Back
            </button>
            
            <Link
              to="/"
              className="block w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors duration-200"
            >
              Go to Home
            </Link>
          </div>
          
          {/* Contact Info */}
          <p className="text-xs text-gray-500 mt-6">
            If you believe this is an error, please contact your administrator.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
