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
    <div className={`text-center space-y-3 ${className}`}>
      <h1 className={`text-3xl md:text-4xl font-bold text-white leading-tight ${titleClassName}`}>
        {title}
      </h1>
      
      {subtitle && (
        <p className={`text-base text-white/80 max-w-md mx-auto leading-relaxed ${subtitleClassName}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default RegistrationHeader;
