// src/features/student/components/profile/edit/CertificatesManagement.jsx

import React, { useState, useEffect } from 'react';
import Modal from '../../../../../components/UI/Modal';
import CertificateSection from './CertificateSection.jsx';
import CertificateForm from './CertificateForm.jsx';
import { addCertificate, updateCertificate, deleteCertificate } from '../../../../../services/profileService';

function CertificatesManagement({ certificates = [], onUpdateCertificates }) {
  const [currentCertificates, setCurrentCertificates] = useState(certificates || []);
  
  // Modal state
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [editingCertificate, setEditingCertificate] = useState(null);

  // Sync data from props to internal state
  useEffect(() => {
    setCurrentCertificates(certificates || []);
  }, [certificates]);

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
      let result;
      
      if (editingCertificate) {
        // Update existing certificate
        result = await updateCertificate(editingCertificate.id, formData);
        
        if (result.success) {
          const updatedCerts = currentCertificates.map(cert => 
            cert.id === editingCertificate.id 
              ? { ...cert, ...result.data }
              : cert
          );
          setCurrentCertificates(updatedCerts);
          onUpdateCertificates(updatedCerts);
          alert('Certificate updated successfully!');
        }
      } else {
        // Add new certificate
        result = await addCertificate(formData);
        
        if (result.success) {
          const updatedCerts = [...currentCertificates, result.data];
          setCurrentCertificates(updatedCerts);
          onUpdateCertificates(updatedCerts);
          alert('Certificate added successfully!');
        }
      }
      
      // Close modal on success
      setShowCertificateModal(false);
      setEditingCertificate(null);
      
    } catch (error) {
      console.error('Error saving certificate:', error);
      alert(`Error saving certificate: ${error.message}`);
    }
  };

  const handleCertificateDelete = async (idToDelete) => {
    // Show confirmation dialog
    const confirmDelete = window.confirm('Are you sure you want to delete this certificate?');
    
    if (!confirmDelete) {
      return;
    }

    try {
      const result = await deleteCertificate(idToDelete);
      
      if (result.success) {
        const updatedCerts = currentCertificates.filter(cert => cert.id !== idToDelete);
        setCurrentCertificates(updatedCerts);
        onUpdateCertificates(updatedCerts);
        alert('Certificate deleted successfully!');
      }
    } catch (error) {
      console.error('Error deleting certificate:', error);
      alert(`Error deleting certificate: ${error.message}`);
    }
  };

  const handleCloseCertificateModal = () => {
    setShowCertificateModal(false);
    setEditingCertificate(null);
  };

  return (
    <>
      {/* Certificates Section */}
      <CertificateSection
        certificates={currentCertificates}
        onAdd={handleAddCertificate}
        onEdit={handleEditCertificate}
        onDelete={handleCertificateDelete}
      />

      {/* Certificate Modal */}
      <Modal
        isOpen={showCertificateModal}
        onClose={handleCloseCertificateModal}
        title={editingCertificate ? 'Edit Certificate' : 'Add New Certificate'}
        className="max-w-2xl"
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
