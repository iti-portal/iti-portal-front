// src/features/student/components/profile/ProfileHeader.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { motion, AnimatePresence } from 'framer-motion';
import { FaLinkedin, FaGithub, FaGlobe, FaWhatsapp, FaEnvelope, FaPhone, FaCamera, FaTimes } from 'react-icons/fa'; // Social media icons
import { IoLocationSharp } from 'react-icons/io5'; // Location icon
import { BsFillCalendarFill } from "react-icons/bs"; // Calendar icon
import { PLACEHOLDERS } from '../../../../utils/placeholders';

// Custom ProfileImage component with fallback URLs
const ProfileImage = ({ src, alt, className, onLoad, onError }) => {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [fallbackIndex, setFallbackIndex] = useState(0);

  // Generate fallback URLs based on the original path
  const generateFallbackUrls = (originalSrc) => {
    if (!originalSrc || originalSrc.startsWith('data:image/svg+xml')) {
      return [];
    }

    // Extract the relative path from the full URL
    const url = new URL(originalSrc);
    const path = url.pathname;
    const baseUrl = 'http://127.0.0.1:8000';
    
    // Try different path patterns
    if (path.includes('/storage/')) {
      const relativePath = path.replace('/storage/', '');
      return [
        `${baseUrl}/storage/${relativePath}`,
        `${baseUrl}/media/${relativePath}`,
        `${baseUrl}/${relativePath}`
      ];
    } else if (path.includes('/media/')) {
      const relativePath = path.replace('/media/', '');
      return [
        `${baseUrl}/media/${relativePath}`,
        `${baseUrl}/storage/${relativePath}`,
        `${baseUrl}/${relativePath}`
      ];
    } else {
      const relativePath = path.substring(1); // Remove leading slash
      return [
        `${baseUrl}/storage/${relativePath}`,
        `${baseUrl}/media/${relativePath}`,
        `${baseUrl}/${relativePath}`
      ];
    }
  };

  const fallbackUrls = generateFallbackUrls(src);

  const handleImageError = (e) => {
    if (fallbackIndex < fallbackUrls.length - 1) {
      const nextFallback = fallbackUrls[fallbackIndex + 1];
      setCurrentSrc(nextFallback);
      setFallbackIndex(fallbackIndex + 1);
    } else {
      setCurrentSrc(PLACEHOLDERS.AVATAR_USER);
      if (onError) onError(e);
    }
  };

  const handleImageLoad = (e) => {
    if (onLoad) onLoad(e);
  };

  return (
    <img
      src={currentSrc || PLACEHOLDERS.AVATAR_USER}
      alt={alt}
      className={className}
      onLoad={handleImageLoad}
      onError={handleImageError}
    />
  );
};

