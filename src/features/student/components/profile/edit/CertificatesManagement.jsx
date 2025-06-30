// src/features/student/components/profile/edit/CertificatesManagement.jsx

import React, { useState, useEffect } from 'react';
import Modal from '../../../../../components/UI/Modal';
import CertificateSection from './CertificateSection.jsx';
import CertificateForm from './CertificateForm.jsx';
import { addCertificate, updateCertificate, deleteCertificate, updateCertificateImage } from '../../../../../services/certificatesService';

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
          onUpdateCertificates(updatedCerts);
          alert('Certificate updated successfully!');
        }
      } else {
        // Add new certificate
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

  const handleImageUpdate = async (certificateId, imageFile) => {
    try {
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
        onUpdateCertificates(updatedCerts);
        alert('Certificate image updated successfully!');
      }
    } catch (error) {
      console.error('Error updating certificate image:', error);
      alert(`Error updating certificate image: ${error.message}`);
    }
  };

  return (
    <>
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
