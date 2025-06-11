import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../../assets/logo.png'; // Adjust the path if needed

const Layout = ({ children }) => (
  <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative">
    {/* Navbar-style logo in the top-left */}
    <div className="absolute top-6 left-8 z-20">
      <img src={logo} alt="Logo" className="h-12 w-auto" />
    </div>
    <div className="sm:mx-auto">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.5 }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  </div>
);

export default Layout;