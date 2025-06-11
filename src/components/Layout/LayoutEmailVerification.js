import React from 'react';
import { motion } from 'framer-motion';
import logo from '../../assets/logo.png'; // Adjust the path if needed

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

const LayoutEmailVerification = ({ children }) => (
  <motion.div
    className="min-h-screen bg-gray-50 flex flex-col justify-center items-center py-12 sm:px-6 lg:px-8 relative"
    initial="hidden"
    animate="visible"
    variants={containerVariants}
  >
    {/* Navbar-style logo in the top-left */}
    <div className="absolute top-6 left-8 z-20">
      <img src={logo} alt="Logo" className="h-12 w-auto" />
    </div>
    {React.Children.map(children, child =>
      <motion.div variants={itemVariants}>{child}</motion.div>
    )}
  </motion.div>
);

export default LayoutEmailVerification;