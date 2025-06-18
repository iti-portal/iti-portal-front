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

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl shadow-lg p-8 border border-gray-100"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div variants={itemVariants}>
        <h2 className="text-2xl font-bold text-[#901b20] mb-6 text-center tracking-wide">Account Information</h2>
      </motion.div>
      <motion.div className="space-y-6" variants={containerVariants}>
        <motion.div variants={itemVariants}>
          <label className="block text-gray-700 mb-2 font-semibold" htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#901b20] transition"
            value={formData.email || ''}
            onChange={handleChange}
            required
          />
          {errors.email && <span className="text-red-500 text-sm">{errors.email}</span>}
        </motion.div>
        <motion.div variants={itemVariants}>
          <label className="block text-gray-700 mb-2 font-semibold" htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#901b20] transition"
            value={formData.password || ''}
            onChange={handleChange}
            required
          />
          {errors.password && <span className="text-red-500 text-sm">{errors.password}</span>}
        </motion.div>
        <motion.div variants={itemVariants}>
          <label className="block text-gray-700 mb-2 font-semibold" htmlFor="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#901b20] transition"
            value={formData.confirmPassword || ''}
            onChange={handleChange}
            required
          />
          {errors.confirmPassword && <span className="text-red-500 text-sm">{errors.confirmPassword}</span>}
        </motion.div>
        <motion.div variants={itemVariants}>
          <label className="block text-gray-700 mb-2 font-semibold" htmlFor="role">Role</label>
          <select
            id="role"
            name="role"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#901b20] transition"
            value={formData.role || ''}
            onChange={handleChange}
            required
          >
            <option value="">Select role</option>
            <option value="student">Student</option>
            <option value="alumni">Alumni</option>
            <option value="company">Company</option>
          </select>
          {errors.role && <span className="text-red-500 text-sm">{errors.role}</span>}
        </motion.div>
      </motion.div>
      <motion.div className="mt-10" variants={itemVariants}>
        <button
          type="submit"
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-md text-base font-bold text-white transition hover:scale-105"
          style={{ backgroundColor: '#901b20' }}
        >
          Next Step
        </button>
      </motion.div>
    </motion.form>
  );
};

export default AccountType;