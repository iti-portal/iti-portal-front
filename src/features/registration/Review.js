// components/Review.js
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { submitRegistration } from '../../api/register';

const containerVariants = {
  visible: {
    transition: {
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const Review = ({ formData, prevStep }) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    submitRegistration({ formData, setError, navigate, setIsSubmitting });
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl shadow-lg p-8 border border-gray-100"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div variants={itemVariants}>
        <h2 className="text-2xl font-bold text-[#901b20] mb-6 text-center tracking-wide">Review Your Information</h2>
      </motion.div>
      
      {error && (
        <motion.div 
          variants={itemVariants}
          className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"
        >
          <p className="text-red-700 text-sm">{error}</p>
        </motion.div>
      )}
      
      <motion.ul className="mb-8 space-y-3 text-base" variants={containerVariants}>
        {formData.role !== 'company' && (
          <>
            <motion.li variants={itemVariants}>
              <span className="font-semibold text-gray-700">First Name:</span>
              <span className="ml-2 text-gray-900">{formData.firstName}</span>
            </motion.li>
            <motion.li variants={itemVariants}>
              <span className="font-semibold text-gray-700">Last Name:</span>
              <span className="ml-2 text-gray-900">{formData.lastName}</span>
            </motion.li>
            <motion.li variants={itemVariants}>
              <span className="font-semibold text-gray-700">Phone:</span>
              <span className="ml-2 text-gray-900">{formData.phone}</span>
            </motion.li>
          </>
        )}
        <motion.li variants={itemVariants}>
          <span className="font-semibold text-gray-700">Email:</span>
          <span className="ml-2 text-gray-900">{formData.email}</span>
        </motion.li>
        <motion.li variants={itemVariants}>
          <span className="font-semibold text-gray-700">Role:</span>
          <span className="ml-2 text-gray-900">{formData.role}</span>
        </motion.li>
      </motion.ul>
      
      <motion.div className="flex justify-between" variants={itemVariants}>
        <button
          type="button"
          onClick={prevStep}
          disabled={isSubmitting}
          className="px-6 py-2 rounded-lg font-semibold bg-gray-200 text-gray-700 hover:bg-gray-300 transition disabled:opacity-50"
        >
          Back
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 rounded-lg font-semibold text-white shadow-md transition disabled:opacity-50"
          style={{ backgroundColor: '#901b20' }}
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </motion.div>
    </motion.form>
  );
};

export default Review;