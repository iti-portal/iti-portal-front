// src/features/Student/Profile/EditProfilePage.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import dummyProfileData from './profileData'; 

import PersonalInfoForm from './components/edit/PersonalInfoForm';
import ContactInfoForm from './components/edit/ContactInfoForm';
import SkillsAndCertificatesForm from './components/edit/SkillsAndCertificatesForm';
import ProjectsAndPortfolioForm from './components/edit/ProjectsAndPortfolioForm';
import EducationAndExperienceForm from './components/edit/EducationAndExperienceForm'; 
function EditProfilePage() {
  const navigate = useNavigate();

  const tabs = [
    { id: 'personal', name: 'Personal Information' },
    { id: 'contact', name: 'Contact & Social' },
    { id: 'education-experience', name: 'Education & Experience' },
    { id: 'skills-certs', name: 'Skills & Certificates' },
    { id: 'projects-portfolio', name: 'Projects & Portfolio' },
  ];

  const [activeTab, setActiveTab] = useState(tabs[0].id); // أول تاب هو النشط افتراضيًا
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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Final Data to Save (Dummy):', profileDataToEdit);

    // في المستقبل، هنا سيتم إرسال profileDataToEdit إلى الـ API
    // على سبيل المثال: dispatch(updateFullProfile(profileDataToEdit));

    alert('Profile updated successfully (dummy data)!');
    navigate('/student/profile'); // العودة لصفحة البروفايل بعد الحفظ
  };

  return (
    <div className="bg-gray-100 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-lg shadow-xl p-6 mb-6 max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">Edit Profile</h1>

          {/* Tab Navigation */}
          <div className="border-b border-gray-200 mb-8">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    ${activeTab === tab.id
                      ? 'border-red-500 text-red-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                    whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ease-in-out
                  `}
                >
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* عرض المكون الفرعي بناءً على الـ activeTab */}
            {activeTab === 'personal' && (
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
            )}

            {activeTab === 'contact' && (
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
            )}

            {activeTab === 'education-experience' && ( 
              <EducationAndExperienceForm
                educations={profileDataToEdit.educations}
                workExperiences={profileDataToEdit.workExperiences}
                onUpdateEducations={(newEducations) => handleProfileDataChange('educations', newEducations)}
                onUpdateWorkExperiences={(newWorkExperiences) => handleProfileDataChange('workExperiences', newWorkExperiences)}
              />
            )}

            {activeTab === 'skills-certs' && (
              <SkillsAndCertificatesForm
                skills={profileDataToEdit.skills}
                achievements={profileDataToEdit.achievements}
                onUpdateSkills={(newSkills) => handleProfileDataChange('skills', newSkills)}
                onUpdateAchievements={(newAchievements) => handleProfileDataChange('achievements', newAchievements)}
              />
            )}

            {activeTab === 'projects-portfolio' && (
              <ProjectsAndPortfolioForm
                projects={profileDataToEdit.projects}
                onUpdateProjects={(newProjects) => handleProfileDataChange('projects', newProjects)}
              />
            )}


            {/* Submit & Cancel Buttons (تبقى في المكون الأب) */}
            <div className="pt-4 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => navigate('/student/profile')}
                className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditProfilePage;