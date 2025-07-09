import React from 'react';
import { motion } from 'framer-motion';
import { useLogin } from '../../hooks/useLogin';
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
 * Login Form Component
 * Modern login form with proper structure
 */
const LoginForm = () => {
  const {
    formData,
    errors,
    isSubmitting,
    alert,
    handleChange,
    handleSubmit,
    handleCloseAlert
  } = useLogin();

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <AuthFormHeader
        title="Login"
        description="Welcome back! Please enter your credentials to access your account."
        alert={alert}
        onCloseAlert={handleCloseAlert}
      />

      <form onSubmit={handleSubmit} className="space-y-4">
        <AuthInputField
          id="email"
          name="email"
          type="email"
          label="Email"
          placeholder="Enter your email address"
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
          label="Password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          required
          autoComplete="current-password"
        />

        <div className="pt-2">
          <AuthButton
            type="submit"
            loading={isSubmitting}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Signing in...' : 'Login'}
          </AuthButton>
        </div>

        <div className="text-center mt-4">
          <a
            href="/forgot-password"
            className="text-sm text-[#901b20] hover:text-[#7a1419] transition-colors duration-200"
          >
            Forgot password?
          </a>
        </div>
      </form>

      <div className="text-center mt-6">
        <p className="text-sm text-gray-600">
          Don't have an account?{' '}
          <a
            href="/register"
            className="font-semibold text-[#901b20] hover:text-[#7a1419] transition-colors duration-200"
          >
            Sign up
          </a>
        </p>
      </div>
    </motion.div>
  );
};

export default LoginForm;
