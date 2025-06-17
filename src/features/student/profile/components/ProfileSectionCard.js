// src/features/Student/Profile/components/ProfileSectionCard.js
import React from 'react';
import { motion } from 'framer-motion';

function ProfileSectionCard({ title, children, className = '' }) {
  return (
    <motion.div 
      className={`bg-white rounded-xl shadow-lg hover:shadow-xl p-6 mb-6 border border-gray-100 transition-shadow duration-300 ${className}`}
      whileHover={{ 
        scale: 1.01,
        transition: { duration: 0.2 }
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {title && (
        <motion.h2 
          className="text-2xl font-bold mb-6 text-gray-800 border-b border-gray-200 pb-3"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <span className="relative">
            {title}
            <motion.div
              className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-red-600 to-red-400"
              initial={{ width: 0 }}
              animate={{ width: "60px" }}
              transition={{ duration: 0.8, delay: 0.3 }}
            />
          </span>
        </motion.h2>
      )}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
export default ProfileSectionCard;