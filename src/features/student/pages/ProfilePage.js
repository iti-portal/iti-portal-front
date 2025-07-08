// src/features/student/pages/ProfilePage.js

import React, { useState } from 'react';
import ProfileHeader from '../components/profile/ProfileHeader';
import ProfileNavigation from '../components/profile/ProfileNavigation';
import ProfileSectionCard from '../components/profile/ProfileSectionCard';
import Navbar from '../../../components/Layout/Navbar';
import ExperienceCard from '../components/profile/ExperienceCard';
import EducationCard from '../components/profile/EducationCard';
import SkillItem from '../components/profile/SkillItem';
import CertificateCard from '../components/profile/CertificateCard';
import ProjectCard from '../components/profile/ProjectCard';
import { useProfile } from '../../../hooks/useProfile';

function ProfilePage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [notification, setNotification] = useState(null);
  const { profile, loading, error, updatePhoto, updateCover } = useProfile();

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
  };

  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const handlePhotoUpdate = async (photoType, file) => {
    if (!(file instanceof File)) return;

    try {
      setUploadingPhoto(true);
      
      let result;
      if (photoType === 'profile') {
        result = await updatePhoto(file);
      } else if (photoType === 'cover') {
        result = await updateCover(file);
      }
      
      if (result?.success) {
        showNotification(`${photoType === 'profile' ? 'Profile picture' : 'Cover photo'} updated successfully!`, 'success');
      } else {
        showNotification(`Failed to update ${photoType === 'profile' ? 'profile picture' : 'cover photo'}: ${result?.error}`, 'error');
      }
    } catch (error) {
      showNotification(`An error occurred: ${error.message}`, 'error');
    } finally {
      setUploadingPhoto(false);
    }
  };

  // Show loading state
  if (loading || uploadingPhoto) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#901b20] mx-auto mb-4"></div>
            <p className="text-gray-600">
              {uploadingPhoto ? 'Updating profile picture...' : 'Loading profile...'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-red-500 mb-4">
              <span className="material-icons text-4xl">error</span>
            </div>
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-[#901b20] text-white px-4 py-2 rounded hover:bg-[#a83236] transition"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show message if no profile data
  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-gray-600">No profile data available</p>
          </div>
        </div>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <>
            <ProfileSectionCard title="About Me">
              <p className="text-gray-700 leading-relaxed text-base">
                {profile.user?.profile?.summary || 'No summary available'}
              </p>
            </ProfileSectionCard>

            <ProfileSectionCard title="Contact Information">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-4 text-gray-700">
                {/* Email */}
                <div>
                  <p className="text-gray-500 text-sm font-medium">Email</p>
                  <a href={`mailto:${profile.user?.email}`} className="text-gray-800 hover:underline">
                    {profile.user?.email || 'Not provided'}
                  </a>
                </div>

                {/* Phone */}
                <div>
                  <p className="text-gray-500 text-sm font-medium">Phone</p>
                  <p className="text-gray-800">{profile.user?.profile?.phone || 'Not provided'}</p>
                </div>

                {/* WhatsApp */}
                <div>
                  <p className="text-gray-500 text-sm font-medium">WhatsApp</p>
                  {profile.user?.profile?.whatsapp ? (
                    <a href={`https://wa.me/${profile.user.profile.whatsapp}`} target="_blank" rel="noopener noreferrer" className="text-gray-800 hover:underline">
                      {profile.user.profile.whatsapp}
                    </a>
                  ) : (
                    <p className="text-gray-800">Not provided</p>
                  )}
                </div>



                {/* LinkedIn */}
                <div>
                  <p className="text-gray-500 text-sm font-medium">LinkedIn</p>
                  {profile.user?.profile?.linkedin ? (
                    <a href={profile.user.profile.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      View LinkedIn Profile
                    </a>
                  ) : (
                    <p className="text-gray-800">Not provided</p>
                  )}
                </div>

                {/* GitHub */}
                <div>
                  <p className="text-gray-500 text-sm font-medium">GitHub</p>
                  {profile.user?.profile?.github ? (
                    <a href={profile.user.profile.github} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      View GitHub Profile
                    </a>
                  ) : (
                    <p className="text-gray-800">Not provided</p>
                  )}
                </div>

                {/* Portfolio */}
                <div>
                  <p className="text-gray-500 text-sm font-medium">Portfolio</p>
                  {profile.user?.profile?.portfolio_url ? (
                    <a href={profile.user.profile.portfolio_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      View Portfolio
                    </a>
                  ) : (
                    <p className="text-gray-800">Not provided</p>
                  )}
                </div>

                {/* Availability */}
                {profile.user?.profile?.available_for_freelance && (
                  <div> 
                    <p className="text-gray-500 text-sm font-medium">Availability</p>
                    <p className="font-semibold text-green-700">Available for Freelance</p>
                  </div>
                )}
              </div>
            </ProfileSectionCard>

            {profile.user?.skills && profile.user.skills.length > 0 && (
              <ProfileSectionCard title="Top Skills">
                <div className="flex flex-wrap gap-2">
                  {profile.user.skills.slice(0, 5).map(skill => 
                    <SkillItem key={skill.id} skill={skill} />
                  )}
                </div>
              </ProfileSectionCard>
            )}

            {profile.user?.work_experiences && profile.user.work_experiences.length > 0 && (
              <ProfileSectionCard title="Latest Experience">
                {profile.user.work_experiences.slice(0, 1).map(exp => (
                  <ExperienceCard key={exp.id} data={exp} />
                ))}
              </ProfileSectionCard>
            )}

            {profile.user?.educations && profile.user.educations.length > 0 && (
              <ProfileSectionCard title="Latest Education">
                {profile.user.educations.slice(0, 1).map(edu => (
                  <EducationCard key={edu.id} data={edu} />
                ))}
              </ProfileSectionCard>
            )}
          </>
        );

      case 'education-experience':
        return (
          <>
            {profile.user?.work_experiences && profile.user.work_experiences.length > 0 && (
              <ProfileSectionCard title="Work Experience">
                {profile.user.work_experiences.map(exp => (
                  <ExperienceCard key={exp.id} data={exp} />
                ))}
              </ProfileSectionCard>
            )}
            {profile.user?.educations && profile.user.educations.length > 0 && (
              <ProfileSectionCard title="Education & Qualifications">
                {profile.user.educations.map(edu => (
                  <EducationCard key={edu.id} data={edu} />
                ))}
              </ProfileSectionCard>
            )}
            {(!profile.user?.work_experiences || profile.user.work_experiences.length === 0) && 
             (!profile.user?.educations || profile.user.educations.length === 0) && (
                <ProfileSectionCard>
                    <p className="text-gray-600 text-center">No education or experience data to display.</p>
                </ProfileSectionCard>
            )}
          </>
        );

      case 'skills-certificates':
        return (
          <>
            {profile.user?.skills && profile.user.skills.length > 0 && (
              <ProfileSectionCard title="Skills">
                <div className="flex flex-wrap gap-2">
                  {profile.user.skills.map(skill => (
                    <SkillItem key={skill.id} skill={skill} />
                  ))}
                </div>
              </ProfileSectionCard>
            )}
            {profile.user?.certificates && profile.user.certificates.length > 0 && (
              <ProfileSectionCard title="Certificates">
                {profile.user.certificates.map(cert => (
                  <CertificateCard key={cert.id} data={cert} />
                ))}
              </ProfileSectionCard>
            )}
            {(!profile.user?.skills || profile.user.skills.length === 0) && 
             (!profile.user?.certificates || profile.user.certificates.length === 0) && (
                <ProfileSectionCard>
                    <p className="text-gray-600 text-center">No skills or certificates to display.</p>
                </ProfileSectionCard>
            )}
          </>
        );

      case 'projects-portfolio':
        return (
          <>
            {profile.user?.projects && profile.user.projects.length > 0 ? (
              <ProfileSectionCard title="Projects & Portfolio">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {profile.user.projects.map(project => (
                    <ProjectCard key={project.id} data={project} />
                  ))}
                </div>
              </ProfileSectionCard>
            ) : (
                <ProfileSectionCard>
                    <p className="text-gray-600 text-center">No projects to display.</p>
                </ProfileSectionCard>
            )}
          </>
        );

      default:
        return <ProfileSectionCard><p className="text-gray-600 text-center">Tab not found.</p></ProfileSectionCard>;
    }
  };

  return (
    <>
    <Navbar/>
    <div className=" min-h-screen pb-10 py-10">
      <div className="container mx-auto px-4 py-8">
        <ProfileHeader data={profile.user} onUpdatePhoto={handlePhotoUpdate} />

        <div className="mt-8">
          <ProfileNavigation activeTab={activeTab} onTabChange={handleTabChange} />
        </div>

        <div className="mt-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
    
    {/* Notification */}
    {notification && (
      <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm transition-all duration-300 ${
        notification.type === 'success' ? 'bg-green-500 text-white' :
        notification.type === 'error' ? 'bg-red-500 text-white' :
        'bg-blue-500 text-white'
      }`}>
        <div className="flex items-center justify-between">
          <p>{notification.message}</p>
          <button 
            onClick={() => setNotification(null)}
            className="ml-4 text-white hover:text-gray-200"
          >
            
          </button>
        </div>
      </div>
    )}
    </>
  );
}

export default ProfilePage;
