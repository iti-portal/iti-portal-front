import React from 'react';
import { motion } from 'framer-motion';
import { useForgotPassword } from '../../hooks/useForgotPassword';
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
 * Forgot Password Form Component
 * Modern forgot password form with proper structure
 */
const ForgotPasswordForm = () => {
  const {
    email,
    errors,
    isSubmitting,
    sent,
    message,
    handleEmailChange,
    handleSubmit
  } = useForgotPassword();

  if (sent) {
    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="text-center"
      >
        <AuthFormHeader
          title="Email Sent!"
          description="If an account with that email exists, a reset link has been sent."
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
        title="Forgot Password"
        description="Enter your email address below and we'll send you a link to reset your password."
      />

      <form onSubmit={handleSubmit} className="space-y-4">
        <AuthInputField
          id="email"
          name="email"
          type="email"
          label="Email"
          placeholder="Enter your email address"
          value={email}
          onChange={handleEmailChange}
          error={errors.email}
          required
          autoComplete="email"
        />

        <div className="pt-2">
          <AuthButton
            type="submit"
            loading={isSubmitting}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Sending...' : 'Send Reset Link'}
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

      {message && !sent && (
        <div className="text-center mt-4">
          <p className="text-red-600 text-sm">{message}</p>
        </div>
      )}
    </motion.div>
  );
};

export default ForgotPasswordForm;
