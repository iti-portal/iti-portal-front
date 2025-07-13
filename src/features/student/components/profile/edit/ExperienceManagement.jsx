// src/features/student/components/profile/edit/ExperienceManagement.jsx

import React, { useState, useEffect } from 'react';
import Modal from '../../../../../components/UI/Modal';
import Alert from '../../../../../components/UI/Alert';
import ExperienceSection from './ExperienceSection.jsx';
import ExperienceForm from './ExperienceForm.jsx';
import { addWorkExperience, updateWorkExperience, deleteWorkExperience } from '../../../../../services/workExperienceService';

function ExperienceManagement({ 
  workExperiences = [], 
  onUpdateExperiences, 
  showNotifications = true,
  onShowNotification,
  onShowConfirmation,
  onHideConfirmation 
}) {
  const [currentExperiences, setCurrentExperiences] = useState(workExperiences || []);
  
  // Modal state
  const [showExperienceModal, setShowExperienceModal] = useState(false);
  const [editingExperience, setEditingExperience] = useState(null);
  
  // Notification state (fallback if parent doesn't provide notification system)
  const [notification, setNotification] = useState({ 
    show: false, 
    type: 'info', 
    message: '' 
  });

  // Sync data from props to internal state
  useEffect(() => {
    setCurrentExperiences(workExperiences || []);
  }, [workExperiences]);

  // Helper function to show notifications
  const showNotification = (message, type = 'success') => {
    if (showNotifications) {
      // Use parent notification system if available, otherwise fallback to local
      if (onShowNotification && typeof onShowNotification === 'function') {
        onShowNotification(message, type);
      } else {
        setNotification({ show: true, type, message });
      }
    }
  };

  const hideNotification = () => {
    setNotification({ show: false, type: 'info', message: '' });
  };

  // Experience Modal Handlers
  const handleAddExperience = () => {
    setEditingExperience(null);
    setShowExperienceModal(true);
  };

  const handleEditExperience = (experience) => {
    setEditingExperience(experience);
    setShowExperienceModal(true);
  };

  const handleExperienceSubmit = async (formData) => {
    try {
      console.log('handleExperienceSubmit called with data:', formData);
      let result;
      
      if (editingExperience) {
        // Update existing experience
        console.log('Updating experience:', editingExperience.id);
        result = await updateWorkExperience(editingExperience.id, formData);
        
        if (result.success) {
          // Map backend response to frontend format
          const mappedData = {
            id: result.data.id,
            companyName: result.data.company_name,
            position: result.data.position,
            startDate: result.data.start_date,
            endDate: result.data.end_date,
            isCurrent: result.data.is_current,
            description: result.data.description,
            createdAt: result.data.created_at,
            updatedAt: result.data.updated_at,
            // Keep original fields for compatibility
            company_name: result.data.company_name,
            start_date: result.data.start_date,
            end_date: result.data.end_date,
            is_current: result.data.is_current,
            created_at: result.data.created_at,
            updated_at: result.data.updated_at
          };
          
          const updatedExperiences = currentExperiences.map(exp => 
            exp.id === editingExperience.id ? mappedData : exp
          );
          setCurrentExperiences(updatedExperiences);
          
          // Call parent update function safely
          if (onUpdateExperiences && typeof onUpdateExperiences === 'function') {
            onUpdateExperiences(updatedExperiences);
          }
          
          // Only show success message if notifications are enabled
          showNotification('Work experience updated successfully!', 'success');
        }
      } else {
        // Add new experience
        console.log('Adding new experience');
        result = await addWorkExperience(formData);
        
        if (result.success) {
          // Map backend response to frontend format
          const mappedData = {
            id: result.data.id,
            companyName: result.data.company_name,
            position: result.data.position,
            startDate: result.data.start_date,
            endDate: result.data.end_date,
            isCurrent: result.data.is_current,
            description: result.data.description,
            createdAt: result.data.created_at,
            updatedAt: result.data.updated_at,
            // Keep original fields for compatibility
            company_name: result.data.company_name,
            start_date: result.data.start_date,
            end_date: result.data.end_date,
            is_current: result.data.is_current,
            created_at: result.data.created_at,
            updated_at: result.data.updated_at
          };
          
          const updatedExperiences = [...currentExperiences, mappedData];
          setCurrentExperiences(updatedExperiences);
          
          // Call parent update function safely
          if (onUpdateExperiences && typeof onUpdateExperiences === 'function') {
            onUpdateExperiences(updatedExperiences);
          }
          
          // Only show success message if notifications are enabled
          showNotification('🎉 Work experience added successfully! Your experience has been saved.', 'success');
        }
      }
      
      // Close modal on success
      setShowExperienceModal(false);
      setEditingExperience(null);
      console.log('Experience operation completed successfully');
      
    } catch (error) {
      console.error('Error saving work experience:', error);
      showNotification(`Error saving work experience: ${error.message}`, 'error');
    }
  };

  const handleExperienceDelete = async (idToDelete) => {
    console.log('handleExperienceDelete called with ID:', idToDelete);
    
    // Use parent confirmation system if available, otherwise fallback to window.confirm
    if (onShowConfirmation && typeof onShowConfirmation === 'function') {
      onShowConfirmation(
        'Delete Work Experience',
        'Are you sure you want to delete this work experience? This action cannot be undone.',
        async () => {
          try {
            console.log('Confirmation accepted, attempting to delete experience with ID:', idToDelete);
            const result = await deleteWorkExperience(idToDelete);
            console.log('Delete result:', result);
            
            if (result.success) {
              const updatedExperiences = currentExperiences.filter(exp => exp.id !== idToDelete);
              console.log('Updated experiences:', updatedExperiences);
              
              setCurrentExperiences(updatedExperiences);
              
              // Call parent update function safely
              if (onUpdateExperiences && typeof onUpdateExperiences === 'function') {
                onUpdateExperiences(updatedExperiences);
              }
              
              showNotification('Work experience deleted successfully!', 'success');
              console.log('Experience deleted successfully');
            } else {
              throw new Error(result.message || 'Failed to delete work experience');
            }
          } catch (error) {
            console.error('Error deleting work experience:', error);
            showNotification(`Error deleting work experience: ${error.message}`, 'error');
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
      showNotification('Cannot delete experience: confirmation system not available.', 'error');
    }
  };

  const handleCloseExperienceModal = () => {
    setShowExperienceModal(false);
    setEditingExperience(null);
  };

  return (
    <>
      {/* Notification - only show local fallback if parent doesn't provide notification system */}
      {showNotifications && !onShowNotification && (
        <Alert
          show={notification.show}
          type={notification.type}
          message={notification.message}
          onClose={hideNotification}
        />
      )}
      
      {/* Experience Section */}
      <ExperienceSection
        workExperiences={currentExperiences}
        onAdd={handleAddExperience}
        onEdit={handleEditExperience}
        onDelete={handleExperienceDelete}
      />

      {/* Experience Modal */}
      <Modal
        isOpen={showExperienceModal}
        onClose={handleCloseExperienceModal}
        title={editingExperience ? 'Edit Work Experience' : 'Add New Work Experience'}
        className="w-full max-w-3xl"
      >
        <ExperienceForm
          onSubmit={handleExperienceSubmit}
          initialData={editingExperience}
        />
      </Modal>
    </>
  );
}

export default ExperienceManagement;
