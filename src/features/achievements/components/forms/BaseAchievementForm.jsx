/**
 * BaseAchievementForm Component
 * Dynamic form component that renders fields based on achievement type
 */

import React from 'react';
import { motion } from 'framer-motion';
import { ACHIEVEMENT_TYPES, ACHIEVEMENT_CATEGORIES } from '../../types/achievementTypes';
import { EMPLOYMENT_TYPES } from '../../utils/achievementConstants';

const BaseAchievementForm = ({
  formData,
  errors,
  onInputChange,
  onImageUpload,
  onRemoveImage,
  onAddArrayItem,
  onRemoveArrayItem,
  imagePreview
}) => {
  const achievementType = formData.type;
  const category = ACHIEVEMENT_CATEGORIES[achievementType];

  // Common field components
  const renderTextField = (name, label, placeholder = '', required = false, type = 'text') => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-1"
    >
      <label className="block text-xs font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={formData[name] || ''}
        onChange={onInputChange}
        placeholder={placeholder}
        className={`
          w-full px-3 py-1.5 border border-gray-300 rounded-md 
          focus:outline-none focus:ring-1 focus:ring-[#901b20] focus:border-transparent
          transition-all duration-200 text-xs
          ${errors[name] ? 'border-red-500 bg-red-50' : 'bg-white'}
        `}
      />
      {errors[name] && (
        <p className="text-red-600 text-xs mt-0.5">{errors[name]}</p>
      )}
    </motion.div>
  );

  const renderTextArea = (name, label, placeholder = '', required = false, rows = 3) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-1"
    >
      <label className="block text-xs font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <textarea
        name={name}
        rows={rows}
        value={formData[name] || ''}
        onChange={onInputChange}
        placeholder={placeholder}
        className={`
          w-full px-3 py-1.5 border border-gray-300 rounded-md 
          focus:outline-none focus:ring-1 focus:ring-[#901b20] focus:border-transparent
          transition-all duration-200 text-xs resize-y
          ${errors[name] ? 'border-red-500 bg-red-50' : 'bg-white'}
        `}
      />
      {errors[name] && (
        <p className="text-red-600 text-xs mt-0.5">{errors[name]}</p>
      )}
    </motion.div>
  );

  const renderSelect = (name, label, options, required = false) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-1"
    >
      <label className="block text-xs font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        name={name}
        value={formData[name] || ''}
        onChange={onInputChange}
        className={`
          w-full px-3 py-1.5 border border-gray-300 rounded-md 
          focus:outline-none focus:ring-1 focus:ring-[#901b20] focus:border-transparent
          transition-all duration-200 text-xs bg-white
          ${errors[name] ? 'border-red-500 bg-red-50' : ''}
        `}
      >
        <option value="">Select {label}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {errors[name] && (
        <p className="text-red-600 text-xs mt-0.5">{errors[name]}</p>
      )}
    </motion.div>
  );

  const renderImageUpload = () => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-1"
    >
      <label className="block text-xs font-medium text-gray-700">Image</label>
      
      {imagePreview ? (
        <div className="relative">
          <img
            src={imagePreview}
            alt="Achievement preview"
            className="w-full h-40 object-cover rounded-md border border-gray-300"
          />
          <button
            type="button"
            onClick={onRemoveImage}
            className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-gray-300 border-dashed rounded-md cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
          <div className="flex flex-col items-center justify-center pt-4 pb-4">
            <svg className="w-6 h-6 mb-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="mb-1 text-xs text-gray-500">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500">PNG, JPG or WEBP (MAX. 5MB)</p>
          </div>
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) onImageUpload(file);
            }}
          />
        </label>
      )}
    </motion.div>
  );

  // Render type-specific fields
  const renderTypeSpecificFields = () => {
    switch (achievementType) {
      case ACHIEVEMENT_TYPES.PROJECT:
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {renderTextField('start_date', 'Start Date', '', true, 'date')}
              {renderTextField('end_date', 'End Date', '', false, 'date')}
              {renderTextField('url', 'Project URL', 'https://example.com')}
            </div>
          </>
        );

      case ACHIEVEMENT_TYPES.JOB:
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {renderTextField('organization', 'Organization', 'Company Name', true)}
              {renderTextField('start_date', 'Start Date', '', true, 'date')}
            </div>
          </>
        );

      case ACHIEVEMENT_TYPES.CERTIFICATE:
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {renderTextField('start_date', 'Issue Date', '', true, 'date')}
              {renderTextField('organization', 'Issuing Organization', 'Company/Institution Name', true)}
              {renderTextField('url', 'Certificate URL', 'https://example.com')}
            </div>
          </>
        );

      case ACHIEVEMENT_TYPES.AWARD:
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {renderTextField('start_date', 'Received Date', '', true, 'date')}
              {renderTextField('organization', 'Awarding Organization', 'Company/Institution Name', true)}
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {/* Common Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {renderTextField('title', 'Title', 'Enter achievement title', true)}
        
      </div>
      
      {renderTextArea(
        'description', 
        'Description', 
        'Describe your achievement...', 
        achievementType === ACHIEVEMENT_TYPES.PROJECT || achievementType === ACHIEVEMENT_TYPES.CERTIFICATE, // Required for project and certificate only
        3
      )}

      {/* Type-specific Fields */}
      <div className="border-t border-gray-200 pt-3 mt-2">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Achievement Details</h3>
        {renderTypeSpecificFields()}
      </div>

      {/* Image Upload */}
      {/* <div className="border-t border-gray-200 pt-3 mt-2">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Media</h3>
        {renderImageUpload()}
      </div> */}
    </div>
  );
};

export default BaseAchievementForm;
