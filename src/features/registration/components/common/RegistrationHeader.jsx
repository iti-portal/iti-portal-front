import React from 'react';

/**
 * Registration header component
 * Provides consistent header for registration pages
 */
const RegistrationHeader = ({ 
  title = "Let's get you started with an ITI Portal account",
  subtitle,
  className = '',
  titleClassName = '',
  subtitleClassName = ''
}) => {
  return (
    <div className={`text-center space-y-2 ${className}`}>
      <h1 className={`text-2xl font-bold text-gray-900 ${titleClassName}`}>
        {title}
      </h1>
      
      {subtitle && (
        <p className={`text-sm text-gray-600 max-w-md mx-auto ${subtitleClassName}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default RegistrationHeader;
