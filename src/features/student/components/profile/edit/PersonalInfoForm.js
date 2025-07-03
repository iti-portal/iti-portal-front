// src/features/student/components/profile/edit/PersonalInfoForm.js

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

function PersonalInfoForm({ data = {}, onUpdateAll }) {
  const [personalInfo, setPersonalInfo] = useState({
    firstName: data?.firstName || '',
    lastName: data?.lastName || '',
    username: data?.username || '',
    summary: data?.summary || '', // About Me
    job_profile: data?.job_profile || '', // Job Profile
  });

  useEffect(() => {
    setPersonalInfo({
      firstName: data?.firstName || '',
      lastName: data?.lastName || '',
      username: data?.username || '',
      summary: data?.summary || '',
      job_profile: data?.job_profile || '',
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
        <motion.h2          className="text-2xl font-bold text-gray-800 mb-2 bg-iti-gradient-text"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Personal Information
        </motion.h2>
        
        <p className="text-gray-600 mb-6">Update your basic personal information and username.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
              First Name*
            </label>
            <input
              type="text"
              name="firstName"
              id="firstName"
              required
              value={personalInfo.firstName || ''}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#901b20] focus:border-[#901b20]"
            />
          </div>
          
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
              Last Name*
            </label>
            <input
              type="text"
              name="lastName"
              id="lastName"
              required
              value={personalInfo.lastName || ''}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#901b20] focus:border-[#901b20]"
            />
          </div>
        </div>
        
        <div className="mt-6">
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
            Username*
          </label>
          <input
            type="text"
            name="username"
            id="username"
            required
            value={personalInfo.username || ''}
            onChange={handleChange}
            placeholder="e.g. john_doe"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#901b20] focus:border-[#901b20]"
          />
          <p className="text-xs text-gray-500 mt-1">
            Choose a unique username that represents you professionally.
          </p>
        </div>
          <div className="mt-6">
          <label htmlFor="job_profile" className="block text-sm font-medium text-gray-700 mb-2">
            Job Profile
          </label>
          <input
            type="text"
            name="job_profile"
            id="job_profile"
            value={personalInfo.job_profile || ''}
            onChange={handleChange}
            placeholder="e.g. Full Stack Developer, UI/UX Designer, Data Analyst"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#901b20] focus:border-[#901b20]"
          />
          <p className="text-xs text-gray-500 mt-1">
            Your current job title or desired career path.
          </p>
        </div>
      </motion.div>
      
      {/* About Me Section */}
      <motion.div 
        className="bg-white rounded-xl p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300"        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.2 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <motion.h2          className="text-2xl font-bold text-gray-800 mb-2 bg-iti-gradient-text"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          About Me
        </motion.h2>
        
        <p className="text-gray-600 mb-6">Write a brief introduction about yourself, your skills, and aspirations.</p>
        
        <div>
          <textarea
            name="summary"
            id="summary"
            rows="6"
            value={personalInfo.summary || ''}
            onChange={handleChange}
            placeholder="Describe yourself, your experience, and what you're looking for..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#901b20] focus:border-[#901b20]"
          ></textarea>
          <p className="text-xs text-gray-500 mt-2">
            Pro tip: Keep it concise, highlight your key skills, and mention what you're passionate about.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default PersonalInfoForm;
