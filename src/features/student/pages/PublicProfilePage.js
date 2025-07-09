import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../../../components/Layout/Navbar';
import ProfileHeader from '../components/profile/ProfileHeader';
import ProfileSectionCard from '../components/profile/ProfileSectionCard';
import ExperienceCard from '../components/profile/ExperienceCard';
import EducationCard from '../components/profile/EducationCard';
import SkillItem from '../components/profile/SkillItem';
import CertificateCard from '../components/profile/CertificateCard';
import ProjectCard from '../components/profile/ProjectCard';
import { fetchUserById } from '../../../services/usersApi';

const PublicProfilePage = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const getProfile = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await fetchUserById(id);
        // Adjust this according to your API response structure
        setProfile(response?.data?.user || response?.user || null);
      } catch (err) {
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    getProfile();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#901b20] mx-auto mb-4"></div>
            <p className="text-gray-600">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-red-500 mb-4">
              <span className="material-icons text-4xl">error</span>
            </div>
            <p className="text-red-600 mb-4">{error || 'Profile not found'}</p>
          </div>
        </div>
      </div>
    );
  }

  // Use the same structure as your main profile page, but do not render any edit buttons
  // DEBUG: Log profile picture src for troubleshooting
  console.log('PublicProfilePage profile.profile_picture:', profile?.profile?.profile_picture);
  return (
    <>
      <Navbar />
      <div className="min-h-screen pb-10 py-10">
        <div className="container mx-auto px-4 py-8">
          <ProfileHeader data={profile} isPublic />
          <div className="mt-8">
            {/* No navigation tabs for public profile, just show all sections */}
            <ProfileSectionCard title="About Me">
              <p className="text-gray-700 leading-relaxed text-base">
                {profile.profile?.summary || 'No summary available'}
              </p>
            </ProfileSectionCard>
            <ProfileSectionCard title="Contact Information">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-4 text-gray-700">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Email</p>
                  <a href={`mailto:${profile.email}`} className="text-gray-800 hover:underline">
                    {profile.email || 'Not provided'}
                  </a>
                </div>
                <div>
                  <p className="text-gray-500 text-sm font-medium">Phone</p>
                  <p className="text-gray-800">{profile.profile?.phone || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm font-medium">LinkedIn</p>
                  {profile.profile?.linkedin ? (
                    <a href={profile.profile.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      View LinkedIn Profile
                    </a>
                  ) : (
                    <p className="text-gray-800">Not provided</p>
                  )}
                </div>
                <div>
                  <p className="text-gray-500 text-sm font-medium">GitHub</p>
                  {profile.profile?.github ? (
                    <a href={profile.profile.github} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      View GitHub Profile
                    </a>
                  ) : (
                    <p className="text-gray-800">Not provided</p>
                  )}
                </div>
                <div>
                  <p className="text-gray-500 text-sm font-medium">Portfolio</p>
                  {profile.profile?.portfolio_url ? (
                    <a href={profile.profile.portfolio_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      View Portfolio
                    </a>
                  ) : (
                    <p className="text-gray-800">Not provided</p>
                  )}
                </div>
              </div>
            </ProfileSectionCard>
            {profile.skills && profile.skills.length > 0 && (
              <ProfileSectionCard title="Top Skills">
                <div className="flex flex-wrap gap-2">
                  {profile.skills.slice(0, 5).map(skill => (
                    <SkillItem key={skill.id} skill={skill} />
                  ))}
                </div>
              </ProfileSectionCard>
            )}
            {profile.work_experiences && profile.work_experiences.length > 0 && (
              <ProfileSectionCard title="Latest Experience">
                {profile.work_experiences.slice(0, 1).map(exp => (
                  <ExperienceCard key={exp.id} data={exp} />
                ))}
              </ProfileSectionCard>
            )}
            {profile.educations && profile.educations.length > 0 && (
              <ProfileSectionCard title="Latest Education">
                {profile.educations.slice(0, 1).map(edu => (
                  <EducationCard key={edu.id} data={edu} />
                ))}
              </ProfileSectionCard>
            )}
            {profile.projects && profile.projects.length > 0 && (
              <ProfileSectionCard title="Projects & Portfolio">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {profile.projects.map(project => (
                    <ProjectCard key={project.id} data={project} />
                  ))}
                </div>
              </ProfileSectionCard>
            )}
            {profile.certificates && profile.certificates.length > 0 && (
              <ProfileSectionCard title="Certificates">
                {profile.certificates.map(cert => (
                  <CertificateCard key={cert.id} data={cert} />
                ))}
              </ProfileSectionCard>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default PublicProfilePage;
