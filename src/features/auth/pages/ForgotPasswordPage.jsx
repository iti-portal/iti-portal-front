import React from 'react';
import { motion } from 'framer-motion';
import AuthLayout from '../components/ui/AuthLayout';
import ForgotPasswordForm from '../components/forms/ForgotPasswordForm';
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
 * Forgot Password Page Component
 * Modern forgot password page with proper structure
 */
const ForgotPasswordPage = () => {
  return (
    <motion.div
      className="min-h-screen flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 bg-gradient-to-br from-[#203947] via-[#901b20] to-[#203947]"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <AuthLayout
        leftTitle="Forgot Password?"
        leftDescription="Enter your email to reset your password."
        backgroundImage={leftImg}
        rightContent={<ForgotPasswordForm />}
      />
    </motion.div>
  );
};

export default ForgotPasswordPage;
