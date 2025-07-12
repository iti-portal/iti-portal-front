// src/features/student/components/profile/edit/EducationForm.jsx

import React, { useState } from 'react';
import { FaGraduationCap } from 'react-icons/fa';

function EducationForm({ onSubmit, initialData = null }) {
  const [formData, setFormData] = useState({
    institution: initialData?.institution || '',
    degree: initialData?.degree || '',
    fieldOfStudy: initialData?.fieldOfStudy || '',
    startDate: initialData?.startDate || '',
    endDate: initialData?.endDate || '',
    description: initialData?.description || '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ 
      ...formData, 
      [name]: value 
    });
    
    // Clear error for this field when it's being edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.institution.trim()) {
      newErrors.institution = 'Institution is required';
    }
    
    if (!formData.degree.trim()) {
      newErrors.degree = 'Degree is required';
    }
    
    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };  const handleSubmit = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (validate()) {
      onSubmit(formData);
    }
  };  return (
    <div className="space-y-6 ">
      <div>
        <label htmlFor="institution" className="block text-sm font-medium text-gray-700 mb-1">
          University / Institution *
        </label>
        <input
          id="institution"
          name="institution"
          type="text"
          value={formData.institution}
          onChange={handleChange}
          className={`block w-full px-3 py-2 border ${
            errors.institution ? 'border-red-300 bg-red-50' : 'border-gray-300'
          } rounded-md shadow-sm focus:outline-none focus:ring-iti-primary focus:border-iti-primary sm:text-sm`}
          placeholder="e.g., Information Technology Institute (ITI)"
        />
        {errors.institution && (
          <p className="mt-1 text-sm text-red-600">{errors.institution}</p>
        )}
      </div>

      <div>
        <label htmlFor="degree" className="block text-sm font-medium text-gray-700 mb-1">
          Degree / Diploma *
        </label>
        <input
          id="degree"
          name="degree"
          type="text"
          value={formData.degree}
          onChange={handleChange}
          className={`block w-full px-3 py-2 border ${
            errors.degree ? 'border-red-300 bg-red-50' : 'border-gray-300'
          } rounded-md shadow-sm focus:outline-none focus:ring-iti-primary focus:border-iti-primary sm:text-sm`}
          placeholder="e.g., Bachelor of Computer Science"
        />
        {errors.degree && (
          <p className="mt-1 text-sm text-red-600">{errors.degree}</p>
        )}
      </div>

      <div>
        <label htmlFor="fieldOfStudy" className="block text-sm font-medium text-gray-700 mb-1">
          Field of Study
        </label>
        <input
          id="fieldOfStudy"
          name="fieldOfStudy"
          type="text"
          value={formData.fieldOfStudy}
          onChange={handleChange}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-iti-primary focus:border-iti-primary sm:text-sm"
          placeholder="e.g., Software Engineering"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
            Start Date *
          </label>
          <input
            id="startDate"
            name="startDate"
            type="date"
            value={formData.startDate}
            onChange={handleChange}
            className={`block w-full px-3 py-2 border ${
              errors.startDate ? 'border-red-300 bg-red-50' : 'border-gray-300'
            } rounded-md shadow-sm focus:outline-none focus:ring-iti-primary focus:border-iti-primary sm:text-sm`}
          />
          {errors.startDate && (
            <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>
          )}
        </div>

        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
            End Date <span className="text-sm text-gray-500">(or Expected)</span>
          </label>
          <input
            id="endDate"
            name="endDate"
            type="date"
            value={formData.endDate}
            onChange={handleChange}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-iti-primary focus:border-iti-primary sm:text-sm"
          />
        </div>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows="3"
          value={formData.description}
          onChange={handleChange}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-iti-primary focus:border-iti-primary sm:text-sm"
          placeholder="Add relevant courses, achievements, or activities"
        ></textarea>
      </div>      <div className="flex justify-end pt-4">        <button
          type="button"
          onClick={handleSubmit}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-iti-primary hover:bg-iti-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-iti-primary transition-colors duration-200"
        >          <FaGraduationCap className="mr-2 -ml-1 h-4 w-4" />
          {initialData ? 'Update Education' : 'Add Education'}        </button>
      </div>
    </div>
  );
}

export default EducationForm;
