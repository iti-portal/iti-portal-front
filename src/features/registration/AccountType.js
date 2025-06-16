import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { accountTypeSchema } from '../../utils/personalInfoSchemas';

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

const AccountType = ({ formData, handleChange, nextStep }) => {
  const [errors, setErrors] = useState({});

  const validate = async () => {
    try {
      await accountTypeSchema.validate(formData, { abortEarly: false });
      return {};
    } catch (err) {
      const errs = {};
      if (err.inner) {
        err.inner.forEach(e => {
          errs[e.path] = e.message;
        });
      }
      return errs;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = await validate();
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      nextStep();
    }
  };

  return (    <motion.form
      onSubmit={handleSubmit}
      className="bg-white rounded-lg shadow-md p-6 border border-gray-100"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div variants={itemVariants}>
        <h2 className="text-xl font-bold text-[#901b20] mb-4 text-center tracking-wide">Account Information</h2>
      </motion.div>
      <motion.div className="space-y-4" variants={containerVariants}>        <motion.div variants={itemVariants}>
          <label className="block text-gray-700 mb-1 font-medium text-sm" htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#901b20] focus:border-transparent transition text-sm"
            value={formData.email || ''}
            onChange={handleChange}
            required
          />
          {errors.email && <span className="text-red-500 text-xs mt-1 block">{errors.email}</span>}
        </motion.div>
        <motion.div variants={itemVariants}>
          <label className="block text-gray-700 mb-1 font-medium text-sm" htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#901b20] focus:border-transparent transition text-sm"
            value={formData.password || ''}
            onChange={handleChange}
            required
          />
          {errors.password && <span className="text-red-500 text-xs mt-1 block">{errors.password}</span>}
        </motion.div>
        <motion.div variants={itemVariants}>
          <label className="block text-gray-700 mb-1 font-medium text-sm" htmlFor="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#901b20] focus:border-transparent transition text-sm"
            value={formData.confirmPassword || ''}
            onChange={handleChange}
            required
          />
          {errors.confirmPassword && <span className="text-red-500 text-xs mt-1 block">{errors.confirmPassword}</span>}
        </motion.div>
        <motion.div variants={itemVariants}>
          <label className="block text-gray-700 mb-1 font-medium text-sm" htmlFor="role">Role</label>
          <select
            id="role"
            name="role"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#901b20] focus:border-transparent transition text-sm"
            value={formData.role || ''}
            onChange={handleChange}
            required
          >
            <option value="">Select role</option>
            <option value="student">Student</option>
            <option value="alumni">Alumni</option>
            <option value="company">Company</option>
          </select>
          {errors.role && <span className="text-red-500 text-xs mt-1 block">{errors.role}</span>}
        </motion.div>
      </motion.div>      <motion.div className="mt-6" variants={itemVariants}>
        <button
          type="submit"
          className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-semibold text-white transition hover:scale-105"
          style={{ backgroundColor: '#901b20' }}
        >
          Next Step
        </button>
      </motion.div>
    </motion.form>
  );
};

export default AccountType;