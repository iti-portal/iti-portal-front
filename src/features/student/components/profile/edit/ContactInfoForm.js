// src/features/student/components/profile/edit/ContactInfoForm.js

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaLinkedin, FaGithub, FaGlobe, FaWhatsapp, FaEnvelope, FaPhone } from 'react-icons/fa';

function ContactInfoForm({ data = {}, onUpdateAll }) {
  const [contactInfo, setContactInfo] = useState({
    email: data.email || '',
    phone: data.phone || '',
    whatsapp: data.whatsapp || '',
    linkedin: data.linkedin || '',
    github: data.github || '',
    portfolioUrl: data.portfolioUrl || '',
    availableForFreelance: data.availableForFreelance || false,
  });

  useEffect(() => {
    setContactInfo({
      email: data.email || '',
      phone: data.phone || '',
      whatsapp: data.whatsapp || '',
      linkedin: data.linkedin || '',
      github: data.github || '',
      portfolioUrl: data.portfolioUrl || '',
      availableForFreelance: data.availableForFreelance || false,
    });
  }, [data]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const updatedValue = type === 'checkbox' ? checked : value;
    const updatedInfo = { ...contactInfo, [name]: updatedValue };
    setContactInfo(updatedInfo);
    onUpdateAll(updatedInfo); 
  };

  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Contact Information */}
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
          Contact Information
        </motion.h2>
        <p className="text-gray-600 mb-6">Update your contact details so recruiters and colleagues can reach you.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          {/* Primary Contact Details */}
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <FaEnvelope className="mr-2 text-[#901b20]" /> Email Address*
              </label>
              <input
                type="email" 
                name="email" 
                id="email" 
                required
                value={contactInfo.email || ''} 
                onChange={handleChange}
                className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#901b20] focus:border-[#901b20]"
                placeholder="your.email@example.com"
              />
            </div>
            
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <FaPhone className="mr-2 text-[#901b20]" /> Phone Number
              </label>
              <input
                type="tel" 
                name="phone" 
                id="phone" 
                value={contactInfo.phone || ''} 
                onChange={handleChange}
                className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#901b20] focus:border-[#901b20]"
                placeholder="+20 10 1234 5678"
              />
            </div>
            
            <div>
              <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <FaWhatsapp className="mr-2 text-green-600" /> WhatsApp Number
              </label>
              <input
                type="tel" 
                name="whatsapp" 
                id="whatsapp" 
                value={contactInfo.whatsapp || ''} 
                onChange={handleChange}
                className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#901b20] focus:border-[#901b20]"
                placeholder="+20 10 1234 5678"
              />
            </div>
          </div>

          {/* Social & Professional Profiles */}
          <div className="space-y-4">
            <div>
              <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <FaLinkedin className="mr-2 text-blue-700" /> LinkedIn Profile
              </label>
              <input
                type="url" 
                name="linkedin" 
                id="linkedin" 
                value={contactInfo.linkedin || ''} 
                onChange={handleChange}
                className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#901b20] focus:border-[#901b20]"
                placeholder="https://linkedin.com/in/yourprofile"
              />
            </div>
            
            <div>
              <label htmlFor="github" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <FaGithub className="mr-2 text-gray-900" /> GitHub Profile
              </label>
              <input
                type="url" 
                name="github" 
                id="github" 
                value={contactInfo.github || ''} 
                onChange={handleChange}
                className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#901b20] focus:border-[#901b20]"
                placeholder="https://github.com/yourusername"
              />
            </div>
            
            <div>
              <label htmlFor="portfolioUrl" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <FaGlobe className="mr-2 text-purple-600" /> Portfolio Website
              </label>
              <input
                type="url" 
                name="portfolioUrl" 
                id="portfolioUrl" 
                value={contactInfo.portfolioUrl || ''} 
                onChange={handleChange}
                className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#901b20] focus:border-[#901b20]"
                placeholder="https://yourportfolio.com"
              />
            </div>
          </div>
        </div>
        
        <div className="mt-6">
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              name="availableForFreelance"
              checked={contactInfo.availableForFreelance || false}
              onChange={handleChange}
              className="form-checkbox h-5 w-5 text-[#901b20] rounded border-gray-300 focus:ring-[#901b20]"
            />
            <span className="ml-2 text-gray-700">I am available for freelance work</span>
          </label>
          <p className="text-sm text-gray-500 mt-1">Check this if you're open to freelance opportunities.</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default ContactInfoForm;
