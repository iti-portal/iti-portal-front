// src/features/Student/Profile/components/edit/PersonalInfoForm.js

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

function PersonalInfoForm({ data, onUpdateAll }) {
  const [personalInfo, setPersonalInfo] = useState({
    firstName: data.firstName,
    lastName: data.lastName,
    title: data.title,
    company: data.company,
    summary: data.summary, // About Me
    governorate: data.governorate, // Location
  });

  useEffect(() => {
    setPersonalInfo({
      firstName: data.firstName,
      lastName: data.lastName,
      title: data.title,
      company: data.company,
      summary: data.summary,
      governorate: data.governorate,
    });
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedInfo = { ...personalInfo, [name]: value };
    setPersonalInfo(updatedInfo);
    onUpdateAll(updatedInfo); 
  };

  return (
    <motion.div 
      className="space-y-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Personal Information */}
      <motion.div 
        className="bg-white rounded-xl p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300"
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.2 }}
      >
        <motion.h2 
          className="text-2xl font-bold text-gray-800 mb-2 bg-gradient-to-r from-[#901b20] to-red-700 bg-clip-text text-transparent"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Personal Information
        </motion.h2>
        <motion.p 
          className="text-gray-600 text-sm mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Update your profile details and preferences.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          {/* Full Name */}
          <motion.div 
            className="md:col-span-1 space-y-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div>
              <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700 mb-2">First Name *</label>
              <motion.input
                type="text" 
                name="firstName" 
                id="firstName" 
                value={personalInfo.firstName} 
                onChange={handleChange}
                placeholder="Enter your first name"
                className="block w-full border border-gray-300 rounded-lg shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#901b20] focus:border-[#901b20] sm:text-sm transition-all duration-200 hover:border-gray-400"
                whileFocus={{ scale: 1.02 }}
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-semibold text-gray-700 mb-2">Last Name *</label>
              <motion.input
                type="text" 
                name="lastName" 
                id="lastName" 
                value={personalInfo.lastName} 
                onChange={handleChange}
                placeholder="Enter your last name"
                className="block w-full border border-gray-300 rounded-lg shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#901b20] focus:border-[#901b20] sm:text-sm transition-all duration-200 hover:border-gray-400"
                whileFocus={{ scale: 1.02 }}
              />
            </div>
          </motion.div>

          {/* Current Job Title */}
          <motion.div 
            className="md:col-span-1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">Current Job Title *</label>
            <motion.input
              type="text" 
              name="title" 
              id="title" 
              value={personalInfo.title} 
              onChange={handleChange}
              placeholder="e.g., Frontend Developer, Software Engineer"
              className="block w-full border border-gray-300 rounded-lg shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#901b20] focus:border-[#901b20] sm:text-sm transition-all duration-200 hover:border-gray-400"
              whileFocus={{ scale: 1.01 }}
            />
          </motion.div>

          {/* Location */}
          <motion.div 
            className="md:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <label htmlFor="governorate" className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
            <motion.input
              type="text" 
              name="governorate" 
              id="governorate" 
              value={personalInfo.governorate} 
              onChange={handleChange}
              className="block w-full border border-gray-300 rounded-lg shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#901b20] focus:border-[#901b20] sm:text-sm transition-all duration-200 hover:border-gray-400"
              placeholder="e.g., Cairo, Alexandria, Giza"
              whileFocus={{ scale: 1.01 }}
            />
          </motion.div>
        </div>
      </motion.div>

      {/* About Me (Short Bio) */}
      <motion.div 
        className="bg-white rounded-xl p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        whileHover={{ scale: 1.01 }}
      >
        <motion.h2 
          className="text-2xl font-bold text-gray-800 mb-2 bg-gradient-to-r from-[#901b20] to-red-700 bg-clip-text text-transparent"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          About Me (Short Bio)
        </motion.h2>
        <motion.p 
          className="text-gray-600 text-sm mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          Craft a compelling bio that highlights your skills, experience, and aspirations.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <motion.textarea
            name="summary"
            id="summary"
            rows="6"
            value={personalInfo.summary}
            onChange={handleChange}
            className="block w-full border border-gray-300 rounded-lg shadow-sm py-4 px-4 focus:outline-none focus:ring-2 focus:ring-[#901b20] focus:border-[#901b20] sm:text-sm resize-y transition-all duration-200 hover:border-gray-400"
            placeholder="Tell us about yourself, your passions, experience, and what drives you in your career..."
            maxLength={300}
            whileFocus={{ scale: 1.01 }}
          ></motion.textarea>
          <motion.div 
            className="text-right text-xs text-gray-500 mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.7 }}
          >
            <span className={personalInfo.summary.length > 250 ? 'text-red-500 font-medium' : ''}>
              {personalInfo.summary.length}
            </span> / 300 characters
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default PersonalInfoForm;