function ProfileHeader({ data, onUpdatePhoto }) {
  const navigate = useNavigate(); 
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [photoType, setPhotoType] = useState(''); // 'profile' or 'cover'

  // Function to format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options); // For English
  };

  const handleEditProfileClick = () => {
    navigate('/student/profile/edit'); 
  };

  const handlePhotoClick = (type) => {
    setPhotoType(type);
    setShowPhotoModal(true);
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file.');
        return;
      }
      
      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert('File size must be less than 2MB.');
        return;
      }

      if (onUpdatePhoto) {
        onUpdatePhoto(photoType, file);
      }
      setShowPhotoModal(false);
    }
  };

  return (
    <>
      <motion.div 
        className="relative bg-white rounded-lg shadow-md mb-6 overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Cover Photo */}
        <motion.div
          className={`relative w-full h-48 cursor-pointer group ${
            data?.profile?.cover_photo 
              ? 'bg-cover bg-center' 
              : 'bg-gradient-to-r from-[#901b20] to-[#b8252b] flex items-center justify-center'
          }`}
          style={data?.profile?.cover_photo ? { backgroundImage: `url(${data.profile.cover_photo})` } : {}}
          onClick={() => handlePhotoClick('cover')}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
        >
          {!data?.profile?.cover_photo && (
            <div className="text-white text-center">
              <FaCamera className="text-4xl mb-2 mx-auto opacity-70" />
              <p className="text-lg font-medium opacity-90">Add Cover Photo</p>
            </div>
          )}
          <motion.div
            className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            whileHover={{ opacity: 1 }}
          >
            <motion.div
              className="flex items-center space-x-2 text-white"
              initial={{ scale: 0.8, opacity: 0 }}
              whileHover={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              <FaCamera className="text-2xl" />
              <span className="text-lg font-medium">Change Cover Photo</span>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Profile Picture & Basic Info */}
        <div className="p-6 relative">
          <motion.div
            className="relative cursor-pointer group"
            onClick={() => handlePhotoClick('profile')}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <ProfileImage
              key={data?.profile?.profile_picture || 'default'}
              src={data?.profile?.profile_picture}
              alt={`${data?.profile?.first_name || 'User'} ${data?.profile?.last_name || ''}'s Profile`}
              className="w-32 h-32 rounded-full border-4 border-white absolute -top-16 left-6 shadow-md object-cover"
            />
            <motion.div
              className="absolute -top-16 left-6 w-32 h-32 rounded-full bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              whileHover={{ opacity: 1 }}
            >
              <FaCamera className="text-white text-xl" />
            </motion.div>
          </motion.div>

          <div className="ml-40 pt-4"> {/* Space for the image */}
            <motion.h1 
              className="text-3xl font-bold text-gray-900"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {data?.profile?.first_name} {data?.profile?.last_name}
            </motion.h1>
            <motion.p 
              className="text-xl text-gray-700 mt-1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {data?.profile?.job_profile || ' '}
            </motion.p>
            <motion.p 
              className="text-gray-600 flex items-center mt-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <IoLocationSharp className="mr-1 text-gray-500" /> <span className="font-bold">{data?.profile?.branch || 'ITI'} </span>&nbsp;<span> Branch </span> &nbsp;|&nbsp;
              <span className="font-bold">{data?.profile?.track || ' '} </span>&nbsp;<span> Track </span>
            </motion.p>
            <motion.p 
              className="text-gray-600 flex items-center mt-1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <BsFillCalendarFill className="mr-1 text-gray-500 text-sm" /> 
              ITI Intake&nbsp;<span className="font-bold">{data?.profile?.intake || 'N/A'}</span>&nbsp;|&nbsp; 
              <span className="font-bold">{data?.profile?.program?.toUpperCase() || ''}&nbsp;</span>|&nbsp;
              <span className="font-bold">
                {data?.profile?.student_status?.toLowerCase() === 'current' 
                  ? 'Current Student' 
                  : `${data?.profile?.student_status?.charAt(0)?.toUpperCase() + data?.profile?.student_status?.slice(1) || 'Student'}`
                }
              </span>
            </motion.p>
          </div>

          {/* Action Buttons */}
          <motion.div 
            className="mt-4 flex space-x-3 justify-end"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >            <motion.button
              onClick={handleEditProfileClick}
              className="bg-iti-primary hover:bg-iti-primary-dark text-white font-semibold py-2 px-4 rounded-full transition duration-300 ease-in-out shadow-lg"
              whileHover={{ scale: 1.05, boxShadow: "0 8px 20px rgba(144, 27, 32, 0.3)" }}
              whileTap={{ scale: 0.95 }}
            >
              Edit Profile
            </motion.button>
          </motion.div>          {/* Contact Information Bar */}
          <motion.div 
            className="mt-6 border-t pt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <div className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-4 border border-gray-200 shadow-sm">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                {/* LinkedIn */}
                {data?.profile?.linkedin && (
                  <motion.a 
                    href={data.profile.linkedin} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center space-x-2 bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-full border border-blue-200 hover:border-blue-300 transition-all duration-300 group"
                    whileHover={{ scale: 1.05, y: -1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaLinkedin className="text-blue-600 text-lg group-hover:text-blue-700" />
                    <span className="text-blue-700 font-medium text-sm group-hover:text-blue-800">LinkedIn</span>
                  </motion.a>
                )}

                {/* GitHub */}
                {data?.profile?.github && (
                  <motion.a 
                    href={data.profile.github} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center space-x-2 bg-gray-50 hover:bg-gray-100 px-3 py-2 rounded-full border border-gray-300 hover:border-gray-400 transition-all duration-300 group"
                    whileHover={{ scale: 1.05, y: -1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaGithub className="text-gray-700 text-lg group-hover:text-gray-900" />
                    <span className="text-gray-700 font-medium text-sm group-hover:text-gray-900">GitHub</span>
                  </motion.a>
                )}

                {/* Portfolio */}
                {data?.profile?.portfolio_url && (
                  <motion.a 
                    href={data.profile.portfolio_url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center space-x-2 bg-purple-50 hover:bg-purple-100 px-3 py-2 rounded-full border border-purple-200 hover:border-purple-300 transition-all duration-300 group"
                    whileHover={{ scale: 1.05, y: -1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaGlobe className="text-purple-600 text-lg group-hover:text-purple-700" />
                    <span className="text-purple-700 font-medium text-sm group-hover:text-purple-800">Portfolio</span>
                  </motion.a>
                )}

                {/* WhatsApp */}
                {data?.profile?.whatsapp && (
                  <motion.a 
                    href={`https://wa.me/${data.profile.whatsapp.replace(/\D/g, '')}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center space-x-2 bg-green-50 hover:bg-green-100 px-3 py-2 rounded-full border border-green-200 hover:border-green-300 transition-all duration-300 group"
                    whileHover={{ scale: 1.05, y: -1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaWhatsapp className="text-green-600 text-lg group-hover:text-green-700" />
                    <span className="text-green-700 font-medium text-sm group-hover:text-green-800">WhatsApp</span>
                  </motion.a>
                )}

                {/* Email */}
                {data?.email && (
                  <motion.a 
                    href={`mailto:${data.email}`} 
                    className="flex items-center space-x-2 bg-red-50 hover:bg-red-100 px-3 py-2 rounded-full border border-red-200 hover:border-red-300 transition-all duration-300 group"
                    whileHover={{ scale: 1.05, y: -1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaEnvelope className="text-iti-primary text-lg group-hover:text-iti-primary-dark" />
                    <span className="text-iti-primary font-medium text-sm group-hover:text-iti-primary-dark truncate max-w-[120px]">{data.email}</span>
                  </motion.a>
                )}

                {/* Phone */}
                {data?.profile?.phone && (
                  <motion.div 
                    className="flex items-center space-x-2 bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-full border border-blue-200 hover:border-blue-300 transition-all duration-300 group cursor-default"
                    whileHover={{ scale: 1.05, y: -1 }}
                  >
                    <FaPhone className="text-blue-600 text-lg group-hover:text-blue-700" />
                    <span className="text-blue-700 font-medium text-sm group-hover:text-blue-800">{data.profile.phone}</span>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Photo Upload Modal */}
      <AnimatePresence>
        {showPhotoModal && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowPhotoModal(false)}
          >
            <motion.div
              className="bg-white rounded-lg p-6 m-4 max-w-md w-full"
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.7, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Change {photoType === 'profile' ? 'Profile' : 'Cover'} Photo
                </h3>
                <button
                  onClick={() => setShowPhotoModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <FaTimes className="text-xl" />
                </button>
              </div>
              
              <div className="space-y-4">
                <label htmlFor="photoUpload" className="cursor-pointer">
                  <motion.div
                    className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-iti-primary transition-colors"
                    whileHover={{ scale: 1.02 }}
                  >
                    <FaCamera className="mx-auto text-3xl text-gray-400 mb-2" />
                    <p className="text-gray-600">Click to select a new photo</p>
                    <p className="text-xs text-gray-400 mt-1">JPG or PNG, max 2MB</p>
                  </motion.div>
                  <input
                    id="photoUpload"
                    type="file"
                    className="sr-only"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                  />
                </label>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default ProfileHeader;
