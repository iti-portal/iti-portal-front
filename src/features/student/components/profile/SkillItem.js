// src/features/student/components/profile/SkillItem.js
import React from 'react';
import { motion } from 'framer-motion';

// You can use simple icons based on skill type if desired
function SkillItem({ skill }) {
  // Can use switch case or object mapping if you have icons for each proficiency
  const proficiencyStyles = {
    beginner: 'bg-gradient-to-r from-red-100 to-red-200 text-red-800 border-red-300',
    intermediate: 'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border-yellow-300',
    advanced: 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 border-green-300',
    expert: 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border-blue-300',
  };

  const proficiencyIcons = {
    beginner: '⭐',
    intermediate: '⭐⭐',
    advanced: '⭐⭐⭐',
    expert: '🏆',
  };

  return (
    <motion.span
      className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold border shadow-sm cursor-default
        ${proficiencyStyles[skill.proficiency] || 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border-gray-300'}`}
      whileHover={{ 
        scale: 1.1, 
        boxShadow: "0 8px 20px rgba(0, 0, 0, 0.15)",
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ 
        duration: 0.3,
        ease: "easeOut"
      }}
    >
      <span className="mr-2 text-xs">{proficiencyIcons[skill.proficiency] || '📋'}</span>
      {skill.name}
      <motion.span 
        className="ml-2 text-xs opacity-70 font-medium"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ delay: 0.2 }}
      >
        {skill.proficiency}
      </motion.span>
    </motion.span>
  );
}

export default SkillItem;
