import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Linkedin, Github, Briefcase, BookOpen, BrainCircuit, GraduationCap, Lightbulb, Award } from 'lucide-react';
import Navbar from '../../../components/Layout/Navbar';
import ExperienceCard from '../components/profile/ExperienceCard';
import EducationCard from '../components/profile/EducationCard';
import SkillItem from '../components/profile/SkillItem';
import CertificateCard from '../components/profile/CertificateCard';
import ProjectCard from '../components/profile/ProjectCard';
import { fetchUserById } from '../../../services/usersApi';

// Helper to get image URL safely
const getImageUrl = (imagePath) => {
  if (!imagePath || imagePath.startsWith('http')) return imagePath;
  const baseUrl = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';
  const cleanBaseUrl = baseUrl.replace('/api', '');
  return `${cleanBaseUrl}/storage/${imagePath}`;
};

const AnimatedProfileHeader = ({ data }) => {
  // FIX: Use optional chaining to safely access nested properties
  const profileData = data?.profile; 
  const profilePictureUrl = getImageUrl(profileData?.profile_picture);
  const coverPhotoUrl = getImageUrl(profileData?.cover_photo);

  return (
    <motion.div
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="relative rounded-xl overflow-hidden shadow-lg bg-gradient-to-br from-[#203947] to-[#901b20]"
    >
      <div className="h-48 bg-black/20">
        {coverPhotoUrl && <img src={coverPhotoUrl} alt="Cover" className="w-full h-full object-cover" />}
      </div>
      <div className="p-6 pt-0 flex flex-col md:flex-row items-center gap-6 text-white">
        <motion.img
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2, type: 'spring', stiffness: 120 }}
          src={profilePictureUrl || `https://ui-avatars.com/api/?name=${profileData?.first_name}+${profileData?.last_name}&background=fff&color=901b20&size=128`}
          alt="Profile"
          className="w-28 h-28 -mt-14 rounded-full object-cover border-4 border-white/80 shadow-xl"
        />
        <div className="text-center md:text-left mt-4 md:mt-0">
          <h1 className="text-3xl font-bold">{profileData?.first_name} {profileData?.last_name}</h1>
          <p className="text-red-100/80 text-lg mt-1">{profileData?.track}</p>
          {profileData?.intake && <p className="text-red-100/70 text-sm">Intake {profileData.intake}</p>}
        </div>
      </div>
    </motion.div>
  );
};

const AnimatedProfileSection = ({ title, icon, children }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.2 }}
    transition={{ duration: 0.5, ease: 'easeOut' }}
    className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border border-white/30 p-6"
  >
    <div className="flex items-center gap-3 mb-4">
      {icon}
      <h2 className="text-xl font-bold text-gray-800">{title}</h2>
    </div>
    {children}
  </motion.div>
);

const PublicProfilePage = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const getProfile = async () => {
      try { setLoading(true); setError(''); const response = await fetchUserById(id); setProfile(response?.data?.user || response?.user || null); }
      catch (err) { setError('Failed to load profile'); }
      finally { setLoading(false); }
    };
    if (id) getProfile();
  }, [id]);

  // FIX: Strengthen the guard to be absolutely sure rendering doesn't happen prematurely.
  // This will now correctly show the loading/error states until profile is fully available.
  if (loading || error || !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50 to-red-50">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          {loading && (
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#901b20] mx-auto mb-4"></div>
              <p className="text-gray-600">Loading Profile...</p>
            </div>
          )}
          {(error || !profile) && !loading && (
             <div className="text-center">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"><User className="text-red-500 w-10 h-10" /></div>
              <h3 className="text-xl font-semibold text-red-700">{error || 'Profile could not be found.'}</h3>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50 to-red-50 relative overflow-hidden pb-16">
        <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-[#901b20]/10 to-[#203947]/10 rounded-full blur-3xl opacity-50 -z-0"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-gradient-to-tr from-[#203947]/10 to-[#901b20]/10 rounded-full blur-3xl opacity-50 -z-0"></div>
        
        <main className="container mx-auto px-4 py-10 relative z-10">
          <AnimatedProfileHeader data={profile} />
          
          <div className="mt-8 grid grid-cols-1 gap-6">
            {/* FIX: Use optional chaining for all data access */}
            {profile?.profile?.summary && (
              <AnimatedProfileSection title="About Me" icon={<BookOpen className="w-6 h-6 text-gray-500" />}>
                <p className="text-gray-700 leading-relaxed">{profile.profile.summary}</p>
              </AnimatedProfileSection>
            )}

            <AnimatedProfileSection title="Contact Information" icon={<Mail className="w-6 h-6 text-gray-500" />}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                <div className="flex items-start gap-3"><Mail size={18} className="text-gray-400 mt-1 flex-shrink-0" /><a href={`mailto:${profile.email}`} className="text-gray-800 hover:text-[#901b20] hover:underline break-all">{profile.email || 'Not provided'}</a></div>
                <div className="flex items-start gap-3"><Phone size={18} className="text-gray-400 mt-1 flex-shrink-0" /><p className="text-gray-800">{profile?.profile?.phone || 'Not provided'}</p></div>
                {profile?.profile?.linkedin && <div className="flex items-start gap-3"><Linkedin size={18} className="text-gray-400 mt-1 flex-shrink-0" /><a href={profile.profile.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">View LinkedIn</a></div>}
                {profile?.profile?.github && <div className="flex items-start gap-3"><Github size={18} className="text-gray-400 mt-1 flex-shrink-0" /><a href={profile.profile.github} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">View GitHub</a></div>}
                {profile?.profile?.portfolio_url && <div className="flex items-start gap-3"><Briefcase size={18} className="text-gray-400 mt-1 flex-shrink-0" /><a href={profile.profile.portfolio_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">View Portfolio</a></div>}
              </div>
            </AnimatedProfileSection>

            {profile?.skills?.length > 0 && (
              <AnimatedProfileSection title="Skills" icon={<BrainCircuit className="w-6 h-6 text-gray-500" />}><div className="flex flex-wrap gap-2">{profile.skills.map(skill => <SkillItem key={skill.id} skill={skill} />)}</div></AnimatedProfileSection>
            )}
            {profile?.work_experiences?.length > 0 && (
              <AnimatedProfileSection title="Experience" icon={<Briefcase className="w-6 h-6 text-gray-500" />}><div className="space-y-6">{profile.work_experiences.map(exp => <ExperienceCard key={exp.id} data={exp} />)}</div></AnimatedProfileSection>
            )}
            {profile?.educations?.length > 0 && (
              <AnimatedProfileSection title="Education" icon={<GraduationCap className="w-6 h-6 text-gray-500" />}><div className="space-y-6">{profile.educations.map(edu => <EducationCard key={edu.id} data={edu} />)}</div></AnimatedProfileSection>
            )}
            {profile?.projects?.length > 0 && (
              <AnimatedProfileSection title="Projects" icon={<Lightbulb className="w-6 h-6 text-gray-500" />}><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{profile.projects.map(project => <ProjectCard key={project.id} data={project} />)}</div></AnimatedProfileSection>
            )}
            {profile?.certificates?.length > 0 && (
              <AnimatedProfileSection title="Certificates" icon={<Award className="w-6 h-6 text-gray-500" />}><div className="space-y-4">{profile.certificates.map(cert => <CertificateCard key={cert.id} data={cert} />)}</div></AnimatedProfileSection>
            )}
          </div>
        </main>
      </div>
    </>
  );
};

export default PublicProfilePage;