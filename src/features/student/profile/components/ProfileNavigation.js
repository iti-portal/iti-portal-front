// src/features/Student/Profile/components/ProfileNavigation.js
import React from 'react';

function ProfileNavigation({ activeTab, onTabChange }) {
  const tabs = [
    { name: 'overview', label: 'Overview' },
    { name: 'education-experience', label: 'Education & Experience' },
    { name: 'skills-certificates', label: 'Skills & Certificates' },
    { name: 'projects-portfolio', label: 'Projects & Portfolio' },
  ];

  return (
    
    <div className="bg-gray-50 rounded-lg shadow-lg p-3 mb-6 flex space-x-12 justify-center items-center text-base overflow-x-auto no-scrollbarmx-auto"> 
      {tabs.map((tab) => (
        <button
          key={tab.name}
          onClick={() => onTabChange(tab.name)}
          className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ease-in-out whitespace-nowrap
            ${activeTab === tab.name
              ? 'bg-white text-gray-800 shadow-md border border-gray-300' 
              : 'text-gray-600 hover:bg-gray-100'
            }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

export default ProfileNavigation;