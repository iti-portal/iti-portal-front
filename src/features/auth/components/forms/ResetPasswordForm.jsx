import React from 'react';
import { motion } from 'framer-motion';
import { useResetPassword } from '../../hooks/useResetPassword';
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
 * Reset Password Form Component
 * Modern reset password form with proper structure
 */
const ResetPasswordForm = () => {
  const {
    formData,
    errors,
    isSubmitting,
    reset,
    message,
    handleChange,
    handleSubmit
  } = useResetPassword();

  if (reset) {
    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="text-center"
      >
        <AuthFormHeader
          title="Password Reset Complete!"
          description="Your password has been reset successfully."
          showLogo={true}
        />
        
        <div className="mt-6">
          <p className="text-green-600 font-medium mb-3 text-sm">
            {message}
          </p>
          <a
            href="/login"
            className="text-[#901b20] hover:underline text-xs"
          >
            Return to Login
          </a>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <AuthFormHeader
        title="Reset Password"
        description="Enter your new password and confirm it to reset your account password."
      />

      <form onSubmit={handleSubmit} className="space-y-4">
        <AuthInputField
          id="password"
          name="password"
          type="password"
          label="New Password"
          placeholder="Enter new password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          required
          autoComplete="new-password"
        />

        <AuthInputField
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          label="Confirm Password"
          placeholder="Confirm new password"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          required
          autoComplete="new-password"
        />

        <div className="pt-2">
          <AuthButton
            type="submit"
            loading={isSubmitting}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Resetting...' : 'Reset Password'}
          </AuthButton>
        </div>

        <div className="text-center mt-3">
          <a
            href="/login"
            className="text-xs text-[#901b20] hover:underline"
          >
            Back to Login
          </a>
        </div>
      </form>

      {message && !reset && (
        <div className="text-center mt-4">
          <p className="text-red-600 text-sm">{message}</p>
        </div>
      )}
    </motion.div>
  );
};

export default ResetPasswordForm;
