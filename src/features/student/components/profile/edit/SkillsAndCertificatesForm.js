// src/features/student/components/profile/edit/SkillsAndCertificatesForm.js

import React, { useState, useEffect } from 'react';
import Modal from '../../../../../components/UI/Modal';
import CertificateSection from './CertificateSection';
import CertificateForm from './CertificateForm';

// Helper function to generate unique ID
const generateUniqueId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);

function SkillTag({ skill, onRemove }) {
  return (
    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
      {skill.name}
      <button
        type="button"
        onClick={() => onRemove(skill.id)}
        className="ml-2 -mr-0.5 h-4 w-4 flex-shrink-0 rounded-full inline-flex items-center justify-center text-red-600 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
      >
        <span className="sr-only">Remove skill</span>
        <svg className="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M1 1l6 6m0-6L1 7" />
        </svg>
      </button>
    </span>
  );
}

function SkillsAndCertificatesForm({ skills, achievements, onUpdateSkills, onUpdateAchievements }) {
  const [currentSkills, setCurrentSkills] = useState(skills || []);
  const [currentCertificates, setCurrentCertificates] = useState(achievements.filter(ach => ach.type === 'certificate') || []);
  const [newSkillInput, setNewSkillInput] = useState('');
  
  // Modal state
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [editingCertificate, setEditingCertificate] = useState(null);

  // Sync data from props to internal state
  useEffect(() => {
    setCurrentSkills(skills || []);
    setCurrentCertificates(achievements.filter(ach => ach.type === 'certificate') || []);
  }, [skills, achievements]);

  // Skills Handlers
  const handleAddSkill = () => {
    const trimmedInput = newSkillInput.trim();
    if (trimmedInput && !currentSkills.some(s => s.name.toLowerCase() === trimmedInput.toLowerCase())) {
      const newSkill = { id: generateUniqueId(), name: trimmedInput, level: 'Intermediate' };
      const updatedSkills = [...currentSkills, newSkill];
      setCurrentSkills(updatedSkills);
      onUpdateSkills(updatedSkills);
      setNewSkillInput('');
    }
  };

  const handleRemoveSkill = (idToRemove) => {
    const updatedSkills = currentSkills.filter(skill => skill.id !== idToRemove);
    setCurrentSkills(updatedSkills);
    onUpdateSkills(updatedSkills);
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

  const handleCertificateSubmit = (formData) => {
    let updatedCerts;
    
    if (editingCertificate) {
      // Update existing certificate
      updatedCerts = currentCertificates.map(cert => 
        cert.id === editingCertificate.id 
          ? { ...cert, ...formData, type: 'certificate' }
          : cert
      );
    } else {
      // Add new certificate
      const newCert = {
        id: generateUniqueId(),
        type: 'certificate',
        ...formData
      };
      updatedCerts = [...currentCertificates, newCert];
    }
    
    setCurrentCertificates(updatedCerts);
    const otherAchievements = achievements.filter(ach => ach.type !== 'certificate');
    onUpdateAchievements([...otherAchievements, ...updatedCerts]);
    
    // Close modal
    setShowCertificateModal(false);
    setEditingCertificate(null);
  };

  const handleCertificateDelete = (idToDelete) => {
    const updatedCerts = currentCertificates.filter(cert => cert.id !== idToDelete);
    setCurrentCertificates(updatedCerts);
    const otherAchievements = achievements.filter(ach => ach.type !== 'certificate');
    onUpdateAchievements([...otherAchievements, ...updatedCerts]);
  };

  const handleCloseCertificateModal = () => {
    setShowCertificateModal(false);
    setEditingCertificate(null);
  };


  return (
    <div className="space-y-6">
      {/* Manage Your Skills */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Manage Your Skills</h2>
        <p className="text-gray-600 text-sm mb-4">Add or remove technologies you're proficient in.</p>
        
        {/* Current Skills Display */}
        <div className="flex flex-wrap gap-2 mb-4">
          {currentSkills.map(skill => (
            <SkillTag key={skill.id} skill={skill} onRemove={handleRemoveSkill} />
          ))}
        </div>

        {/* Add New Skill Input */}
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={newSkillInput}
            onChange={(e) => setNewSkillInput(e.target.value)}
            onKeyPress={(e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSkill();
                }
            }}
            className="flex-grow border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="e.g., React.js, Node.js, Tailwind CSS"
          />
          <button
            type="button"
            onClick={handleAddSkill}
            className="inline-flex items-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
            Add Skill
          </button>
        </div>
      </div>      {/* Certificates Section */}
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
    </div>
  );
}

export default SkillsAndCertificatesForm;
