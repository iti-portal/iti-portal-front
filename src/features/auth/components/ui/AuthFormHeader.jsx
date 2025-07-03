import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Logo from '../../../../components/Common/Logo';
import Alert from '../../../../components/UI/Alert';

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

/**
 * Auth Form Header Component
 * Reusable header for auth forms
 */
const AuthFormHeader = ({ 
  title, 
  description, 
  showLogo = true,
  alert = null,
  onCloseAlert = null
}) => {
  return (
    <>
      <div className="text-center mb-4">
        {showLogo && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-6"
          >
            <Logo size="xl" center={true} marginBottom={false} />
          </motion.div>
        )}
        
        <motion.h2 
          className="text-xl font-bold text-[#901b20] mb-1 drop-shadow-sm"
          variants={itemVariants}
        >
          {title}
        </motion.h2>
        
        {description && (
          <motion.p 
            className="text-gray-600 mb-2 text-sm"
            variants={itemVariants}
          >
            {description}
          </motion.p>
        )}
      </div>

      {/* Alert */}
      {alert && (
        <Alert
          show={alert.show}
          type={alert.type}
          message={alert.message}
          persistent={alert.persistent}
          onClose={onCloseAlert}
        />
      )}
    </>
  );
};

export default AuthFormHeader;
