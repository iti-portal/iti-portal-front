// src/features/Student/Profile/ProfilePage.js

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../../../components/Layout/Navbar';
import ProfileHeader from './components/ProfileHeader';
import ProfileNavigation from './components/ProfileNavigation';
import ProfileSectionCard from './components/ProfileSectionCard';

import ExperienceCard from './components/ExperienceCard';
import EducationCard from './components/EducationCard';
import SkillItem from './components/SkillItem';
import CertificateCard from './components/CertificateCard';
import ProjectCard from './components/ProjectCard';

import dummyProfileData from './profileData';

function ProfilePage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [profileData, setProfileData] = useState(dummyProfileData);

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
  };

  const handlePhotoUpdate = (photoType, newPhoto) => {
    setProfileData(prevData => ({
      ...prevData,
      [photoType === 'profile' ? 'profilePicture' : 'coverPhoto']: newPhoto
    }));
  };
  // Animation variants for tab content
  const tabContentVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.95 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeInOut",
        staggerChildren: 0.1
      }
    },
    exit: { 
      opacity: 0, 
      y: -20,
      scale: 0.95,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.9 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  const renderTabContent = () => {
    const getTabContent = () => {
      switch (activeTab) {
        case 'overview':
          return (
            <>              <motion.div variants={cardVariants}>
                <ProfileSectionCard title="About Me">
                  <p className="text-gray-700 leading-relaxed text-base">{profileData.summary}</p>
                </ProfileSectionCard>
              </motion.div>              <motion.div variants={cardVariants}>
                <ProfileSectionCard title="Contact Information">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Email */}
                    <motion.div
                      whileHover={{ 
                        scale: 1.02,
                        boxShadow: "0 8px 25px rgba(144, 27, 32, 0.15)"
                      }}
                      className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200 hover:border-[#901b20] transition-all duration-300"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center shadow-lg">
                          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Email</p>
                          <a 
                            href={`mailto:${profileData.email}`} 
                            className="text-gray-800 hover:text-[#901b20] transition-colors duration-200 font-medium text-sm truncate block"
                          >
                            {profileData.email}
                          </a>
                        </div>
                      </div>
                    </motion.div>

                    {/* Phone */}
                    <motion.div
                      whileHover={{ 
                        scale: 1.02,
                        boxShadow: "0 8px 25px rgba(144, 27, 32, 0.15)"
                      }}
                      className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200 hover:border-[#901b20] transition-all duration-300"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
                          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Phone</p>
                          <p className="text-gray-800 font-medium text-sm">{profileData.phone}</p>
                        </div>
                      </div>
                    </motion.div>

                    {/* Location */}
                    <motion.div
                      whileHover={{ 
                        scale: 1.02,
                        boxShadow: "0 8px 25px rgba(144, 27, 32, 0.15)"
                      }}
                      className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200 hover:border-[#901b20] transition-all duration-300"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center shadow-lg">
                          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Location</p>
                          <p className="text-gray-800 font-medium text-sm">{profileData.governorate}, Egypt</p>
                        </div>
                      </div>
                    </motion.div>

                    {/* LinkedIn */}
                    {profileData.linkedin && (
                      <motion.div
                        whileHover={{ 
                          scale: 1.02,
                          boxShadow: "0 8px 25px rgba(144, 27, 32, 0.15)"
                        }}
                        className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200 hover:border-[#901b20] transition-all duration-300"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-lg">
                            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                            </svg>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">LinkedIn</p>
                            <a 
                              href={profileData.linkedin} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-gray-800 hover:text-[#901b20] transition-colors duration-200 font-medium text-sm truncate block"
                            >
                              {profileData.linkedin.replace(/(https?:\/\/)?(www\.)?linkedin\.com\/in\//, '')}
                            </a>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* GitHub */}
                    {profileData.github && (
                      <motion.div
                        whileHover={{ 
                          scale: 1.02,
                          boxShadow: "0 8px 25px rgba(144, 27, 32, 0.15)"
                        }}
                        className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200 hover:border-[#901b20] transition-all duration-300"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg flex items-center justify-center shadow-lg">
                            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                            </svg>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">GitHub</p>
                            <a 
                              href={profileData.github} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-gray-800 hover:text-[#901b20] transition-colors duration-200 font-medium text-sm truncate block"
                            >
                              {profileData.github.replace(/(https?:\/\/)?(www\.)?github\.com\//, '')}
                            </a>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Portfolio */}
                    {profileData.portfolioUrl && (
                      <motion.div
                        whileHover={{ 
                          scale: 1.02,
                          boxShadow: "0 8px 25px rgba(144, 27, 32, 0.15)"
                        }}
                        className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200 hover:border-[#901b20] transition-all duration-300"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 01-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15 13.586V12a1 1 0 011-1z" clipRule="evenodd"/>
                            </svg>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Portfolio</p>
                            <a 
                              href={profileData.portfolioUrl} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-gray-800 hover:text-[#901b20] transition-colors duration-200 font-medium text-sm truncate block"
                            >
                              {profileData.portfolioUrl.replace(/(https?:\/\/)?(www\.)?/, '')}
                            </a>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* WhatsApp */}
                    {profileData.whatsapp && (
                      <motion.div
                        whileHover={{ 
                          scale: 1.02,
                          boxShadow: "0 8px 25px rgba(144, 27, 32, 0.15)"
                        }}
                        className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200 hover:border-[#901b20] transition-all duration-300"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center shadow-lg">
                            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.520-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.531 3.488"/>
                            </svg>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">WhatsApp</p>
                            <a 
                              href={`https://wa.me/${profileData.whatsapp.replace(/\D/g, '')}`} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-gray-800 hover:text-[#901b20] transition-colors duration-200 font-medium text-sm"
                            >
                              {profileData.whatsapp}
                            </a>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Freelance Availability */}
                    {profileData.availableForFreelance && (
                      <motion.div
                        whileHover={{ 
                          scale: 1.02,
                          boxShadow: "0 8px 25px rgba(144, 27, 32, 0.15)"
                        }}
                        className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-4 border border-green-200 hover:border-green-400 transition-all duration-300"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center shadow-lg">
                            <motion.div
                              animate={{ 
                                scale: [1, 1.1, 1],
                                rotate: [0, 5, -5, 0]
                              }}
                              transition={{ 
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut"
                              }}
                            >
                              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                              </svg>
                            </motion.div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Availability</p>
                            <div className="flex items-center space-x-2">
                              <motion.span
                                className="w-2 h-2 bg-green-500 rounded-full"
                                animate={{ 
                                  scale: [1, 1.3, 1],
                                  opacity: [1, 0.6, 1]
                                }}
                                transition={{ 
                                  duration: 1.5,
                                  repeat: Infinity,
                                  ease: "easeInOut"
                                }}
                              />
                              <span className="text-green-700 font-semibold text-sm">Available for Freelance</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </ProfileSectionCard>
              </motion.div>

              {profileData.skills.length > 0 && (
                <motion.div variants={cardVariants}>
                  <ProfileSectionCard title="Top Skills">
                    <div className="flex flex-wrap gap-3">
                      {profileData.skills.slice(0, 5).map((skill, index) => (
                        <motion.div
                          key={skill.id}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ 
                            duration: 0.3,
                            delay: index * 0.1,
                            ease: "easeOut"
                          }}
                          whileHover={{ 
                            scale: 1.05,
                            transition: { duration: 0.2 }
                          }}
                        >
                          <SkillItem skill={skill} />
                        </motion.div>
                      ))}
                    </div>
                  </ProfileSectionCard>
                </motion.div>
              )}

              {profileData.workExperiences.length > 0 && (
                <motion.div variants={cardVariants}>
                  <ProfileSectionCard title="Latest Experience">
                    {profileData.workExperiences.slice(0, 1).map(exp => (
                      <motion.div
                        key={exp.id}
                        whileHover={{ scale: 1.01 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ExperienceCard data={exp} />
                      </motion.div>
                    ))}
                  </ProfileSectionCard>
                </motion.div>
              )}

              {profileData.educations.length > 0 && (
                <motion.div variants={cardVariants}>
                  <ProfileSectionCard title="Latest Education">
                    {profileData.educations.slice(0, 1).map(edu => (
                      <motion.div
                        key={edu.id}
                        whileHover={{ scale: 1.01 }}
                        transition={{ duration: 0.2 }}
                      >
                        <EducationCard data={edu} />
                      </motion.div>
                    ))}
                  </ProfileSectionCard>
                </motion.div>
              )}
            </>
          );

        case 'education-experience':
          return (
            <>
              {profileData.workExperiences.length > 0 && (
                <motion.div variants={cardVariants}>
                  <ProfileSectionCard title="Work Experience">
                    {profileData.workExperiences.map((exp, index) => (
                      <motion.div
                        key={exp.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ 
                          duration: 0.4,
                          delay: index * 0.1,
                          ease: "easeOut"
                        }}
                        whileHover={{ scale: 1.01 }}
                        className="mb-4 last:mb-0"
                      >
                        <ExperienceCard data={exp} />
                      </motion.div>
                    ))}
                  </ProfileSectionCard>
                </motion.div>
              )}
              {profileData.educations.length > 0 && (
                <motion.div variants={cardVariants}>
                  <ProfileSectionCard title="Education & Qualifications">
                    {profileData.educations.map((edu, index) => (
                      <motion.div
                        key={edu.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ 
                          duration: 0.4,
                          delay: index * 0.1,
                          ease: "easeOut"
                        }}
                        whileHover={{ scale: 1.01 }}
                        className="mb-4 last:mb-0"
                      >
                        <EducationCard data={edu} />
                      </motion.div>
                    ))}
                  </ProfileSectionCard>
                </motion.div>
              )}
              {profileData.workExperiences.length === 0 && profileData.educations.length === 0 && (
                <motion.div variants={cardVariants}>
                  <ProfileSectionCard>
                    <p className="text-gray-600 text-center">No education or experience data to display.</p>
                  </ProfileSectionCard>
                </motion.div>
              )}
            </>
          );

        case 'skills-certificates':
          return (
            <>
              {profileData.skills.length > 0 && (
                <motion.div variants={cardVariants}>
                  <ProfileSectionCard title="Skills">
                    <div className="flex flex-wrap gap-3">
                      {profileData.skills.map((skill, index) => (
                        <motion.div
                          key={skill.id}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ 
                            duration: 0.3,
                            delay: index * 0.05,
                            ease: "easeOut"
                          }}
                          whileHover={{ 
                            scale: 1.05,
                            transition: { duration: 0.2 }
                          }}
                        >
                          <SkillItem skill={skill} />
                        </motion.div>
                      ))}
                    </div>
                  </ProfileSectionCard>
                </motion.div>
              )}
              {profileData.achievements.length > 0 && (
                <motion.div variants={cardVariants}>
                  <ProfileSectionCard title="Certificates">
                    {profileData.achievements.filter(ach => ach.type === 'certificate').map((cert, index) => (
                      <motion.div
                        key={cert.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ 
                          duration: 0.4,
                          delay: index * 0.1,
                          ease: "easeOut"
                        }}
                        whileHover={{ scale: 1.01 }}
                        className="mb-4 last:mb-0"
                      >
                        <CertificateCard data={cert} />
                      </motion.div>
                    ))}
                  </ProfileSectionCard>
                </motion.div>
              )}
              {profileData.skills.length === 0 && profileData.achievements.length === 0 && (
                <motion.div variants={cardVariants}>
                  <ProfileSectionCard>
                    <p className="text-gray-600 text-center">No skills or certificates to display.</p>
                  </ProfileSectionCard>
                </motion.div>
              )}
            </>
          );

        case 'projects-portfolio':
          return (
            <>
              {profileData.projects.length > 0 ? (
                <motion.div variants={cardVariants}>
                  <ProfileSectionCard title="Projects & Portfolio">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {profileData.projects.map((project, index) => (
                        <motion.div
                          key={project.id}
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ 
                            duration: 0.5,
                            delay: index * 0.1,
                            ease: "easeOut"
                          }}
                          whileHover={{ 
                            scale: 1.03,
                            y: -5,
                            transition: { duration: 0.2 }
                          }}
                        >
                          <ProjectCard data={project} />
                        </motion.div>
                      ))}
                    </div>
                  </ProfileSectionCard>
                </motion.div>
              ) : (
                <motion.div variants={cardVariants}>
                  <ProfileSectionCard>
                    <p className="text-gray-600 text-center">No projects to display.</p>
                  </ProfileSectionCard>
                </motion.div>
              )}
            </>
          );

        default:
          return (
            <motion.div variants={cardVariants}>
              <ProfileSectionCard>
                <p className="text-gray-600 text-center">Tab not found.</p>
              </ProfileSectionCard>
            </motion.div>
          );
      }
    };

    return (
      <motion.div
        key={activeTab}
        variants={tabContentVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        {getTabContent()}
      </motion.div>
    );
  };  return (
    <>
      <Navbar />
      <motion.div 
        className="min-h-screen pb-10 bg-gray-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <ProfileHeader 
            data={profileData} 
            onUpdatePhoto={handlePhotoUpdate}
          />
          </motion.div>

          <motion.div 
            className="mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <ProfileNavigation activeTab={activeTab} onTabChange={handleTabChange} />
          </motion.div>

          <div className="mt-6">
            <AnimatePresence mode="wait">
              {renderTabContent()}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </>
  );
}

export default ProfilePage;
