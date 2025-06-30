// src/features/student/components/profile/edit/SkillsManagement.jsx

import React, { useState, useEffect } from 'react';
import { addUserSkill, deleteUserSkill } from '../../../../../services/profileService';

function SkillTag({ skill, onRemove }) {
  return (
    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
      {skill.name}
      <button
        type="button"
        onClick={() => onRemove(skill.id)}
        className="ml-2 -mr-0.5 h-4 w-4 flex-shrink-0 rounded-full inline-flex items-center justify-center text-red-600 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
      >
        <span className="sr-only">Remove skill</span>
        <svg className="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M1 1l6 6m0-6L1 7" />
        </svg>
      </button>
    </span>
  );
}

function SkillsManagement({ skills = [], onUpdateSkills }) {
  const [currentSkills, setCurrentSkills] = useState(skills || []);
  const [newSkillInput, setNewSkillInput] = useState('');

  // Sync data from props to internal state
  useEffect(() => {
    setCurrentSkills(skills || []);
  }, [skills]);

  // Skills Handlers
  const handleAddSkill = async () => {
    const trimmedInput = newSkillInput.trim();
    if (!trimmedInput) {
      return;
    }

    // Check if skill already exists (case-insensitive)
    if (currentSkills.some(s => s.name.toLowerCase() === trimmedInput.toLowerCase())) {
      alert('This skill is already added to your profile.');
      return;
    }

    try {
      const result = await addUserSkill(trimmedInput);
      
      if (result.success) {
        // Create new skill object with API response data
        const newSkill = {
          id: result.data.skill.id,          // Use the skill ID, not the relationship ID
          name: result.data.skill.name,
          skill_id: result.data.skill_id,
          relationship_id: result.data.id,   // Store the relationship ID for reference
          level: 'Intermediate' // Default level, can be customized later
        };
        
        const updatedSkills = [...currentSkills, newSkill];
        setCurrentSkills(updatedSkills);
        onUpdateSkills(updatedSkills);
        setNewSkillInput('');
        
        // Show success message
        alert('Skill added successfully!');
      } else {
        throw new Error('Failed to add skill');
      }
    } catch (error) {
      console.error('Error adding skill:', error);
      alert(`Error adding skill: ${error.message}`);
    }
  };

  const handleRemoveSkill = async (skillIdToRemove) => {
    // Show confirmation dialog
    const confirmDelete = window.confirm('Are you sure you want to remove this skill from your profile?');
    
    if (!confirmDelete) {
      return;
    }

    try {
      // Use the skill ID for the API call (not the relationship ID)
      const result = await deleteUserSkill(skillIdToRemove);
      
      if (result.success) {
        // Remove the skill from local state using the skill ID
        const updatedSkills = currentSkills.filter(skill => skill.id !== skillIdToRemove);
        setCurrentSkills(updatedSkills);
        onUpdateSkills(updatedSkills);
        
        // Show success message
        alert('Skill removed successfully!');
      } else {
        throw new Error('Failed to remove skill');
      }
    } catch (error) {
      console.error('Error removing skill:', error);
      alert(`Error removing skill: ${error.message}`);
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Manage Your Skills</h2>
      <p className="text-gray-600 text-sm mb-4">Add or remove technologies you're proficient in.</p>
      
      {/* Current Skills Display */}
      <div className="flex flex-wrap gap-2 mb-4">
        {currentSkills.map(skill => (
          <SkillTag key={skill.id} skill={skill} onRemove={handleRemoveSkill} />
        ))}
      </div>

      {/* Add New Skill Input */}
      <div className="flex items-center space-x-2">
        <input
          type="text"
          value={newSkillInput}
          onChange={(e) => setNewSkillInput(e.target.value)}
          onKeyPress={(e) => {
              if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddSkill();
              }
          }}
          className="flex-grow border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="e.g., React.js, Node.js, Tailwind CSS"
        />
        <button
          type="button"
          onClick={handleAddSkill}
          className="inline-flex items-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
          Add Skill
        </button>
      </div>
    </div>
  );
}

export default SkillsManagement;
