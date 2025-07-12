/**
 * CreateAchievement Page
 * Professional page for creating new achievements using the new structure
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import AchievementTypeSelector from '../components/common/AchievementTypeSelector';
import BaseAchievementForm from '../components/forms/BaseAchievementForm';
import { useAchievementForm } from '../hooks/useAchievementForm';
import { createAchievement } from '../../../services/achievementsService';
import { ACHIEVEMENT_TYPES } from '../types/achievementTypes';
import Navbar from '../../../components/Layout/Navbar';
import { useAuth } from '../../../contexts/AuthContext';
import Modal from '../../../components/UI/Modal';
import Alert from '../../../components/UI/Alert';

const CreateAchievement = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [notification, setNotification] = useState({ show: false, type: 'info', message: '' });
  const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);
  
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

      return;
    }

    try {
      const submissionData = getFormDataForSubmission();
      
      
      // Create the achievement using the API
      const result = await createAchievement(submissionData);
      
      if (result.success) {
        setNotification({ show: true, type: 'success', message: `${formData.type} achievement created successfully!` });
        setTimeout(() => navigate('/my-achievements'), 2000);
      } else {
        throw new Error(result.message || 'Failed to create achievement');
      }
      
    } catch (error) {
      console.error('Error creating achievement:', error);
      setNotification({ show: true, type: 'error', message: `Failed to create achievement: ${error.message}` });
    }
  };

  const handleCancel = () => {
    if (isDirty) {
      setConfirmModalOpen(true);
    } else {
      navigate(-1);
    }
  };

  return (
    <><Navbar /><div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50 to-red-50 pt-10 pb-10 px-4 relative overflow-hidden">
      <Alert
        show={notification.show}
        type={notification.type}
        message={notification.message}
        onClose={() => setNotification({ ...notification, show: false })}
      />
      <Modal
        isOpen={isConfirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        title="Confirm Navigation"
      >
        <p>You have unsaved changes. Are you sure you want to leave?</p>
        <div className="flex justify-end space-x-4 mt-4">
          <button
            onClick={() => setConfirmModalOpen(false)}
            className="px-4 py-2 rounded-lg text-gray-600 bg-gray-200 hover:bg-gray-300 transition-colors"
          >
            Stay
          </button>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 rounded-lg text-white bg-red-600 hover:bg-red-700 transition-colors"
          >
            Leave
          </button>
        </div>
      </Modal>
      {/* Spacer between navbar and header */}
      <div className="h-16"></div>

      {/* Header */}

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
        >
          {/* Form Header */}
          <div className="bg-gradient-to-r from-red-900 to-red-700 px-6 sm:px-8 py-5">
            <div className="flex items-center space-x-4">
              <img
                src={user?.profile?.profile_picture || "/avatar.png"}
                alt="User Avatar"
                className="w-10 h-10 rounded-full border-3 border-white object-cover shadow-md" />
              <div>
                <h2 className="text-lg font-bold text-white">Share Your Achievement</h2>
                <p className="text-slate-100 text-xs">Showcase your accomplishments with the community</p>
              </div>
            </div>
          </div>

          <motion.div className="p-5 sm:p-6">
            {/* Achievement Type Selector */}
            <motion.div
              className="mb-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <h2 className="text-base font-semibold text-gray-900 mb-3">What type of achievement would you like to share?</h2>
              <AchievementTypeSelector
                selectedType={formData.type}
                onTypeChange={handleTypeChange} />
            </motion.div>

            {/* Achievement Form */}
            <motion.form
              onSubmit={handleSubmit}
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              <BaseAchievementForm
                formData={formData}
                errors={errors}
                onInputChange={handleInputChange}
                onImageUpload={handleImageUpload}
                onRemoveImage={removeImage}
                onAddArrayItem={addArrayItem}
                onRemoveArrayItem={removeArrayItem}
                imagePreview={imagePreview} />

              {/* Action Buttons */}
              <motion.div
                className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.6 }}
              >
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
                      ? 'bg-slate-700 text-white hover:bg-slate-800 shadow-md hover:shadow-lg'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'}
                  `}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  <span>Publish Achievement</span>
                </button>
              </motion.div>
            </motion.form>
          </motion.div>
        </motion.div>
      </div>
    </div></>
  );
};

export default CreateAchievement;
