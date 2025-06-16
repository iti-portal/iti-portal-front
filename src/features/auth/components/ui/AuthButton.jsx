import React from 'react';
import { motion } from 'framer-motion';

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

/**
 * Auth Button Component
 * Reusable button for auth forms
 */
const AuthButton = ({
  type = 'button',
  onClick,
  children,
  loading = false,
  disabled = false,
  variant = 'primary',
  className = '',
  fullWidth = true
}) => {
  const baseClasses = 'py-2.5 rounded-md font-medium text-sm shadow-sm transition hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100';
  
  const variantClasses = {
    primary: 'text-white',
    secondary: 'text-[#901b20] border border-[#901b20] bg-white hover:bg-gray-50',
    link: 'text-[#901b20] hover:underline bg-transparent shadow-none hover:scale-100'
  };

  const widthClass = fullWidth ? 'w-full' : 'px-4';

  const buttonStyle = variant === 'primary' ? { backgroundColor: '#901b20' } : {};

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${variantClasses[variant]} ${widthClass} ${className}`}
      style={buttonStyle}
      variants={itemVariants}
      whileHover={{ scale: disabled || loading ? 1 : 1.05 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.95 }}
    >
      {loading ? (
        <div className="flex items-center justify-center">
          <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading...
        </div>
      ) : (
        children
      )}
    </motion.button>
  );
};

export default AuthButton;
