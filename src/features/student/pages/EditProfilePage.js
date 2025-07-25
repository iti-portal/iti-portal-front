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

// Import icons for the new design
import { User, Link as LinkIcon, Briefcase, Star, Lightbulb, Save } from 'lucide-react';

function EditProfilePage() {
  // --- ALL EXISTING LOGIC REMAINS UNCHANGED ---
  const navigate = useNavigate();
  const { profile, loading, error, refreshProfile } = useProfile();
  const [activeTab, setActiveTab] = useState('personal');
  const [profileData, setProfileData] = useState({});
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);

  const tabs = [
    { id: 'personal', name: 'Personal Info', icon: <User size={18} /> },
    { id: 'contact', name: 'Contact & Socials', icon: <LinkIcon size={18} /> },
    { id: 'education-experience', name: 'Experience', icon: <Briefcase size={18} /> },
    { id: 'skills-certs', name: 'Skills & Awards', icon: <Star size={18} /> },
    { id: 'projects-portfolio', name: 'Projects', icon: <Lightbulb size={18} /> },
  ];

  useEffect(() => {
    if (profile?.user) {
      const user = profile.user;
      const userProfile = user.profile || {};
      
      setProfileData({
        firstName: userProfile.first_name || user.first_name || '',
        lastName: userProfile.last_name || user.last_name || '',
        username: userProfile.username || user.username || '',
        job_profile: userProfile.job_profile || user.job_profile || '',
        summary: userProfile.summary || userProfile.bio || '',
        email: user.email || '',
        phone: userProfile.phone || '',
        whatsapp: userProfile.whatsapp || '',
        linkedin: userProfile.linkedin || '',
        github: userProfile.github || '',
        portfolioUrl: userProfile.portfolio_url || '',
        availableForFreelance: userProfile.available_for_freelance || false,
        branch: userProfile.branch || '',
        program: userProfile.program || '',
        track: userProfile.track || '',
        intake: userProfile.intake || '',
        studentStatus: userProfile.student_status || '',
        educations: user.educations || [],
        workExperiences: user.work_experiences || [],
        skills: user.skills || [],
        certificates: user.certificates || [],
        awards: user.awards || [],
        projects: user.projects || [],
      });
    }
  }, [profile]);

  const userId = profile?.user?.id;

  const handleProfileDataChange = (field, value) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
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
        await refreshProfile();
        setShowSuccessNotification(true);
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

  const renderTabContent = () => {
    switch (activeTab) {
      case 'personal':
        return <PersonalInfoForm data={profileData} onUpdateAll={(newData) => setProfileData(p => ({...p, ...newData}))} />;
      case 'contact':
        return <ContactInfoForm data={profileData} onUpdateAll={(newData) => setProfileData(p => ({...p, ...newData}))} />;
      case 'education-experience':
        return <EducationAndExperienceForm 
          educations={profileData.educations} 
          workExperiences={profileData.workExperiences} 
          onUpdateEducations={(d) => handleProfileDataChange('educations', d)} 
          onUpdateWorkExperiences={(d) => handleProfileDataChange('workExperiences', d)} 
        />;
      case 'skills-certs':
        return <SkillsAndCertificatesForm skills={profileData.skills} certificates={profileData.certificates} awards={profileData.awards} onUpdateSkills={(d) => handleProfileDataChange('skills', d)} onUpdateCertificates={(d) => handleProfileDataChange('certificates', d)} onUpdateAwards={(d) => handleProfileDataChange('awards', d)} userId={userId} />;
      case 'projects-portfolio':
        return <ProjectManagement projects={profileData.projects} onUpdateProjects={(d) => handleProfileDataChange('projects', d)} userId={userId} showNotifications={true} />;
      default:
        return null;
    }
  };

  return (
    <>
      <Navbar />

      <Alert
        show={showSuccessNotification}
        type="success"
        message="Profile updated successfully! All changes have been saved."
        onClose={() => setShowSuccessNotification(false)}
      />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50 to-red-50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-[#901b20]/10 to-[#203947]/10 rounded-full blur-3xl opacity-50 -z-0"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-gradient-to-tr from-[#203947]/10 to-[#901b20]/10 rounded-full blur-3xl opacity-50 -z-0"></div>

        <motion.main 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5 }} 
          className="w-full max-w-7xl mx-auto px-4 py-24 pb-16"
        >
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800">Edit Your Profile</h1>
            <p className="text-gray-600 text-lg mt-2">Keep your information up to date to get the best opportunities.</p>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border border-white/30 p-4 md:p-6">
            <div className="flex flex-col md:flex-row gap-6 md:gap-8">
              
              <aside className="md:w-1/4">
                {/* FIX #1: Added 'overflow-x-auto' to allow horizontal scrolling on mobile, and padding for aesthetics. */}
                <nav className="sticky top-24 flex flex-row md:flex-col gap-2 md:gap-1 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0">
                  {tabs.map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      /* FIX #2: Replaced 'w-full' with 'flex-shrink-0 md:w-full'
                         - 'flex-shrink-0' prevents buttons from shrinking on mobile.
                         - 'md:w-full' applies full width only on medium screens and up.
                      */
                      className={`relative flex-shrink-0 md:w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold rounded-lg text-left transition-colors ${
                        activeTab === tab.id ? 'text-white' : 'text-gray-600 hover:bg-gray-200/50'
                      }`}
                    >
                      {activeTab === tab.id && (
                        <motion.div
                          layoutId="activeEditTab"
                          className="absolute inset-0 bg-gradient-to-r from-[#901b20] to-[#a83236] rounded-lg shadow-md"
                          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        />
                      )}
                      <span className="relative z-10">{tab.icon}</span>
                      <span className="relative z-10 whitespace-nowrap">{tab.name}</span> {/* Added whitespace-nowrap here to be safe */}
                    </button>
                  ))}
                </nav>
              </aside>

              <div className="md:w-3/4">
                {activeTab === 'personal' || activeTab === 'contact' || activeTab === 'skills-certs' || activeTab === 'projects-portfolio' ? (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                      >
                        {renderTabContent()}
                      </motion.div>
                    </AnimatePresence>
                    <div className="pt-6 flex justify-end items-center gap-3 border-t border-gray-200">
                      <motion.button 
                        type="button" 
                        whileHover={{ scale: 1.05 }} 
                        whileTap={{ scale: 0.95 }} 
                        onClick={() => navigate('/student/profile')} 
                        className="px-5 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition"
                      >
                        Cancel
                      </motion.button>
                      <motion.button 
                        type="submit" 
                        whileHover={{ scale: 1.05 }} 
                        whileTap={{ scale: 0.95 }} 
                        className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#901b20] to-[#a83236] text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all"
                      >
                        <Save size={18} />
                        Save Changes
                      </motion.button>
                    </div>
                  </form>
                ) : (
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTab}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                      {renderTabContent()}
                    </motion.div>
                  </AnimatePresence>
                )}
              </div>
            </div>
          </div>
        </motion.main>
      </div>
    </>
  );
}

export default EditProfilePage;