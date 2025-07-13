// src/features/student/components/profile/edit/AwardsManagement.jsx

import React, { useState, useEffect } from 'react';
import Modal from '../../../../../components/UI/Modal';
import Alert from '../../../../../components/UI/Alert';
import AwardsSection from './AwardsSection.jsx';
import AwardForm from './AwardForm.jsx';
import { addAward, updateAward, deleteAward, updateAwardImage, addAwardImage, deleteAwardImage, getUserAwards } from '../../../../../services/awardsService';
import { constructCertificateImageUrl } from '../../../../../services/apiConfig';

function AwardsManagement({ 
  awards = [], 
  onUpdateAwards, 
  showNotifications = true, 
  userId,
  onShowNotification,
  onShowConfirmation,
  onHideConfirmation 
}) {
  const [currentAwards, setCurrentAwards] = useState(awards || []);
  
  // Modal state
  const [showAwardModal, setShowAwardModal] = useState(false);
  const [editingAward, setEditingAward] = useState(null);
  
  // Notification state (fallback if parent doesn't provide notification system)
  const [notification, setNotification] = useState({ 
    show: false, 
    type: 'info', 
    message: '' 
  });

  // Fetch awards with images on component mount or when userId changes
  useEffect(() => {
    const fetchAwardsWithImages = async () => {
      if (userId) {
        try {
          const result = await getUserAwards(userId);
          if (result.success) {
            // The API should return award_images array for each award
            setCurrentAwards(result.data);
            onUpdateAwards(result.data);
          }
        } catch (error) {
          console.error('Error fetching awards with images:', error);
          // Fallback to props if API fails
          setCurrentAwards(awards || []);
        }
      } else {
        // Fallback to props if no userId
        setCurrentAwards(awards || []);
      }
    };

    fetchAwardsWithImages();
    // Note: Removed onUpdateAwards from dependency array to prevent infinite loop
  }, [userId]);

  // Sync data from props to internal state (backup)
  useEffect(() => {
    if (!userId) {
      setCurrentAwards(awards || []);
    }
  }, [awards, userId]);

  // Helper function to refresh awards after operations
  const refreshAwards = async () => {
    if (userId) {
      try {
        const result = await getUserAwards(userId);
        if (result.success) {
          // The API should return award_images array for each award
          setCurrentAwards(result.data);
          onUpdateAwards(result.data);
        } else {
          console.error('Failed to refresh awards:', result);
        }
      } catch (error) {
        console.error('Error refreshing awards:', error);
      }
    } else {
      console.warn('No userId provided for refreshing awards');
    }
  };

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
      console.log('handleAwardSubmit called with data:', formData);
      let result;
      
      if (editingAward) {
        // Update existing award
        console.log('Updating award:', editingAward.id);
        result = await updateAward(editingAward.id, formData);
        
        if (result.success) {
          // Update the specific award in local state instead of refreshing
          const updatedAwards = currentAwards.map(award => 
            award.id === editingAward.id 
              ? { 
                  ...award, 
                  ...result.data,
                  imagePath: result.data.image_path ? `http://127.0.0.1:8000/storage/${result.data.image_path}` : award.imagePath,
                  imageUrl: result.data.imageUrl || award.imageUrl
                }
              : award
          );
          
          setCurrentAwards(updatedAwards);
          
          // Call parent update function safely
          if (onUpdateAwards && typeof onUpdateAwards === 'function') {
            onUpdateAwards(updatedAwards);
          }
          
          showNotification('Award updated successfully!', 'success');
        }
      } else {
        // Add new award
        console.log('Adding new award');
        result = await addAward(formData);
        
        if (result.success) {
          // Add the new award directly to local state
          const newAward = {
            ...result.data,
            imagePath: result.data.image_path ? `http://127.0.0.1:8000/storage/${result.data.image_path}` : null,
            imageUrl: result.data.imageUrl || (result.data.image_path ? constructCertificateImageUrl(result.data.image_path) : null)
          };
          
          const updatedAwards = [...currentAwards, newAward];
          setCurrentAwards(updatedAwards);
          
          // Call parent update function safely
          if (onUpdateAwards && typeof onUpdateAwards === 'function') {
            onUpdateAwards(updatedAwards);
          }
          
          showNotification('🎉 Award added successfully! Your achievement has been saved.', 'success');
        }
      }
      
      // Close modal on success
      if (result && result.success) {
        setShowAwardModal(false);
        setEditingAward(null);
        console.log('Award operation completed successfully');
      }
      
    } catch (error) {
      console.error('Error saving award:', error);
      showNotification(`Error saving award: ${error.message}`, 'error');
    }
  };

  const handleAwardDelete = async (idToDelete) => {
    console.log('handleAwardDelete called with ID:', idToDelete);
    
    // Use parent confirmation system if available, otherwise fallback to window.confirm
    if (onShowConfirmation && typeof onShowConfirmation === 'function') {
      onShowConfirmation(
        'Delete Award',
        'Are you sure you want to delete this award? This action cannot be undone.',
        async () => {
          try {
            console.log('Confirmation accepted, attempting to delete award with ID:', idToDelete);
            
            // Check if the award exists in our local state
            const awardExists = currentAwards.find(award => award.id === idToDelete);
            if (!awardExists) {
              console.warn('Award not found in local state:', idToDelete);
              showNotification('Award not found. It may have already been deleted.', 'warning');
              return;
            }

            const result = await deleteAward(idToDelete);
            console.log('Delete result:', result);
            
            if (result.success) {
              // Remove the deleted award directly from local state instead of refreshing
              const updatedAwards = currentAwards.filter(award => award.id !== idToDelete);
              console.log('Updated awards:', updatedAwards);
              
              setCurrentAwards(updatedAwards);
              
              // Call parent update function safely
              if (onUpdateAwards && typeof onUpdateAwards === 'function') {
                onUpdateAwards(updatedAwards);
              }
              
              showNotification('Award deleted successfully!', 'success');
              console.log('Award deleted successfully');
            } else {
              throw new Error(result.message || 'Failed to delete award');
            }
          } catch (error) {
            console.error('Error deleting award:', error);
            
            // If the award doesn't exist on the server, remove it from local state anyway
            if (error.message.includes('No query results for model') || error.message.includes('404')) {
              const updatedAwards = currentAwards.filter(award => award.id !== idToDelete);
              setCurrentAwards(updatedAwards);
              
              if (onUpdateAwards && typeof onUpdateAwards === 'function') {
                onUpdateAwards(updatedAwards);
              }
              
              showNotification('Award removed (was already deleted on server)', 'info');
            } else {
              showNotification(`Error deleting award: ${error.message}`, 'error');
            }
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
      showNotification('Cannot delete award: confirmation system not available.', 'error');
      return;
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
        // Update the award with the new image path directly in local state
        const updatedAwards = currentAwards.map(award => 
          award.id === awardId 
            ? { 
                ...award, 
                image_path: result.data.image_path,
                imagePath: result.data.image_path ? `http://127.0.0.1:8000/storage/${result.data.image_path}` : null,
                imageUrl: result.data.imageUrl || result.data.imagePath,
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

  const handleImageAdd = async (awardId, imageFile) => {
    try {
      // For awards, we update the single image rather than adding multiple
      const result = await updateAwardImage(awardId, imageFile);
      
      if (result.success) {
        // Update the award with the new image path directly in local state
        const updatedAwards = currentAwards.map(award => 
          award.id === awardId 
            ? { 
                ...award, 
                image_path: result.data.image_path,
                imagePath: result.data.image_path ? `http://127.0.0.1:8000/storage/${result.data.image_path}` : null,
                imageUrl: result.data.imageUrl || result.data.imagePath,
                updated_at: result.data.updated_at
              }
            : award
        );
        
        setCurrentAwards(updatedAwards);
        onUpdateAwards(updatedAwards);
        
        showNotification('Award image added successfully!', 'success');
      } else {
        showNotification('Failed to update award image', 'error');
      }
    } catch (error) {
      console.error('Error adding award image:', error);
      showNotification(`Error adding award image: ${error.message}`, 'error');
    }
  };

  const handleImageDelete = async (imageId) => {
    try {
      const result = await deleteAwardImage(imageId);
      
      if (result && result.success) {
        // Update local state directly instead of API refresh
        const updatedAwards = currentAwards.map(award => ({
          ...award,
          image_path: null,
          imagePath: null,
          imageUrl: null
        }));
        setCurrentAwards(updatedAwards);
        onUpdateAwards(updatedAwards);
        showNotification('Award image deleted successfully!', 'success');
      } else {
        showNotification('Failed to delete award image', 'error');
      }
    } catch (error) {
      console.error('Error deleting award image:', error);
      
      // Even if API call fails, remove from UI if image already deleted
      if (error.message && error.message.includes('not found')) {
        const updatedAwards = currentAwards.map(award => ({
          ...award,
          image_path: null,
          imagePath: null,
          imageUrl: null
        }));
        setCurrentAwards(updatedAwards);
        onUpdateAwards(updatedAwards);
        showNotification('Image removed from list (already deleted)', 'info');
      } else {
        showNotification(`Error deleting award image: ${error.message || 'Unknown error'}`, 'error');
      }
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
        onImageAdd={handleImageAdd}
        onImageDelete={handleImageDelete}
      />

      {/* Award Modal */}
      <Modal
        isOpen={showAwardModal}
        onClose={handleCloseAwardModal}
        title={editingAward ? 'Edit Award' : 'Add New Award'}
        className="w-full max-w-3xl"
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
