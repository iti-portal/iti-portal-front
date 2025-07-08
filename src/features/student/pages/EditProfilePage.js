// src/features/student/pages/EditProfilePage.js

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../../../components/Layout/Navbar';
import Alert from '../../../components/UI/Alert';
import { useProfile } from '../../../hooks/useProfile';
import { updateUserProfile } from '../../../services/profileService';

import PersonalInfoForm from '../components/profile/edit/PersonalInfoForm';
import ContactInfoForm from '../components/profile/edit/ContactInfoForm';
import SkillsAndCertificatesForm from '../components/profile/edit/SkillsAndCertificatesForm';
import ProjectManagement from '../components/profile/edit/ProjectManagement';
import EducationAndExperienceForm from '../components/profile/edit/EducationAndExperienceForm';

// Animation variants
const pageVariants = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9 }
};

const tabContentVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 }
};

function EditProfilePage() {
  const navigate = useNavigate();
  const { profile, loading, error, refreshProfile } = useProfile();
  const [activeTab, setActiveTab] = useState('personal');
  const [profileData, setProfileData] = useState({});
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);

  const tabs = [
    { id: 'personal', name: 'Personal Information' },
    { id: 'contact', name: 'Contact & Social' },
    { id: 'education-experience', name: 'Education & Experience' },
    { id: 'skills-certs', name: 'Skills & Certificates' },
    { id: 'projects-portfolio', name: 'Projects & Portfolio' },
  ];

  // Initialize form data when profile loads
  useEffect(() => {
    if (profile?.user) {
      const user = profile.user;
      const userProfile = user.profile || {};
      
      setProfileData({
        // Personal Information
        firstName: userProfile.first_name || user.first_name || '',
        lastName: userProfile.last_name || user.last_name || '',
        username: userProfile.username || user.username || '',
        job_profile: userProfile.job_profile || user.job_profile || '',
        // About Me
        summary: userProfile.summary || userProfile.bio || '',
        
        // Contact Information
        email: user.email || '',
        phone: userProfile.phone || '',
        whatsapp: userProfile.whatsapp || '',
        linkedin: userProfile.linkedin || '',
        github: userProfile.github || '',
        portfolioUrl: userProfile.portfolio_url || '',
        availableForFreelance: userProfile.available_for_freelance || false,
        
        // ITI Information
        branch: userProfile.branch || '',
        program: userProfile.program || '',
        track: userProfile.track || '',
        intake: userProfile.intake || '',
        studentStatus: userProfile.student_status || '',
        
        // Collections
        educations: user.educations || [],
        workExperiences: user.work_experiences || [],
        skills: user.skills || [],
        certificates: user.certificates || [],
        awards: user.awards || [],
        projects: user.projects || [],
      });
    }
  }, [profile]);

  // Get user ID for API calls
  const userId = profile?.user?.id;

  // Update profile data helper
  const handleProfileDataChange = (field, value) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Prepare data for API call - map to backend field names
      const apiData = {
        first_name: profileData.firstName,
        last_name: profileData.lastName,
        username: profileData.username,
        job_profile: profileData.job_profile,
        summary: profileData.summary,
        phone: profileData.phone,
        whatsapp: profileData.whatsapp,
        linkedin: profileData.linkedin,
        github: profileData.github,
        portfolio_url: profileData.portfolioUrl,
        available_for_freelance: profileData.availableForFreelance,
      };

      const result = await updateUserProfile(apiData);
      
      if (result.success) {
        // Refresh profile data to show updated information
        await refreshProfile();
        setShowSuccessNotification(true);
        // Hide notification after 3 seconds
        setTimeout(() => setShowSuccessNotification(false), 3000);
        navigate('/student/profile');
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert(`Error updating profile: ${error.message}`);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#901b20]"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-600 mb-4">Error loading profile: {error}</p>
            <button 
              onClick={() => navigate('/student/profile')}
              className="px-4 py-2 bg-[#901b20] text-white rounded hover:bg-[#7a1519]"
            >
              Back to Profile
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      
      {/* Success Notification */}
      <Alert
        show={showSuccessNotification}
        type="success"
        message="Profile updated successfully! All changes have been saved."
        onClose={() => setShowSuccessNotification(false)}
      />
      
      <motion.div 
        className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen py-8"
        variants={pageVariants}
        initial="initial"
        animate="animate"
      >
        <div className="container mx-auto px-4 py-20">
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
                    type="button"
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
              {/* Tab Content */}
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
                        data={profileData}
                        onUpdateAll={(newData) => {
                          setProfileData(prevData => ({
                            ...prevData,
                            ...newData
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
                        data={profileData}
                        onUpdateAll={(newData) => {
                          setProfileData(prevData => ({
                            ...prevData,
                            ...newData
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
                        educations={profileData.educations}
                        workExperiences={profileData.workExperiences}
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
                        skills={profileData.skills}
                        certificates={profileData.certificates}
                        awards={profileData.awards}
                        onUpdateSkills={(newSkills) => handleProfileDataChange('skills', newSkills)}
                        onUpdateCertificates={(newCertificates) => handleProfileDataChange('certificates', newCertificates)}
                        onUpdateAwards={(newAwards) => handleProfileDataChange('awards', newAwards)}
                        userId={userId}
                      />
                    </motion.div>
                  )}

                  {activeTab === 'projects-portfolio' && (
                    <motion.div
                      className="bg-gray-50 rounded-xl p-6 border border-gray-200"
                      whileHover={{ scale: 1.005 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ProjectManagement
                        projects={profileData.projects}
                        onUpdateProjects={(newProjects) => handleProfileDataChange('projects', newProjects)}
                        userId={userId}
                        showNotifications={true}
                      />
                    </motion.div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Action Buttons */}
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
