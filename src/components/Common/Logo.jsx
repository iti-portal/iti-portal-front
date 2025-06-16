import React from 'react';
import logo from '../../assets/logo.png';

const Logo = ({ 
  size = 'medium', 
  className = '', 
  center = true,
  marginBottom = true 
}) => {
  // Size variations
  const sizeClasses = {
    small: 'h-8',
    medium: 'h-12',
    large: 'h-16',
    xl: 'h-20'
  };

  // Build className dynamically
  const baseClasses = [
    'w-auto',
    sizeClasses[size] || sizeClasses.medium,
    center && 'mx-auto',
    marginBottom && 'mb-3',
    className
  ].filter(Boolean).join(' ');

  return (
    <img 
      src={logo} 
      alt="ITI Portal Logo" 
      className={baseClasses}
    />
  );
};

export default Logo;
