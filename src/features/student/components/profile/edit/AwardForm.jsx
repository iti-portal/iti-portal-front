// src/features/student/components/profile/edit/AwardForm.jsx

import React, { useState } from 'react';
import { FaTrophy } from 'react-icons/fa';

function AwardForm({ onSubmit, initialData = null }) {
  const [formData, setFormData] = useState({
    title: initialData?.title || initialData?.name || '',
    organization: initialData?.organization || initialData?.issuingBody || '',
    achieved_at: initialData?.achieved_at || initialData?.dateIssued || '',
    description: initialData?.description || '',
    certificate_url: initialData?.certificate_url || initialData?.url || '',
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
    
    if (!formData.title.trim()) {
      newErrors.title = 'Award title is required';
    }
    
    if (!formData.organization.trim()) {
      newErrors.organization = 'Organization is required';
    }
    
    if (!formData.achieved_at) {
      newErrors.achieved_at = 'Date awarded is required';
    }

    // Validate URL format if provided
    if (formData.certificate_url && formData.certificate_url.trim()) {
      const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
      if (!urlPattern.test(formData.certificate_url.trim())) {
        newErrors.certificate_url = 'Please enter a valid URL';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent event bubbling to parent form
    
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 mb-4">
        <FaTrophy className="text-yellow-600 h-5 w-5" />
        <h3 className="text-lg font-semibold text-gray-800">
          {initialData ? 'Edit Award' : 'Add New Award'}
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Award Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Award Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 ${
              errors.title ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="e.g., Employee of the Year, Dean's List"
          />
          {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
        </div>

        {/* Organization */}
        <div>
          <label htmlFor="organization" className="block text-sm font-medium text-gray-700 mb-1">
            Organization *
          </label>
          <input
            type="text"
            id="organization"
            name="organization"
            value={formData.organization}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 ${
              errors.organization ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="e.g., Microsoft, University of Cairo"
          />
          {errors.organization && <p className="mt-1 text-sm text-red-600">{errors.organization}</p>}
        </div>

        {/* Date Awarded */}
        <div>
          <label htmlFor="achieved_at" className="block text-sm font-medium text-gray-700 mb-1">
            Date Awarded *
          </label>
          <input
            type="date"
            id="achieved_at"
            name="achieved_at"
            value={formData.achieved_at ? formData.achieved_at.split('T')[0] : ''}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 ${
              errors.achieved_at ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.achieved_at && <p className="mt-1 text-sm text-red-600">{errors.achieved_at}</p>}
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
            placeholder="Brief description of the award or achievement..."
          />
        </div>

        {/* Award URL */}
        <div>
          <label htmlFor="certificate_url" className="block text-sm font-medium text-gray-700 mb-1">
            Award URL (Optional)
          </label>
          <input
            type="url"
            id="certificate_url"
            name="certificate_url"
            value={formData.certificate_url}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 ${
              errors.certificate_url ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="https://example.com/award"
          />
          {errors.certificate_url && <p className="mt-1 text-sm text-red-600">{errors.certificate_url}</p>}
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-colors duration-200"
          >
            {initialData ? 'Update Award' : 'Add Award'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AwardForm;
