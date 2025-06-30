// src/features/student/components/profile/edit/AwardsManagement.jsx

import React, { useState, useEffect } from 'react';
import Modal from '../../../../../components/UI/Modal';
import Alert from '../../../../../components/UI/Alert';
import AwardsSection from './AwardsSection.jsx';
import AwardForm from './AwardForm.jsx';
import { addAward, updateAward, deleteAward, updateAwardImage } from '../../../../../services/awardsService';

function AwardsManagement({ awards = [], onUpdateAwards, showNotifications = true }) {
  const [currentAwards, setCurrentAwards] = useState(awards || []);
  
  // Modal state
  const [showAwardModal, setShowAwardModal] = useState(false);
  const [editingAward, setEditingAward] = useState(null);
  
  // Notification state - only show if enabled
  const [notification, setNotification] = useState({ 
    show: false, 
    type: 'info', 
    message: '' 
  });

  // Sync data from props to internal state
  useEffect(() => {
    setCurrentAwards(awards || []);
  }, [awards]);

  // Helper function to show notifications
  const showNotification = (message, type = 'success') => {
    if (showNotifications) {
      setNotification({ show: true, type, message });
    }
  };

  const hideNotification = () => {
    setNotification({ show: false, type: 'info', message: '' });
  };

  // Award Modal Handlers
  const handleAddAward = () => {
    setEditingAward(null);
    setShowAwardModal(true);
  };

  const handleEditAward = (award) => {
    setEditingAward(award);
    setShowAwardModal(true);
  };

  const handleAwardSubmit = async (formData) => {
    try {
      let result;
      
      if (editingAward) {
        // Update existing award
        result = await updateAward(editingAward.id, formData);
        
        if (result.success) {
          // Map backend response to frontend format
          const mappedData = {
            id: result.data.id,
            title: result.data.title,
            description: result.data.description,
            organization: result.data.organization,
            achieved_at: result.data.achieved_at,
            certificate_url: result.data.certificate_url,
            image_path: result.data.image_path,
            imagePath: result.data.image_path ? `http://127.0.0.1:8000/storage/${result.data.image_path}` : null,
            created_at: result.data.created_at,
            updated_at: result.data.updated_at
          };
          
          const updatedAwards = currentAwards.map(award => 
            award.id === editingAward.id ? mappedData : award
          );
          setCurrentAwards(updatedAwards);
          onUpdateAwards(updatedAwards);
          
          // Only show success message if notifications are enabled
          showNotification('Award updated successfully!', 'success');
        }
      } else {
        // Add new award
        result = await addAward(formData);
        
        if (result.success) {
          // Map backend response to frontend format
          const mappedData = {
            id: result.data.id,
            title: result.data.title,
            description: result.data.description,
            organization: result.data.organization,
            achieved_at: result.data.achieved_at,
            certificate_url: result.data.certificate_url,
            image_path: result.data.image_path,
            imagePath: result.data.image_path ? `http://127.0.0.1:8000/storage/${result.data.image_path}` : null,
            created_at: result.data.created_at,
            updated_at: result.data.updated_at
          };
          
          const updatedAwards = [...currentAwards, mappedData];
          setCurrentAwards(updatedAwards);
          onUpdateAwards(updatedAwards);
          
          // Only show success message if notifications are enabled
          showNotification('🎉 Award added successfully! Your achievement has been saved.', 'success');
        }
      }
      
      // Close modal on success
      setShowAwardModal(false);
      setEditingAward(null);
      
    } catch (error) {
      console.error('Error saving award:', error);
      showNotification(`Error saving award: ${error.message}`, 'error');
    }
  };

  const handleAwardDelete = async (idToDelete) => {
    // Show confirmation dialog
    const confirmDelete = window.confirm('Are you sure you want to delete this award?');
    
    if (!confirmDelete) {
      return;
    }

    try {
      const result = await deleteAward(idToDelete);
      
      if (result.success) {
        const updatedAwards = currentAwards.filter(award => award.id !== idToDelete);
        setCurrentAwards(updatedAwards);
        onUpdateAwards(updatedAwards);
        showNotification('Award deleted successfully!', 'success');
      }
    } catch (error) {
      console.error('Error deleting award:', error);
      showNotification(`Error deleting award: ${error.message}`, 'error');
    }
  };

  const handleCloseAwardModal = () => {
    setShowAwardModal(false);
    setEditingAward(null);
  };

  const handleImageUpdate = async (awardId, imageFile) => {
    try {
      const result = await updateAwardImage(awardId, imageFile);
      
      if (result.success) {
        // Update the award with the new image path
        const updatedAwards = currentAwards.map(award => 
          award.id === awardId 
            ? { 
                ...award, 
                image_path: result.data.image_path,
                imagePath: result.data.image_path ? `http://127.0.0.1:8000/storage/${result.data.image_path}` : null,
                updated_at: result.data.updated_at
              }
            : award
        );
        
        setCurrentAwards(updatedAwards);
        onUpdateAwards(updatedAwards);
        showNotification('Award image updated successfully!', 'success');
      }
    } catch (error) {
      console.error('Error updating award image:', error);
      showNotification(`Error updating award image: ${error.message}`, 'error');
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
      
      {/* Awards Section */}
      <AwardsSection
        awards={currentAwards}
        onAdd={handleAddAward}
        onEdit={handleEditAward}
        onDelete={handleAwardDelete}
        onImageUpdate={handleImageUpdate}
      />

      {/* Award Modal */}
      <Modal
        isOpen={showAwardModal}
        onClose={handleCloseAwardModal}
        title={editingAward ? 'Edit Award' : 'Add New Award'}
        className="max-w-2xl"
      >
        <AwardForm
          onSubmit={handleAwardSubmit}
          initialData={editingAward}
        />
      </Modal>
    </>
  );
}

export default AwardsManagement;
