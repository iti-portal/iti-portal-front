// src/features/student/components/profile/edit/ExperienceForm.jsx

import React, { useState } from 'react';
import { FaBriefcase } from 'react-icons/fa';

function ExperienceForm({ onSubmit, initialData = null }) {
  // Helper function to format date for input field
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    
    // Handle different date formats
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '';
      
      // Format as YYYY-MM-DD for date input
      return date.toISOString().split('T')[0];
    } catch (error) {
      console.log('Date formatting error:', error);
      return '';
    }
  };

  const [formData, setFormData] = useState({
    companyName: initialData?.companyName || initialData?.company_name || '',
    position: initialData?.position || '',
    startDate: formatDateForInput(initialData?.startDate || initialData?.start_date),
    endDate: formatDateForInput(initialData?.endDate || initialData?.end_date),
    isCurrent: initialData?.isCurrent || initialData?.is_current || false,
    description: initialData?.description || '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData({ 
      ...formData, 
      [name]: newValue,
      // Clear end date if current position is checked
      ...(name === 'isCurrent' && checked ? { endDate: '' } : {})
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
    
    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Company name is required';
    }
    
    if (!formData.position.trim()) {
      newErrors.position = 'Position is required';
    }
    
    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }
    
    if (!formData.isCurrent && !formData.endDate) {
      newErrors.endDate = 'End date is required for past positions';
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
    <div className="space-y-6">
      <div>
        <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">
          Company Name *
        </label>
        <input
          id="companyName"
          name="companyName"
          type="text"
          value={formData.companyName}
          onChange={handleChange}
          className={`block w-full px-3 py-2 border ${
            errors.companyName ? 'border-red-300 bg-red-50' : 'border-gray-300'
          } rounded-md shadow-sm focus:outline-none focus:ring-iti-primary focus:border-iti-primary sm:text-sm`}
          placeholder="e.g., XYZ Technology"
        />
        {errors.companyName && (
          <p className="mt-1 text-sm text-red-600">{errors.companyName}</p>
        )}
      </div>

      <div>
        <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-1">
          Position / Title *
        </label>
        <input
          id="position"
          name="position"
          type="text"
          value={formData.position}
          onChange={handleChange}
          className={`block w-full px-3 py-2 border ${
            errors.position ? 'border-red-300 bg-red-50' : 'border-gray-300'
          } rounded-md shadow-sm focus:outline-none focus:ring-iti-primary focus:border-iti-primary sm:text-sm`}
          placeholder="e.g., Frontend Developer"
        />
        {errors.position && (
          <p className="mt-1 text-sm text-red-600">{errors.position}</p>
        )}
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
            End Date {!formData.isCurrent && <span className="text-red-500">*</span>}
          </label>
          <input
            id="endDate"
            name="endDate"
            type="date"
            value={formData.endDate}
            onChange={handleChange}
            disabled={formData.isCurrent}
            className={`block w-full px-3 py-2 border ${
              errors.endDate ? 'border-red-300 bg-red-50' : 'border-gray-300'
            } rounded-md shadow-sm focus:outline-none focus:ring-iti-primary focus:border-iti-primary sm:text-sm ${
              formData.isCurrent ? 'bg-gray-100 cursor-not-allowed' : ''
            }`}
          />
          {errors.endDate && (
            <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>
          )}
        </div>
      </div>

      <div className="flex items-start">
        <div className="flex items-center h-5">
          <input
            id="isCurrent"
            name="isCurrent"
            type="checkbox"
            checked={formData.isCurrent}
            onChange={handleChange}
            className="h-4 w-4 text-iti-primary focus:ring-iti-primary border-gray-300 rounded"
          />
        </div>
        <div className="ml-3 text-sm">
          <label htmlFor="isCurrent" className="font-medium text-gray-700">
            I currently work here
          </label>
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
          placeholder="Describe your responsibilities, achievements, and skills used in this role"
        ></textarea>
      </div>      <div className="flex justify-end pt-4">
        <button
          type="button"
          onClick={handleSubmit}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-iti-primary hover:bg-iti-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-iti-primary transition-colors duration-200"
        >          <FaBriefcase className="mr-2 -ml-1 h-4 w-4" />
          {initialData ? 'Update Experience' : 'Add Experience'}
        </button>
      </div>
    </div>
  );
}

export default ExperienceForm;
