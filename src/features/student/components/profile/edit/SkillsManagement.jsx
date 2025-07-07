// src/features/student/components/profile/edit/SkillsManagement.jsx

import React, { useState, useEffect } from 'react';
import Alert from '../../../../../components/UI/Alert';
import { addUserSkill, deleteUserSkill, getAllSkills } from '../../../../../services/skillsService';

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

function SkillsManagement({ 
  skills = [], 
  onUpdateSkills, 
  showNotifications = true,
  onShowNotification,
  onShowConfirmation,
  onHideConfirmation
}) {
  const [currentSkills, setCurrentSkills] = useState(skills || []);
  const [newSkillInput, setNewSkillInput] = useState('');
  const [availableSkills, setAvailableSkills] = useState([]);
  const [filteredSkills, setFilteredSkills] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loadingSkills, setLoadingSkills] = useState(false);
  
  // Notification state
  const [notification, setNotification] = useState({ 
    show: false, 
    type: 'info', 
    message: '' 
  });

  // Sync data from props to internal state
  useEffect(() => {
    setCurrentSkills(skills || []);
  }, [skills]);

  // Fetch all available skills on component mount
  useEffect(() => {
    const fetchAllSkills = async () => {
      try {
        setLoadingSkills(true);
        const response = await getAllSkills();
        if (response?.data) {
          setAvailableSkills(response.data);
        }
      } catch (error) {
        console.error('Error fetching skills:', error);
      } finally {
        setLoadingSkills(false);
      }
    };

    fetchAllSkills();
  }, []);

  // Filter skills based on input
  useEffect(() => {
    if (newSkillInput.trim() && availableSkills.length > 0) {
      const filtered = availableSkills.filter(skill =>
        skill.name.toLowerCase().includes(newSkillInput.toLowerCase()) &&
        !currentSkills.some(currentSkill => currentSkill.name.toLowerCase() === skill.name.toLowerCase())
      );
      setFilteredSkills(filtered);
      setShowDropdown(filtered.length > 0);
    } else {
      setFilteredSkills([]);
      setShowDropdown(false);
    }
  }, [newSkillInput, availableSkills, currentSkills]);

  // Helper function to show notifications
  const showNotification = (message, type = 'success') => {
    if (showNotifications) {
      setNotification({ show: true, type, message });
    } else {
      // Fallback to alert for now if notifications are disabled
      alert(message);
    }
  };

  const hideNotification = () => {
    setNotification({ show: false, type: 'info', message: '' });
  };

  // Skills Handlers
  const handleSkillSelect = async (selectedSkill) => {
    try {
      const result = await addUserSkill(selectedSkill.name);
      
      if (result.success) {
        // Create new skill object with API response data
        const newSkill = {
          id: result.data.skill.id,
          name: result.data.skill.name,
          skill_id: result.data.skill_id,
          relationship_id: result.data.id,
          level: 'Intermediate'
        };
        
        const updatedSkills = [...currentSkills, newSkill];
        setCurrentSkills(updatedSkills);
        onUpdateSkills(updatedSkills);
        setNewSkillInput('');
        setShowDropdown(false);
        
        showNotification('Skill added successfully!', 'success');
      } else {
        throw new Error('Failed to add skill');
      }
    } catch (error) {
      console.error('Error adding skill:', error);
      showNotification(`Error adding skill: ${error.message}`, 'error');
    }
  };

  const handleAddSkill = async () => {
    const trimmedInput = newSkillInput.trim();
    if (!trimmedInput) {
      return;
    }

    // Check if skill already exists (case-insensitive)
    if (currentSkills.some(s => s.name.toLowerCase() === trimmedInput.toLowerCase())) {
      showNotification('This skill is already added to your profile.', 'warning');
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
        showNotification('Skill added successfully!', 'success');
      } else {
        throw new Error('Failed to add skill');
      }
    } catch (error) {
      console.error('Error adding skill:', error);
      showNotification(`Error adding skill: ${error.message}`, 'error');
    }
  };

  const handleRemoveSkill = async (skillIdToRemove) => {
    // Use parent confirmation system if available
    if (onShowConfirmation && typeof onShowConfirmation === 'function') {
      onShowConfirmation(
        'Remove Skill',
        'Are you sure you want to remove this skill from your profile?',
        async () => {
          try {
            // Use the skill ID for the API call (not the relationship ID)
            const result = await deleteUserSkill(skillIdToRemove);
            
            if (result.success) {
              // Remove the skill from local state using the skill ID
              const updatedSkills = currentSkills.filter(skill => skill.id !== skillIdToRemove);
              setCurrentSkills(updatedSkills);
              onUpdateSkills(updatedSkills);
              
              showNotification('Skill removed successfully!', 'success');
            } else {
              throw new Error('Failed to remove skill');
            }
          } catch (error) {
            console.error('Error removing skill:', error);
            showNotification(`Error removing skill: ${error.message}`, 'error');
          } finally {
            // Always hide confirmation modal
            if (onHideConfirmation && typeof onHideConfirmation === 'function') {
              onHideConfirmation();
            }
          }
        },
        'danger'
      );
    } else {
      // If no confirmation system is available, show error
      showNotification('Cannot remove skill: confirmation system not available.', 'error');
    }
  };

  return (
    <>
      {/* Notification - only show if notifications are enabled */}
      {showNotifications && (
        <Alert
          show={notification.show}
          type={notification.type}
          message={notification.message}
          onClose={hideNotification}
        />
      )}
      
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
      <div className="relative">
        <div className="flex items-center space-x-2">
          <div className="flex-grow relative">
            <input
              type="text"
              value={newSkillInput}
              onChange={(e) => setNewSkillInput(e.target.value)}
              onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                      e.preventDefault();
                      if (filteredSkills.length > 0) {
                        handleSkillSelect(filteredSkills[0]);
                      } else {
                        handleAddSkill();
                      }
                  }
              }}
              onFocus={() => {
                if (filteredSkills.length > 0) {
                  setShowDropdown(true);
                }
              }}
              onBlur={() => {
                // Delay hiding dropdown to allow clicking on dropdown items
                setTimeout(() => setShowDropdown(false), 200);
              }}
              className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="e.g., React.js, Node.js, Tailwind CSS"
            />
            
            {/* Skills Dropdown */}
            {showDropdown && filteredSkills.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                {filteredSkills.map((skill) => (
                  <div
                    key={skill.id}
                    onClick={() => handleSkillSelect(skill)}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm border-b border-gray-100 last:border-b-0"
                  >
                    {skill.name}
                  </div>
                ))}
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={handleAddSkill}
            className="inline-flex items-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
            Add Skill
          </button>
        </div>
        
        {/* Loading indicator */}
        {loadingSkills && (
          <div className="text-sm text-gray-500 mt-2">
            Loading available skills...
          </div>
        )}
      </div>
    </div>
    </>
  );
}

export default SkillsManagement;
