// src/features/student/components/profile/edit/EducationAndExperienceForm.js

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Modal from '../../../../../components/UI/Modal';
import EducationForm from './EducationForm';
import EducationSection from './EducationSection';
import ExperienceManagement from './ExperienceManagement';
import TabNavigation from './TabNavigation';
import { generateUniqueId } from '../../../utils/idGenerator';
import { addEducation, updateEducation, deleteEducation } from '../../../../../services/educationService';

function EducationAndExperienceForm({ educations = [], workExperiences = [], onUpdateEducations, onUpdateWorkExperiences }) {
  const [activeTab, setActiveTab] = useState('education');
  const [isEducationModalOpen, setIsEducationModalOpen] = useState(false);
  const [editingEducation, setEditingEducation] = useState(null);
  
  // Notification state
  const [notification, setNotification] = useState(null);
  
  // Confirmation modal state
  const [confirmModal, setConfirmModal] = useState(null);

  // Show notification function
  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  // Dismiss notification function
  const dismissNotification = () => {
    setNotification(null);
  };

  // Show confirmation modal
  const showConfirmation = (title, message, onConfirm, type = 'danger') => {
    setConfirmModal({ title, message, onConfirm, type });
  };

  // Hide confirmation modal
  const hideConfirmation = () => {
    setConfirmModal(null);
  };
  
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
          fieldOfStudy: result.data.field_of_study, // Map from backend snake_case
          startDate: result.data.start_date, // Map from backend snake_case
          endDate: result.data.end_date, // Map from backend snake_case
          description: result.data.description
        };
        
        // Add to the beginning of the array (top of the list)
        onUpdateEducations([newEducation, ...educations]);
        setIsEducationModalOpen(false);
        
        // Show success message
        showNotification('Education added successfully!', 'success');
      } else {
        throw new Error('Failed to add education');
      }
    } catch (error) {
      console.error('Error adding education:', error);
      showNotification(`Error adding education: ${error.message}`, 'error');
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
          fieldOfStudy: result.data.field_of_study, // Map from backend snake_case
          startDate: result.data.start_date, // Map from backend snake_case
          endDate: result.data.end_date, // Map from backend snake_case
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
        showNotification('Education updated successfully!', 'success');
      } else {
        throw new Error('Failed to update education');
      }
    } catch (error) {
      console.error('Error updating education:', error);
      showNotification(`Error updating education: ${error.message}`, 'error');
    }
  };
  
  const handleDeleteEducation = async (id) => {
    console.log('handleDeleteEducation called with ID:', id);
    
    showConfirmation(
      'Delete Education Entry',
      'Are you sure you want to delete this education entry? This action cannot be undone.',
      async () => {
        try {
          console.log('Confirmation accepted, attempting to delete education with ID:', id);
          const result = await deleteEducation(id);
          console.log('Delete result:', result);
          
          if (result.success) {
            // Remove the education from local state
            const updatedEducations = educations.filter(edu => edu.id !== id);
            console.log('Updated educations:', updatedEducations);
            
            // Call parent update function
            if (onUpdateEducations && typeof onUpdateEducations === 'function') {
              onUpdateEducations(updatedEducations);
            }
            
            // Show success message
            showNotification('Education deleted successfully!', 'success');
            console.log('Education deleted successfully');
          } else {
            throw new Error(result.message || 'Failed to delete education');
          }
        } catch (error) {
          console.error('Error deleting education:', error);
          showNotification(`Error deleting education: ${error.message}`, 'error');
        } finally {
          // Always hide confirmation modal, regardless of success or failure
          hideConfirmation();
        }
      },
      'danger'
    );
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
            <ExperienceManagement
              workExperiences={workExperiences}
              onUpdateExperiences={onUpdateWorkExperiences}
              showNotifications={true}
              onShowNotification={showNotification}
              onShowConfirmation={showConfirmation}
              onHideConfirmation={hideConfirmation}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Education Modal */}
      <Modal
        isOpen={isEducationModalOpen}
        onClose={() => {
          setIsEducationModalOpen(false);
        }}
        title={editingEducation ? "Edit Education" : "Add Education"}
        className="max-w-2xl"
      >
        <EducationForm
          key={editingEducation ? `edit-${editingEducation.id}-${Date.now()}` : 'add-education'}
          initialData={editingEducation}
          onSubmit={editingEducation ? handleUpdateEducation : handleAddEducation}
        />
      </Modal>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {confirmModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              hideConfirmation();
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-xl shadow-2xl mx-4"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${
                    confirmModal.type === 'danger' 
                      ? 'bg-red-100' 
                      : confirmModal.type === 'warning'
                      ? 'bg-yellow-100'
                      : 'bg-blue-100'
                  }`}>
                    {confirmModal.type === 'danger' && (
                      <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    )}
                    {confirmModal.type === 'warning' && (
                      <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                    )}
                    {confirmModal.type === 'info' && (
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {confirmModal.title}
                    </h3>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {confirmModal.message}
                </p>
                
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      hideConfirmation();
                    }}
                    className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={async (e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (confirmModal.onConfirm) {
                        await confirmModal.onConfirm();
                      }
                      hideConfirmation();
                    }}
                    className={`px-4 py-2 text-white rounded-lg transition-colors focus:outline-none focus:ring-2 ${
                      confirmModal.type === 'danger'
                        ? 'bg-red-600 hover:bg-red-700 focus:ring-red-300'
                        : confirmModal.type === 'warning'
                        ? 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-300'
                        : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-300'
                    }`}
                  >
                    {confirmModal.type === 'danger' ? 'Delete' : 'Confirm'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, x: 300, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 300, scale: 0.9 }}
            className="fixed top-4 right-4 z-50 max-w-sm"
          >
            <div className={`p-4 rounded-lg shadow-lg border-l-4 ${
              notification.type === 'success' ? 'bg-green-50 border-green-400 text-green-800' :
              notification.type === 'error' ? 'bg-red-50 border-red-400 text-red-800' :
              notification.type === 'warning' ? 'bg-yellow-50 border-yellow-400 text-yellow-800' :
              'bg-blue-50 border-blue-400 text-blue-800'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="mr-3">
                    {notification.type === 'success' && (
                      <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                    {notification.type === 'error' && (
                      <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    )}
                    {notification.type === 'warning' && (
                      <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    )}
                    {notification.type === 'info' && (
                      <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <p className="text-sm font-medium">{notification.message}</p>
                </div>
                <button
                  onClick={dismissNotification}
                  className="ml-3 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
export default EducationAndExperienceForm;
