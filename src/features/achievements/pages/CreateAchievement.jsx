/**
 * CreateAchievement Page
 * Professional page for creating new achievements using the new structure
 */

import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../../components/Layout/Navbar';
import AchievementTypeSelector from '../components/common/AchievementTypeSelector';
import BaseAchievementForm from '../components/forms/BaseAchievementForm';
import { useAchievementForm } from '../hooks/useAchievementForm';
import { createAchievement } from '../../../services/achievementsService';
import { ACHIEVEMENT_TYPES } from '../types/achievementTypes';

const CreateAchievement = () => {
  const navigate = useNavigate();
  
  const {
    formData,
    errors,
    isValid,
    isDirty,
    imagePreview,
    handleInputChange,
    handleTypeChange,
    handleImageUpload,
    removeImage,
    addArrayItem,
    removeArrayItem,
    getFormDataForSubmission
  } = useAchievementForm(null, ACHIEVEMENT_TYPES.PROJECT);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isValid) {
      console.log('Form validation failed:', errors);
      return;
    }

    try {
      const submissionData = getFormDataForSubmission();
      
      
      // Create the achievement using the API
      const result = await createAchievement(submissionData);
      
      if (result.success) {
        // Show success message
        alert(`${formData.type} achievement created successfully!`);
        
        // Navigate back to my achievements page
        navigate('/my-achievements');
      } else {
        throw new Error(result.message || 'Failed to create achievement');
      }
      
    } catch (error) {
      console.error('Error creating achievement:', error);
      alert(`Failed to create achievement: ${error.message}`);
    }
  };

  const handleCancel = () => {
    if (isDirty) {
      const confirmLeave = window.confirm('You have unsaved changes. Are you sure you want to leave?');
      if (!confirmLeave) return;
    }
    navigate(-1);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#901b20] to-[#a83236] px-6 sm:px-8 py-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <img
                    src="/avatar.png"
                    alt="User Avatar"
                    className="w-10 h-10 rounded-full border-3 border-white object-cover shadow-md"
                  />
                  <div>
                    <h1 className="text-lg font-bold text-white">Share Your Achievement</h1>
                    <p className="text-red-100 text-xs">Showcase your accomplishments with the community</p>
                  </div>
                </div>
                
                <button
                  onClick={handleCancel}
                  className="text-white hover:text-red-100 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-5 sm:p-6">
              {/* Achievement Type Selector */}
              <div className="mb-6">
                <h2 className="text-base font-semibold text-gray-900 mb-3">What type of achievement would you like to share?</h2>
                <AchievementTypeSelector
                  selectedType={formData.type}
                  onTypeChange={handleTypeChange}
                />
              </div>

              {/* Achievement Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <BaseAchievementForm
                  formData={formData}
                  errors={errors}
                  onInputChange={handleInputChange}
                  onImageUpload={handleImageUpload}
                  onRemoveImage={removeImage}
                  onAddArrayItem={addArrayItem}
                  onRemoveArrayItem={removeArrayItem}
                  imagePreview={imagePreview}
                />                {/* Action Buttons */}
                <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  
                  <button
                    type="submit"
                    disabled={!isValid}
                    className={`
                      px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 
                      flex items-center space-x-1.5
                      ${isValid 
                        ? 'bg-[#901b20] text-white hover:bg-[#a83236] shadow-md hover:shadow-lg' 
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }
                    `}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    <span>Publish Achievement</span>
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default CreateAchievement;
