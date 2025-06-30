// src/features/student/components/profile/edit/SkillsAndCertificatesForm.jsx

import React from 'react';
import SkillsManagement from './SkillsManagement';
import CertificatesManagement from './CertificatesManagement';
import AwardsManagement from './AwardsManagement';

function SkillsAndCertificatesForm({ 
  skills = [], 
  certificates = [], 
  awards = [],
  onUpdateSkills, 
  onUpdateCertificates, 
  onUpdateAwards 
}) {
  return (
    <div className="space-y-8">
      {/* Skills Section */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Skills</h3>
        <SkillsManagement 
          skills={skills} 
          onUpdateSkills={onUpdateSkills}
          showNotifications={false}
        />
      </div>

      {/* Certificates Section */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Certificates</h3>
        <CertificatesManagement 
          certificates={certificates} 
          onUpdateCertificates={onUpdateCertificates}
          showNotifications={false}
        />
      </div>

      {/* Awards Section */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Awards & Achievements</h3>
        <AwardsManagement 
          awards={awards} 
          onUpdateAwards={onUpdateAwards}
          showNotifications={false}
        />
      </div>
    </div>
  );
}

export default SkillsAndCertificatesForm;
