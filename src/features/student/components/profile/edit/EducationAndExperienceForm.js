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
  
  const handleAddEducation = (educationData) => {
    const newEducation = {
      id: generateUniqueId(),
      ...educationData
    };
    
    // Add to the beginning of the array (top of the list)
    onUpdateEducations([newEducation, ...educations]);
    setIsEducationModalOpen(false);
  };
  
  const handleUpdateEducation = (educationData) => {
    if (!editingEducation) return;
    
    const updatedEducation = {
      ...editingEducation,
      ...educationData
    };
    
    const updatedEducations = educations.map(edu => 
      edu.id === editingEducation.id ? updatedEducation : edu
    );
    
    onUpdateEducations(updatedEducations);
    setIsEducationModalOpen(false);
    setEditingEducation(null);
  };
  
  const handleDeleteEducation = (id) => {
    const updatedEducations = educations.filter(edu => edu.id !== id);
    onUpdateEducations(updatedEducations);
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
