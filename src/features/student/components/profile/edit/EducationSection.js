// src/features/student/components/profile/edit/EducationSection.js

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaEdit, FaTrash, FaGraduationCap, FaCalendarAlt } from 'react-icons/fa';

function EducationSection({ educations = [], onAdd, onEdit, onDelete }) {
  const formatDate = (dateString) => {
    if (!dateString) return 'Present';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-800">Education</h3>
        <motion.button
          type="button"
          onClick={onAdd}
          className="flex items-center gap-2 px-4 py-2 bg-[#901b20] text-white rounded-lg hover:bg-[#7a1519] transition-colors duration-200"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaPlus size={14} />
          Add Education
        </motion.button>
      </div>

      <AnimatePresence>
        {educations.length === 0 ? (
          <motion.div 
            className="text-center py-12 text-gray-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <FaGraduationCap size={48} className="mx-auto mb-4 text-gray-300" />
            <p>No education entries yet. Add your educational background to showcase your qualifications.</p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {educations.map((education, index) => (
              <motion.div
                key={education.id}
                className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-800 mb-2">
                      {education.degree} in {education.fieldOfStudy}
                    </h4>
                    <p className="text-[#901b20] font-medium mb-2">{education.institution}</p>
                    <div className="flex items-center gap-2 text-gray-600 mb-3">
                      <FaCalendarAlt size={14} />
                      <span>
                        {formatDate(education.startDate)} - {formatDate(education.endDate)}
                      </span>
                    </div>
                    {education.description && (
                      <p className="text-gray-700 text-sm leading-relaxed">
                        {education.description}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2 ml-4">
                    <motion.button
                      type="button"
                      onClick={() => onEdit(education)}
                      className="p-2 text-gray-600 hover:text-[#901b20] hover:bg-gray-100 rounded-lg transition-colors duration-200"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <FaEdit size={16} />
                    </motion.button>
                    <motion.button
                      type="button"
                      onClick={() => onDelete(education.id)}
                      className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <FaTrash size={16} />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default EducationSection;
