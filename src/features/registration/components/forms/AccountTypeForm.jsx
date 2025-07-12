import React from 'react';
import { motion } from 'framer-motion';
import FormField from '../ui/FormField';
import FormSection from '../ui/FormSection';
import StepNavigation from '../ui/StepNavigation';
import { ACCOUNT_TYPE_OPTIONS } from '../../constants/accountTypes';
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
 * Account Type Form Component
 * First step of registration - collect basic account information
 */
const AccountTypeForm = ({ 
  formData, 
  errors = {},
  onChange, 
  onNext, 
  onValidation,
  isSubmitting = false 
}) => {
  const { validateStep } = useFormValidation();  const handleSubmit = async (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    
    // Validate current step
    const validation = await validateStep(formData, 1, formData.role);
    
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

  const roleOptions = ACCOUNT_TYPE_OPTIONS.map(type => ({
    value: type.value,
    label: type.label
  }));

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <FormSection
        title="Account Information"
        description="Choose your account type and provide basic credentials"
      >
        <motion.div variants={itemVariants} className="space-y-4">
          {/* Account Type Selection */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-800 mb-3">
              Select Account Type
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {ACCOUNT_TYPE_OPTIONS.map((type) => (                <motion.div
                  key={type.value}
                  variants={itemVariants}                  className={`
                    relative border-2 rounded-xl p-4 cursor-pointer transition-all duration-200 flex flex-col h-full
                    ${formData.role === type.value 
                      ? 'border-[#901b20] bg-gradient-to-br from-[#901b20]/5 to-[#203947]/5 shadow-lg scale-[1.02] ring-2 ring-[#901b20]/20' 
                      : 'border-gray-200 hover:border-gray-300 hover:scale-[1.01] hover:shadow-md'
                    }
                  `}
                  onClick={() => onChange({ target: { name: 'role', value: type.value } })}
                >
                  <div className="flex items-start mb-3">                    <input
                      type="radio"
                      name="role"
                      value={type.value}
                      checked={formData.role === type.value}
                      onChange={onChange}
                      className={`h-4 w-4 mt-1 focus:ring-[#901b20] border-gray-300 transition-all duration-200 ${formData.role === type.value ? 'text-[#901b20] ring-2 ring-[#901b20]/20' : ''}`}
                    />
                    <div className="ml-3 flex-1">                      <div className="flex items-center">
                        <span className={`text-xl mr-2 ${formData.role === type.value ? 'text-[#901b20]' : 'text-gray-500'}`}>{type.icon}</span>
                        <span className={`text-sm font-medium ${formData.role === type.value ? 'text-[#901b20]' : 'text-gray-900'}`}>
                          {type.label}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {type.description}
                      </p>
                    </div>
                  </div>                  {/* Features list for all types - conditionally visible */}
                  <div className={`mt-1 pt-2 border-t border-gray-200 flex-grow transition-all duration-300 ${formData.role === type.value ? 'opacity-100' : 'opacity-50'}`}>
                    <ul className="space-y-1">
                      {type.features.map((feature, index) => (
                        <li key={index} className={`text-xs flex items-center ${formData.role === type.value ? 'text-gray-700 font-medium' : 'text-gray-500'}`}>
                          <svg className={`w-3 h-3 mr-1 ${formData.role === type.value ? 'text-[#901b20]' : 'text-green-500'}`} fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </div>
            {errors.role && (
              <p className="text-sm text-red-600">{errors.role}</p>
            )}
          </div>

          {/* Email Field */}
          <FormField
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={onChange}
            error={errors.email}
            placeholder="Enter your email address"
            required
          />

          {/* Password Field */}
          <FormField
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={onChange}
            error={errors.password}
            placeholder="Create a password (min 8 characters)"
            required
            helpText="Password must be at least 8 characters long"
          />

          {/* Confirm Password Field */}
          <FormField
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={onChange}
            error={errors.confirmPassword}
            placeholder="Confirm your password"
            required
          />
        </motion.div>
      </FormSection>      {/* Navigation */}
      <motion.div variants={itemVariants}>
        <StepNavigation
          canGoNext={true}
          isSubmitting={isSubmitting}
          onNext={handleNextClick}
          nextLabel="Continue"
        />
      </motion.div>
    </motion.form>
  );
};

export default AccountTypeForm;
