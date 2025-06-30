// src/features/student/components/profile/edit/CertificateForm.jsx

import React, { useState } from 'react';
import { FaCertificate } from 'react-icons/fa';

function CertificateForm({ onSubmit, initialData = null }) {
  const [formData, setFormData] = useState({
    title: initialData?.title || initialData?.name || '',
    organization: initialData?.organization || initialData?.issuingBody || '',
    achieved_at: initialData?.achieved_at || initialData?.dateIssued || '',
    certificate_url: initialData?.certificate_url || initialData?.url || '',
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
    
    if (!formData.title.trim()) {
      newErrors.title = 'Certificate title is required';
    }
    
    if (!formData.organization.trim()) {
      newErrors.organization = 'Organization is required';
    }
    
    if (!formData.achieved_at) {
      newErrors.achieved_at = 'Date achieved is required';
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
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Certificate Title *
        </label>
        <input
          id="title"
          name="title"
          type="text"
          value={formData.title}
          onChange={handleChange}
          className={`block w-full px-3 py-2 border ${
            errors.title ? 'border-red-300 bg-red-50' : 'border-gray-300'
          } rounded-md shadow-sm focus:outline-none focus:ring-iti-primary focus:border-iti-primary sm:text-sm`}
          placeholder="e.g., AWS Certified Solutions Architect"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title}</p>
        )}
      </div>

      <div>
        <label htmlFor="organization" className="block text-sm font-medium text-gray-700 mb-1">
          Issuing Organization *
        </label>
        <input
          id="organization"
          name="organization"
          type="text"
          value={formData.organization}
          onChange={handleChange}
          className={`block w-full px-3 py-2 border ${
            errors.organization ? 'border-red-300 bg-red-50' : 'border-gray-300'
          } rounded-md shadow-sm focus:outline-none focus:ring-iti-primary focus:border-iti-primary sm:text-sm`}
          placeholder="e.g., Amazon Web Services, Microsoft, Google"
        />
        {errors.organization && (
          <p className="mt-1 text-sm text-red-600">{errors.organization}</p>
        )}
      </div>

      <div>
        <label htmlFor="achieved_at" className="block text-sm font-medium text-gray-700 mb-1">
          Date Achieved *
        </label>
        <input
          id="achieved_at"
          name="achieved_at"
          type="date"
          value={formData.achieved_at ? formData.achieved_at.split('T')[0] : ''}
          onChange={handleChange}
          className={`block w-full px-3 py-2 border ${
            errors.achieved_at ? 'border-red-300 bg-red-50' : 'border-gray-300'
          } rounded-md shadow-sm focus:outline-none focus:ring-iti-primary focus:border-iti-primary sm:text-sm`}
        />
        {errors.achieved_at && (
          <p className="mt-1 text-sm text-red-600">{errors.achieved_at}</p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description <span className="text-sm text-gray-500">(optional)</span>
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-iti-primary focus:border-iti-primary sm:text-sm"
          placeholder="Brief description of the certificate..."
        />
      </div>

      <div>
        <label htmlFor="certificate_url" className="block text-sm font-medium text-gray-700 mb-1">
          Certificate URL <span className="text-sm text-gray-500">(optional)</span>
        </label>
        <input
          id="certificate_url"
          name="certificate_url"
          type="url"
          value={formData.certificate_url}
          onChange={handleChange}
          className={`block w-full px-3 py-2 border ${
            errors.certificate_url ? 'border-red-300 bg-red-50' : 'border-gray-300'
          } rounded-md shadow-sm focus:outline-none focus:ring-iti-primary focus:border-iti-primary sm:text-sm`}
          placeholder="https://www.credly.com/badges/..."
        />
        {errors.certificate_url && (
          <p className="mt-1 text-sm text-red-600">{errors.certificate_url}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          Link to your digital badge or certificate verification page
        </p>
      </div>

      <div className="flex justify-end pt-4">
        <button
          type="button"
          onClick={handleSubmit}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-iti-primary hover:bg-iti-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-iti-primary transition-colors duration-200"
        >
          <FaCertificate className="mr-2 -ml-1 h-4 w-4" />
          {initialData ? 'Update Certificate' : 'Add Certificate'}
        </button>
      </div>
    </div>
  );
}

export default CertificateForm;
