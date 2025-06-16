import React from 'react';
import { motion } from 'framer-motion';
import FormField from '../ui/FormField';
import FormSection from '../ui/FormSection';
import StepNavigation from '../ui/StepNavigation';
import { useFormValidation } from '../../hooks/useFormValidation';

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
 * Security Form Component
 * Third step of registration - upload profile picture and additional verification documents
 */
const SecurityForm = ({ 
  formData, 
  errors = {},
  onChange, 
  onFileChange,
  onNext, 
  onPrev,
  onValidation,
  isSubmitting = false 
}) => {
  const { validateStep } = useFormValidation();

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    
    // Validate current step
    const validation = await validateStep(formData, 3, formData.role);
    
    if (onValidation) {
      onValidation(validation.errors);
    }
    
    // Always call onNext - let parent decide what to do based on validation
    if (onNext) {
      onNext(validation.isValid);
    }
  };

  const handleNextClick = () => {
    handleSubmit();
  };
  const handleFileUpload = (event, fieldName) => {
    if (!event || !event.target) {
      return;
    }
    
    const file = event.target.files[0];
    if (file) {
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        if (onValidation) {
          onValidation({ [fieldName]: 'File size must be less than 5MB' });
        }
        return;
      }
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        if (onValidation) {
          onValidation({ [fieldName]: 'Please select an image file' });
        }
        return;
      }
      
      // Create a proper event-like object for the parent handler
      const syntheticEvent = {
        target: {
          name: fieldName,
          files: [file]
        }
      };
      
      if (onFileChange) {
        onFileChange(syntheticEvent);
      }
    }
  };

  const FileUploadField = ({ 
    id, 
    label, 
    fieldName, 
    file, 
    error, 
    required = false,
    helpText 
  }) => (
    <motion.div variants={itemVariants} className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      <div className="flex flex-col items-center justify-center bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-6 transition-colors hover:border-[#901b20] hover:bg-gray-100">
        <input
          id={id}
          name={fieldName}
          type="file"
          accept="image/*"
          onChange={(e) => handleFileUpload(e, fieldName)}
          className="hidden"
        />
        <label
          htmlFor={id}
          className="cursor-pointer flex flex-col items-center"
        >
          <svg className="w-12 h-12 text-gray-400 mb-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 48 48">
            <rect x="8" y="12" width="32" height="24" rx="4" fill="#fff" stroke="currentColor" />
            <path d="M16 28l6-6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="24" cy="20" r="2" fill="currentColor" />
          </svg>
          <span className="text-[#901b20] font-medium text-sm">
            Click to select or drag & drop
          </span>
          <span className="text-gray-500 text-xs mt-1">
            PNG, JPG, JPEG up to 5MB
          </span>
        </label>
        
        {file && (
          <div className="mt-4 flex flex-col items-center">
            <img
              src={URL.createObjectURL(file)}
              alt={`${label} Preview`}
              className="h-32 w-32 object-cover rounded-lg shadow border mb-2"
            />
            <span className="text-xs text-gray-600 text-center">
              {file.name}
            </span>
          </div>
        )}
      </div>
      
      {helpText && (
        <p className="text-xs text-gray-500">{helpText}</p>
      )}
      
      {error && (
        <p className="text-xs text-red-600">{error}</p>
      )}
    </motion.div>
  );

  const renderStudentAlumniFields = () => (
    <>      {/* Profile Picture - Required for all */}
      <FileUploadField
        id="profilePicture"
        label="Profile Picture"
        fieldName="profile_picture"
        file={formData.profile_picture}
        error={errors.profile_picture}
        helpText="Upload a profile picture for your account"
        required
      />{/* ID Photos for verification - Optional for students/alumni */}      <FileUploadField
        id="idPhotoFront"
        label="ID Photo (Front)"
        fieldName="idPhotoFront"
        file={formData.idPhotoFront}
        error={errors.idPhotoFront}
        helpText="Upload the front of your national ID or student ID for verification"
        required
      />

      <FileUploadField
        id="idPhotoBack"
        label="ID Photo (Back)"
        fieldName="idPhotoBack"
        file={formData.idPhotoBack}
        error={errors.idPhotoBack}
        helpText="Upload the back of your national ID or student ID for verification"
        required
      />
    </>
  );

  const renderCompanyFields = () => (
    <>
      {/* Company Logo */}      <FileUploadField
        id="companyLogo"
        label="Company Logo"
        fieldName="company_logo"
        file={formData.company_logo}
        error={errors.company_logo}
        helpText="Upload your company logo"
        required
      />
    </>
  );

  const getRoleSpecificContent = () => {    switch (formData.role) {
      case 'student':
        return {
          title: 'Additional Information',
          description: 'Upload your profile picture and any optional verification documents',
          fields: renderStudentAlumniFields()
        };
      case 'alumni':
        return {
          title: 'Additional Information', 
          description: 'Upload your profile picture and any optional verification documents',
          fields: renderStudentAlumniFields()
        };
      case 'company':
        return {
          title: 'Company Assets',
          description: 'Upload your company logo and any additional documentation',
          fields: renderCompanyFields()
        };
      default:
        return {
          title: 'Additional Information',
          description: 'Please select an account type in the first step',
          fields: null
        };
    }
  };

  const content = getRoleSpecificContent();

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <FormSection
        title={content.title}
        description={content.description}
      >
        <motion.div variants={containerVariants} className="space-y-6">
          {content.fields}
          
          {/* Additional Information - For all user types */}
          <motion.div variants={itemVariants}>
            <FormField
              label="Additional Information"
              name="additional_info"
              type="textarea"
              value={formData.additional_info}
              onChange={onChange}
              error={errors.additional_info}
              placeholder="Any additional information you'd like to share..."
              helpText="Share any additional information about yourself or your background"
              rows={4}
            />
          </motion.div>
            {formData.role !== 'company' && (
            <motion.div variants={itemVariants} className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">                  <h3 className="text-sm font-medium text-blue-800">
                    Verification Required
                  </h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <p>
                      ID photos are required for account verification and enhanced security. 
                      Please upload clear images of your ID card (front and back).
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </FormSection>

      {/* Navigation */}
      <motion.div variants={itemVariants}>
        <StepNavigation
          canGoPrevious={true}
          canGoNext={true}
          isSubmitting={isSubmitting}
          onPrevious={onPrev}
          onNext={handleNextClick}
          nextLabel="Continue"
        />
      </motion.div>
    </motion.form>
  );
};

export default SecurityForm;
