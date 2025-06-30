import React from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
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
  const location = useLocation();
  const from = location.state?.from?.pathname;
  
  // Check if user was redirected from a protected route
  const wasRedirected = from && from !== '/login';

  return (
    <motion.div
      className="min-h-screen flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Show message if user was redirected from protected route */}
      {wasRedirected && (
        <motion.div
          className="mb-4 max-w-md mx-auto"
          variants={itemVariants}
        >
          <div className="bg-[#901b20] text-white p-4 rounded-lg text-center">
            <p className="text-sm font-medium">
              🔒 You must login to access {from === '/' ? 'the home page' : 'this page'}
            </p>
          </div>
        </motion.div>
      )}
      
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
