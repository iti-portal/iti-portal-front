import React from 'react';
import { motion } from 'framer-motion';
import AuthLayout from '../components/ui/AuthLayout';
import ResetPasswordForm from '../components/forms/ResetPasswordForm';
import leftImg from '../../../assets/image.png';

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.25
    }
  }
};

/**
 * Reset Password Page Component
 * Modern reset password page with proper structure
 */
const ResetPasswordPage = () => {
  return (
    <motion.div
      className="min-h-screen flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <AuthLayout
        leftTitle="Reset Password"
        leftDescription="Please enter your new password below."
        backgroundImage={leftImg}
        rightContent={<ResetPasswordForm />}
      />
    </motion.div>
  );
};

export default ResetPasswordPage;
