// src/features/student/components/profile/edit/CertificateForm.jsx

import React, { useState } from 'react';
import { FaCertificate } from 'react-icons/fa';

function CertificateForm({ onSubmit, initialData = null }) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    issuingBody: initialData?.issuingBody || '',
    dateIssued: initialData?.dateIssued || '',
    url: initialData?.url || '',
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
    
    if (!formData.name.trim()) {
      newErrors.name = 'Certificate name is required';
    }
    
    if (!formData.issuingBody.trim()) {
      newErrors.issuingBody = 'Issuing body is required';
    }
    
    if (!formData.dateIssued) {
      newErrors.dateIssued = 'Date issued is required';
    }

    // Validate URL format if provided
    if (formData.url && formData.url.trim()) {
      const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
      if (!urlPattern.test(formData.url.trim())) {
        newErrors.url = 'Please enter a valid URL';
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
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Certificate Name *
        </label>
        <input
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          className={`block w-full px-3 py-2 border ${
            errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'
          } rounded-md shadow-sm focus:outline-none focus:ring-iti-primary focus:border-iti-primary sm:text-sm`}
          placeholder="e.g., AWS Certified Solutions Architect"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name}</p>
        )}
      </div>

      <div>
        <label htmlFor="issuingBody" className="block text-sm font-medium text-gray-700 mb-1">
          Issuing Organization *
        </label>
        <input
          id="issuingBody"
          name="issuingBody"
          type="text"
          value={formData.issuingBody}
          onChange={handleChange}
          className={`block w-full px-3 py-2 border ${
            errors.issuingBody ? 'border-red-300 bg-red-50' : 'border-gray-300'
          } rounded-md shadow-sm focus:outline-none focus:ring-iti-primary focus:border-iti-primary sm:text-sm`}
          placeholder="e.g., Amazon Web Services, Microsoft, Google"
        />
        {errors.issuingBody && (
          <p className="mt-1 text-sm text-red-600">{errors.issuingBody}</p>
        )}
      </div>

      <div>
        <label htmlFor="dateIssued" className="block text-sm font-medium text-gray-700 mb-1">
          Date Issued *
        </label>
        <input
          id="dateIssued"
          name="dateIssued"
          type="date"
          value={formData.dateIssued}
          onChange={handleChange}
          className={`block w-full px-3 py-2 border ${
            errors.dateIssued ? 'border-red-300 bg-red-50' : 'border-gray-300'
          } rounded-md shadow-sm focus:outline-none focus:ring-iti-primary focus:border-iti-primary sm:text-sm`}
        />
        {errors.dateIssued && (
          <p className="mt-1 text-sm text-red-600">{errors.dateIssued}</p>
        )}
      </div>

      <div>
        <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
          Credential URL <span className="text-sm text-gray-500">(optional)</span>
        </label>
        <input
          id="url"
          name="url"
          type="url"
          value={formData.url}
          onChange={handleChange}
          className={`block w-full px-3 py-2 border ${
            errors.url ? 'border-red-300 bg-red-50' : 'border-gray-300'
          } rounded-md shadow-sm focus:outline-none focus:ring-iti-primary focus:border-iti-primary sm:text-sm`}
          placeholder="https://www.credly.com/badges/..."
        />
        {errors.url && (
          <p className="mt-1 text-sm text-red-600">{errors.url}</p>
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
