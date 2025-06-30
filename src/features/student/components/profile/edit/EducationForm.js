// src/features/student/components/profile/edit/EducationForm.js

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

function EducationForm({ initialData = null, onSubmit }) {
  const [formData, setFormData] = useState({
    institution: '',
    degree: '',
    fieldOfStudy: '',
    startDate: '',
    endDate: '',
    description: ''
  });

  // Initialize form data when initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData({
        institution: initialData.institution || '',
        degree: initialData.degree || '',
        fieldOfStudy: initialData.fieldOfStudy || '',
        startDate: initialData.startDate || '',
        endDate: initialData.endDate || '',
        description: initialData.description || ''
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent event bubbling
    onSubmit(formData);
  };

  return (
    <motion.form 
      onSubmit={handleSubmit}
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="institution" className="block text-sm font-medium text-gray-700 mb-2">
            Institution*
          </label>
          <input
            type="text"
            name="institution"
            id="institution"
            required
            value={formData.institution}
            onChange={handleChange}
            placeholder="e.g. Cairo University"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#901b20] focus:border-[#901b20]"
          />
        </div>

        <div>
          <label htmlFor="degree" className="block text-sm font-medium text-gray-700 mb-2">
            Degree*
          </label>
          <input
            type="text"
            name="degree"
            id="degree"
            required
            value={formData.degree}
            onChange={handleChange}
            placeholder="e.g. Bachelor of Science"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#901b20] focus:border-[#901b20]"
          />
        </div>
      </div>

      <div>
        <label htmlFor="fieldOfStudy" className="block text-sm font-medium text-gray-700 mb-2">
          Field of Study*
        </label>
        <input
          type="text"
          name="fieldOfStudy"
          id="fieldOfStudy"
          required
          value={formData.fieldOfStudy}
          onChange={handleChange}
          placeholder="e.g. Computer Engineering"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#901b20] focus:border-[#901b20]"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
            Start Date*
          </label>
          <input
            type="date"
            name="startDate"
            id="startDate"
            required
            value={formData.startDate}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#901b20] focus:border-[#901b20]"
          />
        </div>

        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
            End Date
          </label>
          <input
            type="date"
            name="endDate"
            id="endDate"
            value={formData.endDate}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#901b20] focus:border-[#901b20]"
          />
          <p className="text-xs text-gray-500 mt-1">Leave blank if currently enrolled</p>
        </div>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          name="description"
          id="description"
          rows="4"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe your studies, achievements, relevant coursework..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#901b20] focus:border-[#901b20]"
        />
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="submit"
          className="px-6 py-2 bg-[#901b20] text-white rounded-lg hover:bg-[#7a1519] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#901b20] transition-colors duration-200"
        >
          {initialData ? 'Update' : 'Add'} Education
        </button>
      </div>
    </motion.form>
  );
}

export default EducationForm;
