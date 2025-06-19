// src/features/student/pages/EditProfilePage.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../../../components/Layout/Navbar';
import dummyProfileData from '../data/profileData'; 

import PersonalInfoForm from '../components/profile/edit/PersonalInfoForm';
import ContactInfoForm from '../components/profile/edit/ContactInfoForm';
import SkillsAndCertificatesForm from '../components/profile/edit/SkillsAndCertificatesForm';
import ProjectsAndPortfolioForm from '../components/profile/edit/ProjectsAndPortfolioForm';
import EducationAndExperienceForm from '../components/profile/edit/EducationAndExperienceForm';

function EditProfilePage() {
  const navigate = useNavigate();

  const tabs = [
    { id: 'personal', name: 'Personal Information' },
    { id: 'contact', name: 'Contact & Social' },
    { id: 'education-experience', name: 'Education & Experience' },
    { id: 'skills-certs', name: 'Skills & Certificates' },
    { id: 'projects-portfolio', name: 'Projects & Portfolio' },
  ];

  const [activeTab, setActiveTab] = useState(tabs[0].id); 
  // بيانات البروفايل التي سيتم تحريرها
  const [profileDataToEdit, setProfileDataToEdit] = useState({
    firstName: dummyProfileData.firstName || '',
    lastName: dummyProfileData.lastName || '',
    title: dummyProfileData.title || '',
    company: dummyProfileData.company || '',
    summary: dummyProfileData.summary || '',
    profilePicture: dummyProfileData.profilePicture || '',
    email: dummyProfileData.email || '',
    phone: dummyProfileData.phone || '',
    whatsapp: dummyProfileData.whatsapp || '',
    linkedin: dummyProfileData.linkedin || '',
    github: dummyProfileData.github || '',
    portfolioUrl: dummyProfileData.portfolioUrl || '',
    governorate: dummyProfileData.governorate || '',
    availableForFreelance: dummyProfileData.availableForFreelance || false,
    educations: dummyProfileData.educations || [], 
    workExperiences: dummyProfileData.workExperiences || [], 
    skills: dummyProfileData.skills || [],
    achievements: dummyProfileData.achievements || [],
    projects: dummyProfileData.projects || [],
  });

  // دالة لتحديث أي جزء من بيانات البروفايل
  const handleProfileDataChange = (section, newData) => {
    setProfileDataToEdit(prevData => ({
      ...prevData,
      [section]: newData,
    }));
  };

  // Animation variants
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const tabContentVariants = {
    hidden: { 
      opacity: 0, 
      x: 20,
      scale: 0.95 
    },
    visible: { 
      opacity: 1, 
      x: 0,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    },
    exit: { 
      opacity: 0, 
      x: -20,
      scale: 0.95,
      transition: {
        duration: 0.3,
        ease: "easeIn"
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Final Data to Save (Dummy):', profileDataToEdit);

   

    alert('Profile updated successfully (dummy data)!');
    navigate('/student/profile'); 
  };  
  
  return (
    <>
      <Navbar />
      <motion.div 
        className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen py-8"
        variants={pageVariants}
        initial="initial"
        animate="animate"
      >
      <div className="container mx-auto px-4">
        <motion.div 
          className="bg-white rounded-2xl shadow-2xl p-8 mb-6 max-w-5xl mx-auto border border-gray-200"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >          
          <motion.h1 
            className="text-4xl font-bold text-gray-900 mb-8 text-center bg-iti-gradient-text"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Edit Profile
          </motion.h1>

          {/* Tab Navigation */}
          <motion.div 
            className="border-b border-gray-200 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <nav className="-mb-px flex flex-wrap justify-center gap-2 lg:gap-8" aria-label="Tabs">
              {tabs.map((tab, index) => (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}                  
                  className={`relative px-4 py-3 border-b-2 font-medium text-sm transition-all duration-300 ease-in-out whitespace-nowrap
                    ${activeTab === tab.id
                      ? 'text-[#901b20] border-[#901b20] bg-red-50'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                    }
                    rounded-t-lg
                  `}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 + (index * 0.1) }}
                >
                  {activeTab === tab.id && (
                    <motion.div
                      className="absolute inset-0 bg-iti-gradient-light rounded-t-lg"
                      layoutId="activeEditTab"
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30
                      }}
                    />
                  )}
                  <span className="relative z-10">{tab.name}</span>
                </motion.button>
              ))}
            </nav>
          </motion.div>

          <motion.form 
            onSubmit={handleSubmit} 
            className="space-y-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            {/* عرض المكون الفرعي بناءً على الـ activeTab */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                variants={tabContentVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                {activeTab === 'personal' && (
                  <motion.div
                    className="bg-gray-50 rounded-xl p-6 border border-gray-200"
                    whileHover={{ scale: 1.005 }}
                    transition={{ duration: 0.2 }}
                  >
                    <PersonalInfoForm
                      data={profileDataToEdit}
                      onUpdateAll={(newData) => {
                          setProfileDataToEdit(prevData => ({
                              ...prevData,
                              firstName: newData.firstName,
                              lastName: newData.lastName,
                              title: newData.title,
                              company: newData.company, 
                              summary: newData.summary,
                              profilePicture: newData.profilePicture,
                              governorate: newData.governorate, // Location
                          }));
                      }}
                    />
                  </motion.div>
                )}

                {activeTab === 'contact' && (
                  <motion.div
                    className="bg-gray-50 rounded-xl p-6 border border-gray-200"
                    whileHover={{ scale: 1.005 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ContactInfoForm
                      data={profileDataToEdit}
                      onUpdateAll={(newData) => {
                          setProfileDataToEdit(prevData => ({
                              ...prevData,
                              email: newData.email,
                              phone: newData.phone,
                              whatsapp: newData.whatsapp,
                              linkedin: newData.linkedin,
                              github: newData.github,
                              portfolioUrl: newData.portfolioUrl,
                              availableForFreelance: newData.availableForFreelance, 
                          }));
                      }}
                    />
                  </motion.div>
                )}

                {activeTab === 'education-experience' && ( 
                  <motion.div
                    className="bg-gray-50 rounded-xl p-6 border border-gray-200"
                    whileHover={{ scale: 1.005 }}
                    transition={{ duration: 0.2 }}
                  >
                    <EducationAndExperienceForm
                      educations={profileDataToEdit.educations}
                      workExperiences={profileDataToEdit.workExperiences}
                      onUpdateEducations={(newEducations) => handleProfileDataChange('educations', newEducations)}
                      onUpdateWorkExperiences={(newWorkExperiences) => handleProfileDataChange('workExperiences', newWorkExperiences)}
                    />
                  </motion.div>
                )}

                {activeTab === 'skills-certs' && (
                  <motion.div
                    className="bg-gray-50 rounded-xl p-6 border border-gray-200"
                    whileHover={{ scale: 1.005 }}
                    transition={{ duration: 0.2 }}
                  >
                    <SkillsAndCertificatesForm
                      skills={profileDataToEdit.skills}
                      achievements={profileDataToEdit.achievements}
                      onUpdateSkills={(newSkills) => handleProfileDataChange('skills', newSkills)}
                      onUpdateAchievements={(newAchievements) => handleProfileDataChange('achievements', newAchievements)}
                    />
                  </motion.div>
                )}

                {activeTab === 'projects-portfolio' && (
                  <motion.div
                    className="bg-gray-50 rounded-xl p-6 border border-gray-200"
                    whileHover={{ scale: 1.005 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ProjectsAndPortfolioForm
                      projects={profileDataToEdit.projects}
                      onUpdateProjects={(newProjects) => handleProfileDataChange('projects', newProjects)}
                    />
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>

            
            <motion.div 
              className="pt-6 flex justify-end space-x-4 border-t border-gray-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.6 }}
            >
              <motion.button
                type="button"
                onClick={() => navigate('/student/profile')}
                className="inline-flex justify-center py-3 px-6 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200"
                whileHover={{ scale: 1.02, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)" }}
                whileTap={{ scale: 0.98 }}
              >
                Cancel
              </motion.button>              
              <motion.button
                type="submit"
                className="inline-flex justify-center py-3 px-8 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-iti-gradient hover:bg-iti-gradient-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-iti-primary transition-all duration-200"
                whileHover={{ 
                  scale: 1.02, 
                  boxShadow: "0 8px 20px rgba(220, 38, 38, 0.3)" 
                }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  Save Changes
                </motion.span>
              </motion.button>
            </motion.div>
          </motion.form>
        </motion.div>
      </div>
    </motion.div>
    </>
  );
}

export default EditProfilePage;
