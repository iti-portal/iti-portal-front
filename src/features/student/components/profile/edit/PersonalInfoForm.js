// src/features/student/components/profile/edit/PersonalInfoForm.js

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
        <motion.h2          className="text-2xl font-bold text-gray-800 mb-2 bg-iti-gradient-text"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Personal Information
        </motion.h2>
        
        <p className="text-gray-600 mb-6">Update your personal details and professional headline.</p>
        
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
              value={personalInfo.firstName}
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
              value={personalInfo.lastName}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#901b20] focus:border-[#901b20]"
            />
          </div>
        </div>
        
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Professional Title
            </label>
            <input
              type="text"
              name="title"
              id="title"
              value={personalInfo.title}
              onChange={handleChange}
              placeholder="e.g. Full Stack Developer"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#901b20] focus:border-[#901b20]"
            />
          </div>
          
          <div>
            <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
              Company/Organization
            </label>
            <input
              type="text"
              name="company"
              id="company"
              value={personalInfo.company}
              onChange={handleChange}
              placeholder="e.g. Tech Solutions"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#901b20] focus:border-[#901b20]"
            />
          </div>
        </div>
        
        <div className="mt-6">
          <label htmlFor="governorate" className="block text-sm font-medium text-gray-700 mb-2">
            Location
          </label>
          <select
            name="governorate"
            id="governorate"
            value={personalInfo.governorate}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#901b20] focus:border-[#901b20]"
          >
            <option value="">Select Governorate</option>
            <option value="Cairo">Cairo</option>
            <option value="Alexandria">Alexandria</option>
            <option value="Giza">Giza</option>
            <option value="Sharqia">Sharqia</option>
            <option value="Dakahlia">Dakahlia</option>
            <option value="Gharbia">Gharbia</option>
            <option value="Beheira">Beheira</option>
            <option value="Ismailia">Ismailia</option>
            <option value="Port Said">Port Said</option>
            <option value="Suez">Suez</option>
            <option value="Fayoum">Fayoum</option>
            <option value="Beni Suef">Beni Suef</option>
            <option value="Minya">Minya</option>
            <option value="Asyut">Asyut</option>
            <option value="Sohag">Sohag</option>
            <option value="Qena">Qena</option>
            <option value="Luxor">Luxor</option>
            <option value="Aswan">Aswan</option>
            <option value="Other">Other</option>
          </select>
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
            value={personalInfo.summary}
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
