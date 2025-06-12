// src/features/Student/Profile/components/ProfileSectionCard.js
import React from 'react';
function ProfileSectionCard({ title, children, className = '' }) {
  return (
    <div className={`bg-white rounded-lg shadow-xl p-6 mb-6 ${className}`}>
      {title && (
        <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-2">
          {title}
        </h2>
      )}
      {children}
    </div>
  );
}
export default ProfileSectionCard;