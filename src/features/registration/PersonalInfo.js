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

  return (    <motion.form
      onSubmit={handleSubmit}
      className="bg-white rounded-md shadow-md p-6 border border-gray-100"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div variants={itemVariants}>
        <h2 className="text-xl font-bold text-[#901b20] mb-4 text-center tracking-wide">
          Personal Information
        </h2>
      </motion.div>
      <motion.div className="space-y-4" variants={containerVariants}>
        {formData.role === 'student' && (
          <>
            <motion.div variants={itemVariants}>
              <input
                name="firstName"
                placeholder="First Name"
                value={formData.firstName || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#901b20] transition"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#901b20] transition"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#901b20] transition"
                required
              />
              {errors.phone && <span className="text-red-500 text-sm">{errors.phone}</span>}
            </motion.div>
            <motion.div variants={itemVariants}>
              <select
                name="branch"
                value={formData.branch || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#901b20] transition"
                required
              >
                <option value="">Select ITI Branch</option>
                <option value="Qena">Qena</option>
                <option value="Sohag">Sohag</option>
                <option value="Tanta">Tanta</option>
                <option value="Zagazig">Zagazig</option>
                <option value="New Valley">New Valley</option>
                <option value="Damanhor">Damanhor</option>
                <option value="Al Arish">Al Arish</option>
                <option value="Banha">Banha</option>
                <option value="Port Said">Port Said</option>
                <option value="Smart Village">Smart Village</option>
                <option value="New Capital">New Capital</option>
                <option value="Cairo University">Cairo University</option>
                <option value="Alexandria">Alexandria</option>
                <option value="Assiut">Assiut</option>
                <option value="Aswan">Aswan</option>
                <option value="Beni Suef">Beni Suef</option>
                <option value="Fayoum">Fayoum</option>
                <option value="Ismailia">Ismailia</option>
                <option value="Mansoura">Mansoura</option>
                <option value="Menofia">Menofia</option>
                <option value="Minya">Minya</option>
              </select>
              {errors.branch && <span className="text-red-500 text-sm">{errors.branch}</span>}
            </motion.div>
            <motion.div variants={itemVariants}>
              <select
                name="program"
                value={formData.program || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#901b20] transition"
                required
              >
                <option value="">Select Program</option>
                <option value="PTP">PTP (Professional Training Program)</option>
                <option value="ITP">ITP (Intensive Training Program)</option>
              </select>
              {errors.program && <span className="text-red-500 text-sm">{errors.program}</span>}
            </motion.div>
            <motion.div variants={itemVariants}>
              <input
                name="track"
                placeholder="Track (optional)"
                value={formData.track || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#901b20] transition"
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <input
                name="intake"
                placeholder="Intake (optional)"
                value={formData.intake || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#901b20] transition"
              />
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#901b20] transition"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#901b20] transition"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#901b20] transition"
                required
              />
              {errors.phone && <span className="text-red-500 text-sm">{errors.phone}</span>}
            </motion.div>
            <motion.div variants={itemVariants}>
              <select
                name="branch"
                value={formData.branch || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#901b20] transition"
                required
              >
                <option value="">Select ITI Branch</option>
                <option value="Qena">Qena</option>
                <option value="Sohag">Sohag</option>
                <option value="Tanta">Tanta</option>
                <option value="Zagazig">Zagazig</option>
                <option value="New Valley">New Valley</option>
                <option value="Damanhor">Damanhor</option>
                <option value="Al Arish">Al Arish</option>
                <option value="Banha">Banha</option>
                <option value="Port Said">Port Said</option>
                <option value="Smart Village">Smart Village</option>
                <option value="New Capital">New Capital</option>
                <option value="Cairo University">Cairo University</option>
                <option value="Alexandria">Alexandria</option>
                <option value="Assiut">Assiut</option>
                <option value="Aswan">Aswan</option>
                <option value="Beni Suef">Beni Suef</option>
                <option value="Fayoum">Fayoum</option>
                <option value="Ismailia">Ismailia</option>
                <option value="Mansoura">Mansoura</option>
                <option value="Menofia">Menofia</option>
                <option value="Minya">Minya</option>
              </select>
              {errors.branch && <span className="text-red-500 text-sm">{errors.branch}</span>}
            </motion.div>
            <motion.div variants={itemVariants}>
              <select
                name="program"
                value={formData.program || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#901b20] transition"
                required
              >
                <option value="">Select Program</option>
                <option value="ptp">PTP (Professional Training Program)</option>
                <option value="itp">ITP (Intensive Training Program)</option>
              </select>
              {errors.program && <span className="text-red-500 text-sm">{errors.program}</span>}
            </motion.div>
            <motion.div variants={itemVariants}>
              <input
                name="track"
                placeholder="Track (optional)"
                value={formData.track || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#901b20] transition"
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <input
                name="intake"
                placeholder="Intake (optional)"
                value={formData.intake || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#901b20] transition"
              />
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#901b20] transition"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#901b20] transition resize-none"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#901b20] transition"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#901b20] transition"
              />
              {errors.industry && <span className="text-red-500 text-sm">{errors.industry}</span>}
            </motion.div>
            <motion.div variants={itemVariants}>
              <input
                name="company_size"
                placeholder="Company Size"
                value={formData.company_size || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#901b20] transition"
              />
              {errors.company_size && <span className="text-red-500 text-sm">{errors.company_size}</span>}
            </motion.div>
            <motion.div variants={itemVariants}>
              <input
                name="website"
                placeholder="Website (optional)"
                value={formData.website || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#901b20] transition"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#901b20] transition"
              />
              <span className="text-gray-500 text-xs block mt-1">
                Please enter your company creation or establishment date.
              </span>
              {errors.established_at && <span className="text-red-500 text-sm">{errors.established_at}</span>}
            </motion.div>
          </>
        )}
      </motion.div>      <motion.div className="flex justify-between mt-6" variants={itemVariants}>
        <button
          type="button"
          onClick={prevStep}
          className="px-4 py-2 rounded-md font-medium text-sm bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
        >
          Back
        </button>
        <button
          type="submit"
          className="px-4 py-2 rounded-md font-medium text-sm text-white shadow-sm"
          style={{ backgroundColor: '#901b20' }}
        >
          Next Step
        </button>
      </motion.div>
    </motion.form>
  );
};

export default PersonalInfo;
