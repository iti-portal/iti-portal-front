// src/features/student/components/profile/edit/EducationAndExperienceForm.js

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Modal from '../../../../../components/UI/Modal';
import EducationForm from './EducationForm';
import ExperienceForm from './ExperienceForm';
import EducationSection from './EducationSection';
import ExperienceSection from './ExperienceSection';
import TabNavigation from './TabNavigation';
import { generateUniqueId } from '../../../utils/idGenerator';
import { addEducation, updateEducation, deleteEducation } from '../../../../../services/profileService';

function EducationAndExperienceForm({ educations = [], workExperiences = [], onUpdateEducations, onUpdateWorkExperiences }) {
  const [activeTab, setActiveTab] = useState('education');
  const [isEducationModalOpen, setIsEducationModalOpen] = useState(false);
  const [isExperienceModalOpen, setIsExperienceModalOpen] = useState(false);
  const [editingEducation, setEditingEducation] = useState(null);
  const [editingExperience, setEditingExperience] = useState(null);
  
  // Education handlers
  const openAddEducationModal = () => {
    setEditingEducation(null);
    setIsEducationModalOpen(true);
  };
  
  const openEditEducationModal = (education) => {
    setEditingEducation(education);
    setIsEducationModalOpen(true);
  };
  
  const handleAddEducation = async (educationData) => {
    try {
      // Prepare data for API call - map to backend field names
      const apiData = {
        institution: educationData.institution,
        degree: educationData.degree,
        field_of_study: educationData.fieldOfStudy,
        start_date: educationData.startDate,
        end_date: educationData.endDate,
        description: educationData.description || ''
      };

      const result = await addEducation(apiData);
      
      if (result.success) {
        // Add the new education with the API response data to local state
        const newEducation = {
          id: result.data.id,
          institution: result.data.institution,
          degree: result.data.degree,
          fieldOfStudy: result.data.field_of_study,
          startDate: result.data.start_date,
          endDate: result.data.end_date,
          description: result.data.description
        };
        
        // Add to the beginning of the array (top of the list)
        onUpdateEducations([newEducation, ...educations]);
        setIsEducationModalOpen(false);
        
        // Show success message
        alert('Education added successfully!');
      } else {
        throw new Error('Failed to add education');
      }
    } catch (error) {
      console.error('Error adding education:', error);
      alert(`Error adding education: ${error.message}`);
    }
  };
  
  const handleUpdateEducation = async (educationData) => {
    if (!editingEducation) return;
    
    try {
      // Prepare data for API call - map to backend field names
      const apiData = {
        institution: educationData.institution,
        degree: educationData.degree,
        field_of_study: educationData.fieldOfStudy,
        start_date: educationData.startDate,
        end_date: educationData.endDate,
        description: educationData.description || ''
      };

      const result = await updateEducation(editingEducation.id, apiData);
      
      if (result.success) {
        // Update the education with the API response data
        const updatedEducation = {
          id: result.data.id,
          institution: result.data.institution,
          degree: result.data.degree,
          fieldOfStudy: result.data.field_of_study,
          startDate: result.data.start_date,
          endDate: result.data.end_date,
          description: result.data.description
        };
        
        // Update the education in the list
        const updatedEducations = educations.map(edu => 
          edu.id === editingEducation.id ? updatedEducation : edu
        );
        
        onUpdateEducations(updatedEducations);
        setIsEducationModalOpen(false);
        setEditingEducation(null);
        
        // Show success message
        alert('Education updated successfully!');
      } else {
        throw new Error('Failed to update education');
      }
    } catch (error) {
      console.error('Error updating education:', error);
      alert(`Error updating education: ${error.message}`);
    }
  };
  
  const handleDeleteEducation = async (id) => {
    // Show confirmation dialog
    const confirmDelete = window.confirm('Are you sure you want to delete this education entry? This action cannot be undone.');
    
    if (!confirmDelete) {
      return;
    }

    try {
      const result = await deleteEducation(id);
      
      if (result.success) {
        // Remove the education from local state
        const updatedEducations = educations.filter(edu => edu.id !== id);
        onUpdateEducations(updatedEducations);
        
        // Show success message
        alert('Education deleted successfully!');
      } else {
        throw new Error('Failed to delete education');
      }
    } catch (error) {
      console.error('Error deleting education:', error);
      alert(`Error deleting education: ${error.message}`);
    }
  };
  
  // Experience handlers
  const openAddExperienceModal = () => {
    setEditingExperience(null);
    setIsExperienceModalOpen(true);
  };
  
  const openEditExperienceModal = (experience) => {
    setEditingExperience(experience);
    setIsExperienceModalOpen(true);
  };
  
  const handleAddExperience = (experienceData) => {
    const newExperience = {
      id: generateUniqueId(),
      ...experienceData
    };
    
    // Add to the beginning of the array (top of the list)
    onUpdateWorkExperiences([newExperience, ...workExperiences]);
    setIsExperienceModalOpen(false);
  };
  
  const handleUpdateExperience = (experienceData) => {
    if (!editingExperience) return;
    
    const updatedExperience = {
      ...editingExperience,
      ...experienceData
    };
    
    const updatedExperiences = workExperiences.map(exp => 
      exp.id === editingExperience.id ? updatedExperience : exp
    );
    
    onUpdateWorkExperiences(updatedExperiences);
    setIsExperienceModalOpen(false);
    setEditingExperience(null);
  };
    const handleDeleteExperience = (id) => {
    const updatedExperiences = workExperiences.filter(exp => exp.id !== id);
    onUpdateWorkExperiences(updatedExperiences);
  };
  
  return (
    <div className="space-y-6">
      <TabNavigation 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'education' ? (
            <EducationSection
              educations={educations}
              onAdd={openAddEducationModal}
              onEdit={openEditEducationModal}
              onDelete={handleDeleteEducation}
            />
          ) : (
            <ExperienceSection
              workExperiences={workExperiences}
              onAdd={openAddExperienceModal}
              onEdit={openEditExperienceModal}
              onDelete={handleDeleteExperience}
            />
          )}
        </motion.div>
      </AnimatePresence>      {/* Education Modal */}
      <Modal
        isOpen={isEducationModalOpen}
        onClose={() => {
          setIsEducationModalOpen(false);
          setEditingEducation(null);
        }}
        title={editingEducation ? "Edit Education" : "Add Education"}
      >
        <EducationForm
          key={editingEducation ? `edit-${editingEducation.id}` : 'add-education'}
          initialData={editingEducation}
          onSubmit={editingEducation ? handleUpdateEducation : handleAddEducation}
        />
      </Modal>

      {/* Experience Modal */}
      <Modal
        isOpen={isExperienceModalOpen}
        onClose={() => {
          setIsExperienceModalOpen(false);
          setEditingExperience(null);
        }}
        title={editingExperience ? "Edit Experience" : "Add Experience"}
      >
        <ExperienceForm
          key={editingExperience ? `edit-${editingExperience.id}` : 'add-experience'}
          initialData={editingExperience}
          onSubmit={editingExperience ? handleUpdateExperience : handleAddExperience}
        />
      </Modal>
    </div>
  );
}
export default EducationAndExperienceForm;
