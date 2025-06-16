import React from 'react';
import { motion } from 'framer-motion';
import AuthLayout from '../components/ui/AuthLayout';
import LoginForm from '../components/forms/LoginForm';
import leftImg from '../../../assets/image.png';

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.25
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 }
};

/**
 * Login Page Component
 * Modern login page with proper structure
 */
const LoginPage = () => {
  return (
    <motion.div
      className="min-h-screen flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <AuthLayout
        leftTitle="Welcome Back!"
        leftDescription="Please login to your ITI Portal account."
        backgroundImage={leftImg}
        rightContent={<LoginForm />}
      />
    </motion.div>
  );
};

export default LoginPage;
