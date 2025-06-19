// src/features/student/components/profile/edit/TabNavigation.jsx

import React from 'react';
import { motion } from 'framer-motion';
import { FaGraduationCap, FaBriefcase } from 'react-icons/fa';

function TabNavigation({ activeTab, onTabChange }) {
  const tabs = [
    { 
      id: 'education', 
      label: 'Education', 
      icon: FaGraduationCap 
    },
    { 
      id: 'experience', 
      label: 'Work Experience', 
      icon: FaBriefcase 
    },
  ];

  return (
    <div className="flex justify-center mb-6">
      <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
        <div className="flex">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <motion.button
                key={tab.id}
                type="button"
                onClick={() => onTabChange(tab.id)}
                className={`flex-1 py-3 px-6 text-sm font-medium relative transition-colors duration-200 ${
                  activeTab === tab.id 
                    ? 'text-iti-primary bg-red-50' 
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}                whileHover={{ 
                  backgroundColor: activeTab === tab.id ? 'rgba(254, 242, 242, 1)' : 'rgba(243, 244, 246, 1)' 
                }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="flex items-center justify-center">
                  <Icon className="mr-2" />
                  {tab.label}
                </span>
                {activeTab === tab.id && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-iti-primary"
                    layoutId="activeFormTab"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default TabNavigation;
