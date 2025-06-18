// components/PersonalInfo.js
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { studentSchema, alumniSchema, companySchema } from '../../utils/personalInfoSchemas';

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

const PersonalInfo = ({ formData, handleChange, nextStep, prevStep }) => {
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    let schema;
    if (formData.role === 'student') schema = studentSchema;
    else if (formData.role === 'alumni') schema = alumniSchema;
    else if (formData.role === 'company') schema = companySchema;

    try {
      await schema.validate(formData, { abortEarly: false });
      setErrors({});
      nextStep();
    } catch (err) {
      const errs = {};
      if (err.inner) {
        err.inner.forEach(e => {
          errs[e.path] = e.message;
        });
      }
      setErrors(errs);
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
        <h2 className="text-2xl font-bold text-[#901b20] mb-6 text-center tracking-wide">
          Personal Information
        </h2>
      </motion.div>
      <motion.div className="space-y-5" variants={containerVariants}>
        {formData.role === 'student' && (
          <>
            <motion.div variants={itemVariants}>
              <input
                name="firstName"
                placeholder="First Name"
                value={formData.firstName || ''}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#901b20] transition"
                required
              />
              {errors.firstName && <span className="text-red-500 text-sm">{errors.firstName}</span>}
            </motion.div>
            <motion.div variants={itemVariants}>
              <input
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName || ''}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#901b20] transition"
                required
              />
              {errors.lastName && <span className="text-red-500 text-sm">{errors.lastName}</span>}
            </motion.div>
            <motion.div variants={itemVariants}>
              <input
                name="phone"
                placeholder="Phone"
                value={formData.phone || ''}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#901b20] transition"
                required
              />
              {errors.phone && <span className="text-red-500 text-sm">{errors.phone}</span>}
            </motion.div>
            <motion.div variants={itemVariants}>
              <input
                name="governorate"
                placeholder="Governorate"
                value={formData.governorate || ''}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#901b20] transition"
                required
              />
              {errors.governorate && <span className="text-red-500 text-sm">{errors.governorate}</span>}
            </motion.div>
            <motion.div variants={itemVariants}>
              <input
                name="track"
                placeholder="Track (optional)"
                value={formData.track || ''}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#901b20] transition"
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <input
                name="intake"
                placeholder="Intake (optional)"
                value={formData.intake || ''}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#901b20] transition"
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <input
                name="graduation_date"
                type="date"
                placeholder="Graduation Date (optional)"
                value={formData.graduation_date || ''}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#901b20] transition"
              />
              {errors.graduation_date && <span className="text-red-500 text-sm">{errors.graduation_date}</span>}
            </motion.div>
            <motion.div variants={itemVariants}>
              <select
                name="student_status"
                value={formData.student_status || ''}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#901b20] transition"
              >
                <option value="">Student Status (optional)</option>
                <option value="current">Current</option>
                <option value="graduate">Graduate</option>
              </select>
              {errors.student_status && <span className="text-red-500 text-sm">{errors.student_status}</span>}
            </motion.div>
          </>
        )}
        {formData.role === 'alumni' && (
          <>
            <motion.div variants={itemVariants}>
              <input
                name="firstName"
                placeholder="First Name"
                value={formData.firstName || ''}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#901b20] transition"
                required
              />
              {errors.firstName && <span className="text-red-500 text-sm">{errors.firstName}</span>}
            </motion.div>
            <motion.div variants={itemVariants}>
              <input
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName || ''}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#901b20] transition"
                required
              />
              {errors.lastName && <span className="text-red-500 text-sm">{errors.lastName}</span>}
            </motion.div>
            <motion.div variants={itemVariants}>
              <input
                name="phone"
                placeholder="Phone"
                value={formData.phone || ''}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#901b20] transition"
                required
              />
              {errors.phone && <span className="text-red-500 text-sm">{errors.phone}</span>}
            </motion.div>
            <motion.div variants={itemVariants}>
              <input
                name="governorate"
                placeholder="Governorate"
                value={formData.governorate || ''}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#901b20] transition"
                required
              />
              {errors.governorate && <span className="text-red-500 text-sm">{errors.governorate}</span>}
            </motion.div>
            <motion.div variants={itemVariants}>
              <input
                name="graduation_date"
                type="date"
                placeholder="Graduation Date"
                value={formData.graduation_date || ''}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#901b20] transition"
                required
              />
              <span className="text-gray-500 text-xs block mt-1">
                Please enter your graduation date as an alumni.
              </span>
              {errors.graduation_date && <span className="text-red-500 text-sm">{errors.graduation_date}</span>}
            </motion.div>
          </>
        )}
        {formData.role === 'company' && (
          <>
            <motion.div variants={itemVariants}>
              <input
                name="company_name"
                placeholder="Company Name"
                value={formData.company_name || ''}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#901b20] transition"
                required
              />
              {errors.company_name && <span className="text-red-500 text-sm">{errors.company_name}</span>}
            </motion.div>
            <motion.div variants={itemVariants}>
              <textarea
                name="description"
                placeholder="Description"
                value={formData.description || ''}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#901b20] transition resize-none"
                required
                rows={3}
              />
              {errors.description && <span className="text-red-500 text-sm">{errors.description}</span>}
            </motion.div>
            <motion.div variants={itemVariants}>
              <input
                name="location"
                placeholder="Location"
                value={formData.location || ''}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#901b20] transition"
                required
              />
              {errors.location && <span className="text-red-500 text-sm">{errors.location}</span>}
            </motion.div>
            <motion.div variants={itemVariants}>
              <input
                name="industry"
                placeholder="Industry"
                value={formData.industry || ''}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#901b20] transition"
              />
              {errors.industry && <span className="text-red-500 text-sm">{errors.industry}</span>}
            </motion.div>
            <motion.div variants={itemVariants}>
              <input
                name="company_size"
                placeholder="Company Size"
                value={formData.company_size || ''}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#901b20] transition"
              />
              {errors.company_size && <span className="text-red-500 text-sm">{errors.company_size}</span>}
            </motion.div>
            <motion.div variants={itemVariants}>
              <input
                name="website"
                placeholder="Website (optional)"
                value={formData.website || ''}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#901b20] transition"
              />
              {errors.website && <span className="text-red-500 text-sm">{errors.website}</span>}
            </motion.div>
            <motion.div variants={itemVariants}>
              <input
                name="established_at"
                type="date"
                placeholder="Established At (optional)"
                value={formData.established_at || ''}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#901b20] transition"
              />
              <span className="text-gray-500 text-xs block mt-1">
                Please enter your company creation or establishment date.
              </span>
              {errors.established_at && <span className="text-red-500 text-sm">{errors.established_at}</span>}
            </motion.div>
          </>
        )}
      </motion.div>
      <motion.div className="flex justify-between mt-8" variants={itemVariants}>
        <button
          type="button"
          onClick={prevStep}
          className="px-6 py-2 rounded-lg font-semibold bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
        >
          Back
        </button>
        <button
          type="submit"
          className="px-6 py-2 rounded-lg font-semibold text-white shadow-md"
          style={{ backgroundColor: '#901b20' }}
        >
          Next Step
        </button>
      </motion.div>
    </motion.form>
  );
};

export default PersonalInfo;