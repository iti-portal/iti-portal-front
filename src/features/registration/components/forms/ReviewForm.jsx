import React from 'react';
import { motion } from 'framer-motion';
import FormSection from '../ui/FormSection';
import StepNavigation from '../ui/StepNavigation';
import { getAccountTypeLabel } from '../../constants/accountTypes';

const containerVariants = {
  visible: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

/**
 * Review Form Component
 * Final step - review and submit registration
 */
const ReviewForm = ({ 
  formData, 
  errors = {},
  onPrev,
  onSubmit,
  isSubmitting = false,
  submitError = ''
}) => {

  const handleSubmit = (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    
    if (onSubmit) {
      onSubmit();
    }
  };

  const renderAccountInfo = () => (
    <div className="space-y-3">
      <h4 className="font-medium text-gray-900">Account Information</h4>
      <div className="bg-gray-50 p-4 rounded-lg space-y-2">
        <div className="flex justify-between">
          <span className="text-sm font-medium text-gray-600">Account Type:</span>
          <span className="text-sm text-gray-900">{getAccountTypeLabel(formData.role)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm font-medium text-gray-600">Email:</span>
          <span className="text-sm text-gray-900">{formData.email}</span>
        </div>
      </div>
    </div>
  );

  const renderPersonalInfo = () => {
    if (formData.role === 'company') {
      return (
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">Company Information</h4>
          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <div className="flex justify-between">
              <span className="text-sm font-medium text-gray-600">Company Name:</span>
              <span className="text-sm text-gray-900">{formData.company_name}</span>
            </div>
            {formData.location && (
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-600">Location:</span>
                <span className="text-sm text-gray-900">{formData.location}</span>
              </div>
            )}
            {formData.industry && (
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-600">Industry:</span>
                <span className="text-sm text-gray-900">{formData.industry}</span>
              </div>
            )}
            {formData.company_size && (
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-600">Company Size:</span>
                <span className="text-sm text-gray-900">{formData.company_size}</span>
              </div>
            )}
            {formData.website && (
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-600">Website:</span>
                <span className="text-sm text-gray-900">
                  <a href={formData.website} target="_blank" rel="noopener noreferrer" className="text-[#901b20] hover:underline">
                    {formData.website}
                  </a>
                </span>
              </div>
            )}
            {formData.description && (
              <div className="pt-2">
                <span className="text-sm font-medium text-gray-600">Description:</span>
                <p className="text-sm text-gray-900 mt-1">{formData.description}</p>
              </div>
            )}
          </div>
        </div>
      );
    } else {
      return (
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">Personal Information</h4>
          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <div className="flex justify-between">
              <span className="text-sm font-medium text-gray-600">Name:</span>
              <span className="text-sm text-gray-900">{formData.firstName} {formData.lastName}</span>
            </div>
            {formData.username && (
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-600">Username:</span>
                <span className="text-sm text-gray-900">@{formData.username}</span>
              </div>
            )}
            {formData.phone && (
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-600">Phone:</span>
                <span className="text-sm text-gray-900">{formData.phone}</span>
              </div>
            )}
            {formData.branch && (
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-600">ITI Branch:</span>
                <span className="text-sm text-gray-900">{formData.branch}</span>
              </div>
            )}
            {formData.program && (
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-600">Program:</span>
                <span className="text-sm text-gray-900">
                  {formData.program === 'ptp' ? 'PTP (Professional Training Program)' : 
                   formData.program === 'itp' ? 'ITP (Intensive Training Program)' : 
                   formData.program}
                </span>
              </div>
            )}
            {(formData.role === 'student' || formData.role === 'alumni') && (
              <>
                {formData.track && (
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-600">Track:</span>
                    <span className="text-sm text-gray-900">{formData.track}</span>
                  </div>
                )}
                {formData.intake && (
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-600">Intake:</span>
                    <span className="text-sm text-gray-900">{formData.intake}</span>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      );
    }
  };

  const renderSecurityInfo = () => {
    if (formData.role === 'company') return null;
    
    return (
      <div className="space-y-3">
        <h4 className="font-medium text-gray-900">Profile Information</h4>
        <div className="bg-gray-50 p-4 rounded-lg space-y-2">
          {formData.profile_picture && (
            <div className="flex justify-between">
              <span className="text-sm font-medium text-gray-600">Profile Picture:</span>
              <span className="text-sm text-gray-900">{formData.profile_picture.name}</span>
            </div>
          )}
          {!formData.profile_picture && (
            <p className="text-sm text-gray-500 italic">No profile picture uploaded</p>
          )}
        </div>
      </div>
    );
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <FormSection
        title="Review Your Information"
        description="Please review your information before submitting your registration"
      >
        <motion.div variants={itemVariants} className="space-y-6">
          {/* Submit Error */}
          {submitError && (
            <div className="p-4 border border-red-300 rounded-md bg-red-50">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Registration Error
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    {submitError}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Account Information */}
          {renderAccountInfo()}

          {/* Personal/Company Information */}
          {renderPersonalInfo()}

          {/* Security Information */}
          {renderSecurityInfo()}

          {/* Terms and Conditions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  Before You Submit
                </h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>
                    By submitting this registration, you agree to the ITI Portal terms and conditions. 
                    You will receive an email verification link to complete your account setup.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </FormSection>

      {/* Navigation */}
      <motion.div variants={itemVariants}>
        <StepNavigation
          canGoPrevious={true}
          canGoNext={true}
          isSubmitting={isSubmitting}
          onPrevious={onPrev}
          onNext={handleSubmit}
          nextLabel={isSubmitting ? 'Submitting...' : 'Submit Registration'}
          isLastStep={true}
        />
      </motion.div>
    </motion.form>
  );
};

export default ReviewForm;
