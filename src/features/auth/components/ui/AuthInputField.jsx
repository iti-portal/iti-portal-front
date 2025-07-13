import React from 'react';
import { motion } from 'framer-motion';

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

/**
 * Auth Input Field Component
 * Reusable input field for auth forms
 */
const AuthInputField = ({
  id,
  name,
  type = 'text',
  label,
  placeholder,
  value,
  onChange,
  error,
  required = false,
  autoComplete,
  className = ''
}) => {
  return (
    <motion.div variants={itemVariants} className="space-y-1">
      <label 
        className="block text-gray-700 mb-2 font-medium text-sm" 
        htmlFor={id}
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      <input
        id={id}
        name={name}
        type={type}
        autoComplete={autoComplete}
        required={required}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#901b20]/20 focus:border-[#901b20] transition-all duration-200 text-sm ${error ? 'border-red-300 focus:ring-red-200' : ''} ${className}`}
      />
      
      {error && (
        <p className="text-red-500 text-xs mt-1.5">{error}</p>
      )}
    </motion.div>
  );
};

export default AuthInputField;
