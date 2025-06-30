// src/features/student/components/profile/edit/AwardsManagement.jsx

import React, { useState, useEffect } from 'react';
import Modal from '../../../../../components/UI/Modal';
import AwardsSection from './AwardsSection.jsx';
import AwardForm from './AwardForm.jsx';
import { addAward, updateAward, deleteAward } from '../../../../../services/profileService';

function AwardsManagement({ awards = [], onUpdateAwards }) {
  const [currentAwards, setCurrentAwards] = useState(awards || []);
  
  // Modal state
  const [showAwardModal, setShowAwardModal] = useState(false);
  const [editingAward, setEditingAward] = useState(null);

  // Sync data from props to internal state
  useEffect(() => {
    setCurrentAwards(awards || []);
  }, [awards]);

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
          const updatedAwards = currentAwards.map(award => 
            award.id === editingAward.id 
              ? { ...award, ...result.data }
              : award
          );
          setCurrentAwards(updatedAwards);
          onUpdateAwards(updatedAwards);
          alert('Award updated successfully!');
        }
      } else {
        // Add new award
        result = await addAward(formData);
        
        if (result.success) {
          const updatedAwards = [...currentAwards, result.data];
          setCurrentAwards(updatedAwards);
          onUpdateAwards(updatedAwards);
          alert('Award added successfully!');
        }
      }
      
      // Close modal on success
      setShowAwardModal(false);
      setEditingAward(null);
      
    } catch (error) {
      console.error('Error saving award:', error);
      alert(`Error saving award: ${error.message}`);
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
        alert('Award deleted successfully!');
      }
    } catch (error) {
      console.error('Error deleting award:', error);
      alert(`Error deleting award: ${error.message}`);
    }
  };

  const handleCloseAwardModal = () => {
    setShowAwardModal(false);
    setEditingAward(null);
  };

  return (
    <>
      {/* Awards Section */}
      <AwardsSection
        awards={currentAwards}
        onAdd={handleAddAward}
        onEdit={handleEditAward}
        onDelete={handleAwardDelete}
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
