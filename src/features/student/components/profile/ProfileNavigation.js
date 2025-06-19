// src/features/student/components/profile/ProfileNavigation.js
import React from 'react';
import { motion } from 'framer-motion';

function ProfileNavigation({ activeTab, onTabChange }) {
  const tabs = [
    { name: 'overview', label: 'Overview' },
    { name: 'education-experience', label: 'Education & Experience' },
    { name: 'skills-certificates', label: 'Skills & Certificates' },
    { name: 'projects-portfolio', label: 'Projects & Portfolio' },
  ];

  return (
    <motion.div 
      className="bg-white rounded-xl shadow-lg p-4 mb-8 border border-gray-100"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex space-x-2 justify-center items-center text-base overflow-x-auto no-scrollbar">
        {tabs.map((tab) => (
          <motion.button
            key={tab.name}
            onClick={() => onTabChange(tab.name)}
            className={`relative px-6 py-3 rounded-lg font-semibold transition-all duration-300 ease-in-out whitespace-nowrap
              ${activeTab === tab.name
                ? 'text-white shadow-lg' 
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >            {activeTab === tab.name && (              <motion.div
                className="absolute inset-0 bg-iti-gradient rounded-lg"
                layoutId="activeTab"
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30
                }}
              />
            )}
            <span className="relative z-10">{tab.label}</span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}

export default ProfileNavigation;
