// src/features/student/components/profile/edit/TabNavigation.js

import React from 'react';
import { motion } from 'framer-motion';
import { FaGraduationCap, FaBriefcase } from 'react-icons/fa';

function TabNavigation({ activeTab, onTabChange }) {
  const tabs = [
    { id: 'education', name: 'Education', icon: FaGraduationCap },
    { id: 'experience', name: 'Experience', icon: FaBriefcase }
  ];

  return (
    <div className="border-b border-gray-200 mb-6">
      <nav className="-mb-px flex space-x-8" aria-label="Tabs">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <motion.button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`relative flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-[#901b20] text-[#901b20]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Icon size={16} />
              {tab.name}
              {activeTab === tab.id && (
                <motion.div
                  className="absolute inset-0 border-b-2 border-[#901b20]"
                  layoutId="activeTab"
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30
                  }}
                />
              )}
            </motion.button>
          );
        })}
      </nav>
    </div>
  );
}

export default TabNavigation;
