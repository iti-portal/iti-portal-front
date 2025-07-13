// src/features/student/components/profile/edit/CertificatesManagement.jsx

import React, { useState, useEffect } from 'react';
import Modal from '../../../../../components/UI/Modal';
import Alert from '../../../../../components/UI/Alert';
import CertificateSection from './CertificateSection.jsx';
import CertificateForm from './CertificateForm.jsx';
import { addCertificate, updateCertificate, deleteCertificate, updateCertificateImage } from '../../../../../services/certificatesService';

function CertificatesManagement({ 
  certificates = [], 
  onUpdateCertificates, 
  showNotifications = true,
  onShowNotification,
  onShowConfirmation,
  onHideConfirmation 
}) {
  const [currentCertificates, setCurrentCertificates] = useState(certificates || []);
  
  // Modal state
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [editingCertificate, setEditingCertificate] = useState(null);
  
  // Notification state (fallback if parent doesn't provide notification system)
  const [notification, setNotification] = useState({ 
    show: false, 
    type: 'info', 
    message: '' 
  });

  // Sync data from props to internal state
  useEffect(() => {
    setCurrentCertificates(certificates || []);
  }, [certificates]);

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

  // Certificate Modal Handlers
  const handleAddCertificate = () => {
    setEditingCertificate(null);
    setShowCertificateModal(true);
  };

  const handleEditCertificate = (certificate) => {
    setEditingCertificate(certificate);
    setShowCertificateModal(true);
  };

  const handleCertificateSubmit = async (formData) => {
    try {
      console.log('handleCertificateSubmit called with data:', formData);
      let result;
      
      if (editingCertificate) {
        // Update existing certificate
        console.log('Updating certificate:', editingCertificate.id);
        result = await updateCertificate(editingCertificate.id, formData);
        
        if (result.success) {
          // Map backend snake_case to frontend camelCase
          const mappedData = {
            id: result.data.id,
            title: result.data.title,
            description: result.data.description,
            organization: result.data.organization,
            achievedAt: result.data.achieved_at,
            certificateUrl: result.data.certificate_url,
            imagePath: result.data.image_path ? `http://127.0.0.1:8000/storage/${result.data.image_path}` : null,
            createdAt: result.data.created_at,
            updatedAt: result.data.updated_at
          };
          
          const updatedCerts = currentCertificates.map(cert => 
            cert.id === editingCertificate.id ? mappedData : cert
          );
          setCurrentCertificates(updatedCerts);
          
          // Call parent update function safely
          if (onUpdateCertificates && typeof onUpdateCertificates === 'function') {
            onUpdateCertificates(updatedCerts);
          }
          
          showNotification('Certificate updated successfully!', 'success');
        }
      } else {
        // Add new certificate
        console.log('Adding new certificate');
        result = await addCertificate(formData);
        
        if (result.success) {
          // Map backend snake_case to frontend camelCase
          const mappedData = {
            id: result.data.id,
            title: result.data.title,
            description: result.data.description,
            organization: result.data.organization,
            achievedAt: result.data.achieved_at,
            certificateUrl: result.data.certificate_url,
            imagePath: result.data.image_path ? `http://127.0.0.1:8000/storage/${result.data.image_path}` : null,
            createdAt: result.data.created_at,
            updatedAt: result.data.updated_at
          };
          
          const updatedCerts = [...currentCertificates, mappedData];
          setCurrentCertificates(updatedCerts);
          
          // Call parent update function safely
          if (onUpdateCertificates && typeof onUpdateCertificates === 'function') {
            onUpdateCertificates(updatedCerts);
          }
          
          showNotification('Certificate added successfully!', 'success');
        }
      }
      
      // Close modal on success
      setShowCertificateModal(false);
      setEditingCertificate(null);
      console.log('Certificate operation completed successfully');
      
    } catch (error) {
      console.error('Error saving certificate:', error);
      showNotification(`Error saving certificate: ${error.message}`, 'error');
    }
  };

  const handleCertificateDelete = async (idToDelete) => {
    console.log('handleCertificateDelete called with ID:', idToDelete);
    
    // Use parent confirmation system if available, otherwise fallback to window.confirm
    if (onShowConfirmation && typeof onShowConfirmation === 'function') {
      onShowConfirmation(
        'Delete Certificate',
        'Are you sure you want to delete this certificate? This action cannot be undone.',
        async () => {
          try {
            console.log('Confirmation accepted, attempting to delete certificate with ID:', idToDelete);
            const result = await deleteCertificate(idToDelete);
            console.log('Delete result:', result);
            
            if (result.success) {
              const updatedCerts = currentCertificates.filter(cert => cert.id !== idToDelete);
              console.log('Updated certificates:', updatedCerts);
              
              setCurrentCertificates(updatedCerts);
              
              // Call parent update function safely
              if (onUpdateCertificates && typeof onUpdateCertificates === 'function') {
                onUpdateCertificates(updatedCerts);
              }
              
              showNotification('Certificate deleted successfully!', 'success');
              console.log('Certificate deleted successfully');
            } else {
              throw new Error(result.message || 'Failed to delete certificate');
            }
          } catch (error) {
            console.error('Error deleting certificate:', error);
            showNotification(`Error deleting certificate: ${error.message}`, 'error');
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
      showNotification('Cannot delete certificate: confirmation system not available.', 'error');
    }
  };

  const handleCloseCertificateModal = () => {
    setShowCertificateModal(false);
    setEditingCertificate(null);
  };

  const handleImageUpdate = async (certificateId, imageFile) => {
    try {
      console.log('handleImageUpdate called for certificate ID:', certificateId);
      const result = await updateCertificateImage(certificateId, imageFile);
      
      if (result.success) {
        // Update the certificate with the new image path
        const updatedCerts = currentCertificates.map(cert => 
          cert.id === certificateId 
            ? { 
                ...cert, 
                imagePath: result.data.image_path ? `http://127.0.0.1:8000/storage/${result.data.image_path}` : null,
                updatedAt: result.data.updated_at
              }
            : cert
        );
        
        setCurrentCertificates(updatedCerts);
        
        // Call parent update function safely
        if (onUpdateCertificates && typeof onUpdateCertificates === 'function') {
          onUpdateCertificates(updatedCerts);
        }
        
        showNotification('Certificate image updated successfully!', 'success');
        console.log('Certificate image updated successfully');
      }
    } catch (error) {
      console.error('Error updating certificate image:', error);
      showNotification(`Error updating certificate image: ${error.message}`, 'error');
    }
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
      
      {/* Certificates Section */}
      <CertificateSection
        certificates={currentCertificates}
        onAdd={handleAddCertificate}
        onEdit={handleEditCertificate}
        onDelete={handleCertificateDelete}
        onImageUpdate={handleImageUpdate}
      />

      {/* Certificate Modal */}
      <Modal
        isOpen={showCertificateModal}
        onClose={handleCloseCertificateModal}
        title={editingCertificate ? 'Edit Certificate' : 'Add New Certificate'}
        className="w-full max-w-3xl"
      >
        <CertificateForm
          onSubmit={handleCertificateSubmit}
          initialData={editingCertificate}
        />
      </Modal>
    </>
  );
}

export default CertificatesManagement;
