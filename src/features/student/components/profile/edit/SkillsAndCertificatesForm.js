// src/features/student/components/profile/edit/SkillsAndCertificatesForm.js

import React from 'react';
import SkillsManagement from './SkillsManagement.jsx';
import CertificatesManagement from './CertificatesManagement.jsx';
import AwardsManagement from './AwardsManagement.jsx';

function SkillsAndCertificatesForm({ skills = [], certificates = [], awards = [], onUpdateSkills, onUpdateCertificates, onUpdateAwards }) {
  return (
    <div className="space-y-6">
      {/* Skills Management */}
      <SkillsManagement 
        skills={skills} 
        onUpdateSkills={onUpdateSkills} 
      />

      {/* Certificates Management */}
      <CertificatesManagement 
        certificates={certificates} 
        onUpdateCertificates={onUpdateCertificates} 
      />

      {/* Awards Management */}
      <AwardsManagement 
        awards={awards} 
        onUpdateAwards={onUpdateAwards} 
      />
    </div>
  );
}

export default SkillsAndCertificatesForm;
