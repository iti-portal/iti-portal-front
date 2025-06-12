// src/features/Student/Profile/components/SkillItem.js
import React from 'react';

// You can use simple icons based on skill type if desired
function SkillItem({ skill }) {
  // Can use switch case or object mapping if you have icons for each proficiency
  const proficiencyColor = {
    beginner: 'bg-red-100 text-red-800',
    intermediate: 'bg-yellow-100 text-yellow-800',
    advanced: 'bg-green-100 text-green-800',
    expert: 'bg-blue-100 text-blue-800',
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium 
        ${proficiencyColor[skill.proficiency] || 'bg-gray-100 text-gray-800'}`}
    >
      {skill.name}
      {/* <span className="ml-2 text-xs opacity-75">({skill.proficiency})</span> */}
    </span>
  );
}

export default SkillItem;