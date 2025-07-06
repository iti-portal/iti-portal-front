/**
 * CreateAchievement Page
 * Professional page for creating new achievements using the new structure
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../../components/Layout/Navbar';
import AchievementTypeSelector from '../components/common/AchievementTypeSelector';
import BaseAchievementForm from '../components/forms/BaseAchievementForm';
import { useAchievementForm } from '../hooks/useAchievementForm';
import { createAchievement } from '../../../services/achievementsService';
import { ACHIEVEMENT_TYPES } from '../types/achievementTypes';
import { useAuth } from '../../../contexts/AuthContext';

const CreateAchievement = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [notification, setNotification] = useState({ show: false, type: 'info', message: '', title: '' });
  
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

  // Notification helpers
  const showNotification = (message, type = 'info', title = '') => {
    setNotification({ show: true, type, message, title });
    setTimeout(() => {
      setNotification({ show: false, type: 'info', message: '', title: '' });
    }, 5000);
  };

  const hideNotification = () => {
    setNotification({ show: false, type: 'info', message: '', title: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isValid) {

      return;
    }

    try {
      const submissionData = getFormDataForSubmission();
      
      
      // Create the achievement using the API
      const result = await createAchievement(submissionData);
      
      if (result.success) {
        // Show success message
        showNotification(`${formData.type} achievement created successfully!`, 'success', 'Achievement Created');
        
        // Navigate back to my achievements page after a short delay
        setTimeout(() => {
          navigate('/my-achievements');
        }, 2000);
      } else {
        throw new Error(result.message || 'Failed to create achievement');
      }
      
    } catch (error) {
      console.error('Error creating achievement:', error);
      showNotification(`Failed to create achievement: ${error.message}`, 'error', 'Creation Failed');
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
      
      {/* Custom Notification Component */}
      {notification.show && (
        <div className="fixed top-4 right-4 z-[60] max-w-md">
          <div className={`rounded-lg shadow-lg p-4 border-l-4 ${
            notification.type === 'error' ? 'bg-red-50 border-red-500 text-red-800' :
            notification.type === 'warning' ? 'bg-yellow-50 border-yellow-500 text-yellow-800' :
            notification.type === 'success' ? 'bg-green-50 border-green-500 text-green-800' :
            'bg-blue-50 border-blue-500 text-blue-800'
          }`}>
            <div className="flex items-start">
              <div className="flex-shrink-0">
                {notification.type === 'error' && (
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                )}
                {notification.type === 'warning' && (
                  <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                )}
                {notification.type === 'success' && (
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
                {notification.type === 'info' && (
                  <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <div className="ml-3 flex-1">
                {notification.title && (
                  <h3 className="text-sm font-medium mb-1">{notification.title}</h3>
                )}
                <p className="text-sm">{notification.message}</p>
              </div>
              <div className="flex-shrink-0 ml-4">
                <button
                  onClick={hideNotification}
                  className={`inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    notification.type === 'error' ? 'text-red-500 hover:bg-red-100 focus:ring-red-600' :
                    notification.type === 'warning' ? 'text-yellow-500 hover:bg-yellow-100 focus:ring-yellow-600' :
                    notification.type === 'success' ? 'text-green-500 hover:bg-green-100 focus:ring-green-600' :
                    'text-blue-500 hover:bg-blue-100 focus:ring-blue-600'
                  }`}
                >
                  <span className="sr-only">Dismiss</span>
                  <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto py-6">
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
                    src={user?.profile?.profile_picture || "/avatar.png"}
                    alt="User Avatar"
                    className="w-10 h-10 rounded-full border-2 border-white object-cover shadow-md hover:border-red-100 transition-colors cursor-pointer"
                    onClick={() => navigate('/student/profile')}
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
