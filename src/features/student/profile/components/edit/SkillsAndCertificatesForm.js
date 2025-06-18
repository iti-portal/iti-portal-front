// src/features/Student/Profile/components/edit/SkillsAndCertificatesForm.js

import React, { useState, useEffect } from 'react';

// دالة لإنشاء ID فريد مؤقت
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

function CertificateFormItem({ certificate, onUpdate, onDelete }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onUpdate(certificate.id, { ...certificate, [name]: value });
  };

  return (
    <div className="bg-gray-50 p-4 rounded-md shadow-sm border border-gray-200 mb-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor={`cert-name-${certificate.id}`} className="block text-sm font-medium text-gray-700">Certificate Name</label>
          <input
            type="text" name="name" id={`cert-name-${certificate.id}`} value={certificate.name} onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor={`cert-issuingBody-${certificate.id}`} className="block text-sm font-medium text-gray-700">Issuing Body</label>
          <input
            type="text" name="issuingBody" id={`cert-issuingBody-${certificate.id}`} value={certificate.issuingBody} onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor={`cert-dateIssued-${certificate.id}`} className="block text-sm font-medium text-gray-700">Date Issued</label>
          <input
            type="date" name="dateIssued" id={`cert-dateIssued-${certificate.id}`} value={certificate.dateIssued} onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor={`cert-url-${certificate.id}`} className="block text-sm font-medium text-gray-700">Credential URL (Optional)</label>
          <input
            type="url" name="url" id={`cert-url-${certificate.id}`} value={certificate.url || ''} onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
      </div>
      <div className="flex justify-end mt-4">
        <button
          type="button"
          onClick={() => onDelete(certificate.id)}
          className="ml-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Delete Certificate
        </button>
      </div>
    </div>
  );
}


function SkillsAndCertificatesForm({ skills, achievements, onUpdateSkills, onUpdateAchievements }) {
  const [currentSkills, setCurrentSkills] = useState(skills || []);
  const [currentCertificates, setCurrentCertificates] = useState(achievements.filter(ach => ach.type === 'certificate') || []);
  const [newSkillInput, setNewSkillInput] = useState('');

  // مزامنة البيانات من الـ props مع الحالة الداخلية
  useEffect(() => {
    setCurrentSkills(skills || []);
    setCurrentCertificates(achievements.filter(ach => ach.type === 'certificate') || []);
  }, [skills, achievements]);


  // Skills Handlers
  const handleAddSkill = () => {
    const trimmedInput = newSkillInput.trim();
    if (trimmedInput && !currentSkills.some(s => s.name.toLowerCase() === trimmedInput.toLowerCase())) {
      const newSkill = { id: generateUniqueId(), name: trimmedInput, level: 'Intermediate' }; // يمكن إضافة تحديد مستوى المهارة لاحقًا
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

  // Certificates Handlers
  const handleCertificateUpdate = (id, updatedCert) => {
    const updatedCerts = currentCertificates.map(cert => (cert.id === id ? updatedCert : cert));
    setCurrentCertificates(updatedCerts);
    const otherAchievements = achievements.filter(ach => ach.type !== 'certificate');
    onUpdateAchievements([...otherAchievements, ...updatedCerts]);
  };

  const handleAddCertificate = () => {
    const newCert = {
      id: generateUniqueId(),
      type: 'certificate',
      name: '',
      issuingBody: '',
      dateIssued: '',
      url: '',
    };
    const updatedCerts = [...currentCertificates, newCert];
    setCurrentCertificates(updatedCerts);
    const otherAchievements = achievements.filter(ach => ach.type !== 'certificate');
    onUpdateAchievements([...otherAchievements, ...updatedCerts]);
  };

  const handleCertificateDelete = (idToDelete) => {
    const updatedCerts = currentCertificates.filter(cert => cert.id !== idToDelete);
    setCurrentCertificates(updatedCerts);
    const otherAchievements = achievements.filter(ach => ach.type !== 'certificate');
    onUpdateAchievements([...otherAchievements, ...updatedCerts]);
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
            onKeyPress={(e) => { // إضافة مهارة عند الضغط على Enter
                if (e.key === 'Enter') {
                    e.preventDefault(); // منع إرسال الفورم
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
      </div>

      {/* Certificates Section */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Certificates & Awards</h2>
        <p className="text-gray-600 text-sm mb-4">Manage your certifications and achievements.</p>

        {currentCertificates.length > 0 ? (
          currentCertificates.map(cert => (
            <CertificateFormItem
              key={cert.id}
              certificate={cert}
              onUpdate={handleCertificateUpdate}
              onDelete={handleCertificateDelete}
            />
          ))
        ) : (
          <p className="text-gray-500 text-center py-4">No certificates added yet.</p>
        )}

        <button
          type="button"
          onClick={handleAddCertificate}
          className="mt-4 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Add New Certificate
        </button>
      </div>
    </div>
  );
}

export default SkillsAndCertificatesForm;