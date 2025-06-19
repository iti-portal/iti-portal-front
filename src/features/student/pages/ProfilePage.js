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

import dummyProfileData from '../data/profileData';

function ProfilePage() {
  const [activeTab, setActiveTab] = useState('overview');

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <>
            <ProfileSectionCard title="About Me">
              <p className="text-gray-700 leading-relaxed text-base">{dummyProfileData.summary}</p>
            </ProfileSectionCard>

            <ProfileSectionCard title="Contact Information">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-4 text-gray-700">
                {/* Email */}
                <div>
                  <p className="text-gray-500 text-sm font-medium">Email</p>
                  <a href={`mailto:${dummyProfileData.email}`} className="text-gray-800 hover:underline">
                    {dummyProfileData.email}
                  </a>
                </div>

                {/* Phone */}
                <div>
                  <p className="text-gray-500 text-sm font-medium">Phone</p>
                  <p className="text-gray-800">{dummyProfileData.phone}</p>
                </div>

                {/* Location */}
                <div>
                  <p className="text-gray-500 text-sm font-medium">Location</p>
                  <p className="text-gray-800">{dummyProfileData.governorate}, Egypt</p>
                </div>

                {/* LinkedIn */}
                <div>
                  <p className="text-gray-500 text-sm font-medium">LinkedIn</p>
                  {dummyProfileData.linkedin ? (
                    <a href={dummyProfileData.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      {dummyProfileData.linkedin.replace(/(https?:\/\/)?(www\.)?linkedin\.com\/in\//, '')}
                    </a>
                  ) : (
                    <p className="text-gray-800">-</p>
                  )}
                </div>

                {dummyProfileData.whatsapp && (
                  <div>
                    <p className="text-gray-500 text-sm font-medium">WhatsApp</p>
                    <a href={`https://wa.me/${dummyProfileData.whatsapp}`} target="_blank" rel="noopener noreferrer" className="text-gray-800 hover:underline">
                      {dummyProfileData.whatsapp}
                    </a>
                  </div>
                )}
                

                {dummyProfileData.availableForFreelance && (
                  <div> 
                    <p className="text-gray-500 text-sm font-medium">Availability</p>
                    <p className="font-semibold text-green-700">Available for Freelance</p>
                  </div>
                )}
              </div>
            </ProfileSectionCard>

            {dummyProfileData.skills.length > 0 && (
              <ProfileSectionCard title="Top Skills">
                <div className="flex flex-wrap gap-2">
                  {dummyProfileData.skills.slice(0, 5).map(skill => (
                    <SkillItem key={skill.id} skill={skill} />
                  ))}
                </div>
              </ProfileSectionCard>
            )}

            {dummyProfileData.workExperiences.length > 0 && (
              <ProfileSectionCard title="Latest Experience">
                {dummyProfileData.workExperiences.slice(0, 1).map(exp => (
                  <ExperienceCard key={exp.id} data={exp} />
                ))}
              </ProfileSectionCard>
            )}

            {dummyProfileData.educations.length > 0 && (
              <ProfileSectionCard title="Latest Education">
                {dummyProfileData.educations.slice(0, 1).map(edu => (
                  <EducationCard key={edu.id} data={edu} />
                ))}
              </ProfileSectionCard>
            )}
          </>
        );

      case 'education-experience':
        return (
          <>
            {dummyProfileData.workExperiences.length > 0 && (
              <ProfileSectionCard title="Work Experience">
                {dummyProfileData.workExperiences.map(exp => (
                  <ExperienceCard key={exp.id} data={exp} />
                ))}
              </ProfileSectionCard>
            )}
            {dummyProfileData.educations.length > 0 && (
              <ProfileSectionCard title="Education & Qualifications">
                {dummyProfileData.educations.map(edu => (
                  <EducationCard key={edu.id} data={edu} />
                ))}
              </ProfileSectionCard>
            )}
            {dummyProfileData.workExperiences.length === 0 && dummyProfileData.educations.length === 0 && (
                <ProfileSectionCard>
                    <p className="text-gray-600 text-center">No education or experience data to display.</p>
                </ProfileSectionCard>
            )}
          </>
        );

      case 'skills-certificates':
        return (
          <>
            {dummyProfileData.skills.length > 0 && (
              <ProfileSectionCard title="Skills">
                <div className="flex flex-wrap gap-2">
                  {dummyProfileData.skills.map(skill => (
                    <SkillItem key={skill.id} skill={skill} />
                  ))}
                </div>
              </ProfileSectionCard>
            )}
            {dummyProfileData.achievements.length > 0 && (
              <ProfileSectionCard title="Certificates">
                {dummyProfileData.achievements.filter(ach => ach.type === 'certificate').map(cert => (
                  <CertificateCard key={cert.id} data={cert} />
                ))}
              </ProfileSectionCard>
            )}
            {dummyProfileData.skills.length === 0 && dummyProfileData.achievements.length === 0 && (
                <ProfileSectionCard>
                    <p className="text-gray-600 text-center">No skills or certificates to display.</p>
                </ProfileSectionCard>
            )}
          </>
        );

      case 'projects-portfolio':
        return (
          <>
            {dummyProfileData.projects.length > 0 ? (
              <ProfileSectionCard title="Projects & Portfolio">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {dummyProfileData.projects.map(project => (
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
    <div className=" min-h-screen pb-10">
      <div className="container mx-auto px-4 py-8">
        <ProfileHeader data={dummyProfileData} />

        <div className="mt-8">
          <ProfileNavigation activeTab={activeTab} onTabChange={handleTabChange} />
        </div>

        <div className="mt-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
    </>
  );
}

export default ProfilePage;
