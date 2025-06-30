// src/features/student/components/profile/edit/AwardsSection.jsx

import React from 'react';
import { FaPlus, FaTrophy } from 'react-icons/fa';
import AwardItem from './AwardItem';

function AwardsSection({ 
  awards, 
  onAdd, 
  onEdit, 
  onDelete,
  onImageUpdate
}) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-800">Your Awards & Achievements</h3>
        <button
          type="button"
          onClick={onAdd}
          className="inline-flex items-center px-4 py-2 bg-yellow-600 text-white rounded-lg shadow-sm hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-colors duration-200"
        >
          <FaPlus className="mr-2 h-4 w-4" />
          Add Award
        </button>
      </div>

      <div className="max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        {awards.length === 0 ? (
          <div
            key="empty-awards"
            className="text-center py-10 text-gray-500"
          >
            <FaTrophy className="mx-auto h-10 w-10 text-gray-400 mb-3" />
            <p>No awards or achievements yet. Click "Add Award" to get started.</p>
          </div>
        ) : (
          <div>
            {awards.map((award) => (
              <AwardItem
                key={award.id}
                award={award}
                onEdit={onEdit}
                onDelete={onDelete}
                onImageUpdate={onImageUpdate}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AwardsSection;
