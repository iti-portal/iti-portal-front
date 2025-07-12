import React from 'react';
import { motion } from 'framer-motion';

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

/**
 * Auth Layout Component
 * Shared layout for authentication pages
 */
const AuthLayout = ({ 
  leftContent, 
  rightContent, 
  leftTitle, 
  leftDescription,
  backgroundImage 
}) => {
  return (
    <motion.div 
      className="flex flex-col md:flex-row items-stretch bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden mx-auto w-full max-w-5xl min-h-[600px] border border-white/20"
      variants={itemVariants}
    >
      {/* Left Side: Image with Overlay */}
      <motion.div
        className="md:w-1/2 flex-1 relative flex items-center justify-center bg-gray-100 p-0"
        variants={itemVariants}
      >
        {backgroundImage && (
          <img
            src={backgroundImage}
            alt="Background"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ zIndex: 0 }}
          />
        )}
        <div className="relative z-10 flex flex-col items-center justify-center w-full h-full bg-gradient-to-br from-[#203947]/80 via-[#901b20]/80 to-[#203947]/80 p-10">
          <h2 className="text-4xl font-bold text-white text-center drop-shadow-lg mb-4">
            {leftTitle}
          </h2>
          <p className="text-white/90 text-center text-lg drop-shadow mb-4 leading-relaxed">
            {leftDescription}
          </p>
          {leftContent}
        </div>
      </motion.div>

      {/* Right Side: Form Content */}
      <motion.div
        className="md:w-1/2 flex-1 flex flex-col justify-center p-10 bg-white"
        variants={itemVariants}
      >
        {rightContent}
      </motion.div>
    </motion.div>
  );
};

export default AuthLayout;
