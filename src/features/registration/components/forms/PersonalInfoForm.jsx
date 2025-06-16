import React from 'react';
import { motion } from 'framer-motion';
import FormField from '../ui/FormField';
import FormSection from '../ui/FormSection';
import StepNavigation from '../ui/StepNavigation';
import { useFormValidation } from '../../hooks/useFormValidation';
import { GOVERNORATES, STUDENT_STATUS_OPTIONS, COMPANY_SIZE_OPTIONS, INDUSTRY_OPTIONS } from '../../types/registration.types';

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
 * Personal Info Form Component
 * Second step of registration - collect role-specific personal information
 */
const PersonalInfoForm = ({ 
  formData, 
  errors = {},
  onChange, 
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
    const validation = await validateStep(formData, 2, formData.role);
    
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

  const governorateOptions = GOVERNORATES.map(gov => ({
    value: gov,
    label: gov
  }));

  const renderStudentFields = () => (
    <motion.div variants={itemVariants} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label="First Name"
          name="firstName"
          value={formData.firstName}
          onChange={onChange}
          error={errors.firstName}
          placeholder="Enter your first name"
          required
        />
        <FormField
          label="Last Name"
          name="lastName"
          value={formData.lastName}
          onChange={onChange}
          error={errors.lastName}
          placeholder="Enter your last name"
          required
        />
      </div>

      <FormField
        label="Phone Number"
        name="phone"
        type="tel"
        value={formData.phone}
        onChange={onChange}
        error={errors.phone}
        placeholder="Enter your phone number"
        required
      />

      <FormField
        label="Governorate"
        name="governorate"
        type="select"
        value={formData.governorate}
        onChange={onChange}
        error={errors.governorate}
        options={governorateOptions}
        placeholder="Select your governorate"
        required
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">        <FormField
          label="Track"
          name="track"
          value={formData.track}
          onChange={onChange}
          error={errors.track}
          placeholder="e.g., Web Development"
          helpText="Your specialization track"
        />
        <FormField
          label="Intake"
          name="intake"
          value={formData.intake}
          onChange={onChange}
          error={errors.intake}
          placeholder="e.g., 2024"
          helpText="Your intake year"
        />
      </div>      <FormField
        label="Student Status"
        name="student_status"
        type="select"
        value={formData.student_status}
        onChange={onChange}
        error={errors.student_status}
        options={STUDENT_STATUS_OPTIONS}
        placeholder="Select your student status"
        helpText="Are you currently studying or graduated?"
      />      {/* Remove graduation date for students */}
    </motion.div>
  );

  const renderAlumniFields = () => (
    <motion.div variants={itemVariants} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label="First Name"
          name="firstName"
          value={formData.firstName}
          onChange={onChange}
          error={errors.firstName}
          placeholder="Enter your first name"
          required
        />
        <FormField
          label="Last Name"
          name="lastName"
          value={formData.lastName}
          onChange={onChange}
          error={errors.lastName}
          placeholder="Enter your last name"
          required
        />
      </div>

      <FormField
        label="Phone Number"
        name="phone"
        type="tel"
        value={formData.phone}
        onChange={onChange}
        error={errors.phone}
        placeholder="Enter your phone number"
        required
      />

      <FormField
        label="Governorate"
        name="governorate"
        type="select"
        value={formData.governorate}
        onChange={onChange}
        error={errors.governorate}
        options={governorateOptions}
        placeholder="Select your governorate"
        required
      />

      <FormField
        label="Graduation Date"
        name="graduation_date"
        type="date"
        value={formData.graduation_date}
        onChange={onChange}
        error={errors.graduation_date}
        placeholder="When did you graduate?"
        required
      />
    </motion.div>
  );

  const renderCompanyFields = () => (
    <motion.div variants={itemVariants} className="space-y-4">
      <FormField
        label="Company Name"
        name="company_name"
        value={formData.company_name}
        onChange={onChange}
        error={errors.company_name}
        placeholder="Enter your company name"
        required
      />

      <FormField
        label="Company Description"
        name="description"
        type="textarea"
        value={formData.description}
        onChange={onChange}
        error={errors.description}
        placeholder="Describe your company and what you do"
        required
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label="Location"
          name="location"
          value={formData.location}
          onChange={onChange}
          error={errors.location}
          placeholder="Company location"
          required
        />
        <FormField
          label="Industry"
          name="industry"
          type="select"
          value={formData.industry}
          onChange={onChange}
          error={errors.industry}
          options={INDUSTRY_OPTIONS.map(industry => ({ value: industry, label: industry }))}
          placeholder="Select your industry"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label="Company Size"
          name="company_size"
          type="select"
          value={formData.company_size}
          onChange={onChange}
          error={errors.company_size}
          options={COMPANY_SIZE_OPTIONS}
          placeholder="Select company size"
        />
        <FormField
          label="Website"
          name="website"
          type="url"
          value={formData.website}
          onChange={onChange}
          error={errors.website}
          placeholder="https://company.com"
          helpText="Company website URL"
        />
      </div>

      <FormField
        label="Established Date"
        name="established_at"
        type="date"
        value={formData.established_at}
        onChange={onChange}
        error={errors.established_at}
        helpText="When was the company founded?"
      />
    </motion.div>
  );

  const getRoleSpecificContent = () => {
    switch (formData.role) {
      case 'student':
        return {
          title: 'Student Information',
          description: 'Please provide your student details and academic information',
          fields: renderStudentFields()
        };
      case 'alumni':
        return {
          title: 'Alumni Information',
          description: 'Please provide your personal details and graduation information',
          fields: renderAlumniFields()
        };
      case 'company':
        return {
          title: 'Company Information',
          description: 'Please provide your company details and business information',
          fields: renderCompanyFields()
        };
      default:
        return {
          title: 'Personal Information',
          description: 'Please select an account type in the previous step',
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
        {content.fields}
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

export default PersonalInfoForm;
