import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { updatePassword } from '../../../../services/accountService';
import AuthFormHeader from '../ui/AuthFormHeader';
import AuthInputField from '../ui/AuthInputField';
import AuthButton from '../ui/AuthButton';

const containerVariants = {
  visible: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

/**
 * Update Password Form Component
 * Form for updating user password
 */
const UpdatePasswordForm = ({ onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    password: '',
    new_password: '',
    new_password_confirmation: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.password) {
      newErrors.password = 'Current password is required';
    }
    
    if (!formData.new_password) {
      newErrors.new_password = 'New password is required';
    } else if (formData.new_password.length < 6) {
      newErrors.new_password = 'New password must be at least 6 characters';
    }
    
    if (!formData.new_password_confirmation) {
      newErrors.new_password_confirmation = 'Password confirmation is required';
    } else if (formData.new_password !== formData.new_password_confirmation) {
      newErrors.new_password_confirmation = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const result = await updatePassword(formData);
      
      if (result.success) {
        setMessage('Password updated successfully!');
        setFormData({ 
          password: '', 
          new_password: '', 
          new_password_confirmation: '' 
        });
        
        // Call success callback if provided
        if (onSuccess) {
          onSuccess(result.message);
        }
      }
    } catch (error) {
      setMessage(error.message || 'Failed to update password. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-md mx-auto"
    >
      <AuthFormHeader
        title="Update Password"
        description="Enter your current password and choose a new password to update your account."
      />

      <form onSubmit={handleSubmit} className="space-y-4">
        <AuthInputField
          id="password"
          name="password"
          type="password"
          label="Current Password"
          placeholder="Enter current password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          required
          autoComplete="current-password"
        />

        <AuthInputField
          id="new_password"
          name="new_password"
          type="password"
          label="New Password"
          placeholder="Enter new password"
          value={formData.new_password}
          onChange={handleChange}
          error={errors.new_password}
          required
          autoComplete="new-password"
        />

        <AuthInputField
          id="new_password_confirmation"
          name="new_password_confirmation"
          type="password"
          label="Confirm New Password"
          placeholder="Confirm new password"
          value={formData.new_password_confirmation}
          onChange={handleChange}
          error={errors.new_password_confirmation}
          required
          autoComplete="new-password"
        />

        <div className="flex gap-3 pt-2">
          <AuthButton
            type="submit"
            loading={isSubmitting}
            disabled={isSubmitting}
            className="flex-1"
          >
            {isSubmitting ? 'Updating...' : 'Update Password'}
          </AuthButton>
          
          {onCancel && (
            <AuthButton
              type="button"
              variant="secondary"
              onClick={onCancel}
              disabled={isSubmitting}
              className="flex-1"
            >
              Cancel
            </AuthButton>
          )}
        </div>
      </form>

      {message && (
        <div className="text-center mt-4">
          <p className={`text-sm ${message.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>
            {message}
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default UpdatePasswordForm;
