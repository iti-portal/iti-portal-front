import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { updateEmail } from '../../../../services/accountService';
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
 * Update Email Form Component
 * Form for updating user email address
 */
const UpdateEmailForm = ({ onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
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

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
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
      const result = await updateEmail(formData);

      if (result.success) {
        setMessage('Email updated successfully!');
        setFormData({ email: '', password: '' });

        // Call success callback if provided
        if (onSuccess) {
          onSuccess(result.message);
        }
      }
    } catch (error) {
      setMessage(error.message || 'Failed to update email. Please try again.');
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
        title="Update Email Address"
        description="Enter your new email address and current password to update your account email."
      />

      <form onSubmit={handleSubmit} className="space-y-4">
        <AuthInputField
          id="email"
          name="email"
          type="email"
          label="New Email Address"
          placeholder="Enter new email address"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          required
          autoComplete="email"
        />

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

        <div className="flex gap-3 pt-2">
          <AuthButton
            type="submit"
            loading={isSubmitting}
            disabled={isSubmitting}
            className="flex-1"
          >
            {isSubmitting ? 'Updating...' : 'Update Email'}
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

export default UpdateEmailForm;