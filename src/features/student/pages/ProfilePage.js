import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Linkedin, Github, Briefcase, BookOpen, BrainCircuit, GraduationCap, Lightbulb, Award, Edit2, Camera } from 'lucide-react';
import Navbar from '../../../components/Layout/Navbar';
import ExperienceCard from '../components/profile/ExperienceCard';
import EducationCard from '../components/profile/EducationCard';
import SkillItem from '../components/profile/SkillItem';
import CertificateCard from '../components/profile/CertificateCard';
import ProjectCard from '../components/profile/ProjectCard';
import { useProfile } from '../../../hooks/useProfile';

// --- Reusable Animated Components ---
const AnimatedProfileHeader = ({ data, onUpdatePhoto, onNavigateToEdit }) => {
  const profileData = data?.profile;
  const coverPhotoUrl = profileData?.cover_photo;
  const profilePictureUrl = profileData?.profile_picture;
  
  const handleFileChange = (e, photoType) => {
    const file = e.target.files[0];
    if (file) onUpdatePhoto(photoType, file);
  };

  return (
    <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: 'easeOut' }} className="relative rounded-xl overflow-hidden shadow-lg bg-gradient-to-br from-[#203947] to-[#901b20]">
      <div className="h-48 bg-black/20 group">
        {coverPhotoUrl && <img src={coverPhotoUrl} alt="Cover" className="w-full h-full object-cover" />}
        <label htmlFor="cover-upload" className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"><Camera size={32} className="text-white" /><input id="cover-upload" type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'cover')} /></label>
      </div>
      <div className="p-6 pt-0 flex flex-col md:flex-row items-center gap-6 text-white">
        <div className="relative w-28 h-28 -mt-14">
          <motion.img initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.4, delay: 0.2, type: 'spring', stiffness: 120 }} src={profilePictureUrl || `https://ui-avatars.com/api/?name=${profileData?.first_name}+${profileData?.last_name}&background=fff&color=901b20&size=128`} alt="Profile" className="w-full h-full rounded-full object-cover border-4 border-white/80 shadow-xl" />
          <label htmlFor="profile-upload" className="absolute bottom-0 right-0 p-1.5 bg-white/90 rounded-full text-[#901b20] hover:bg-white cursor-pointer transition-colors shadow-md"><Camera size={16} /><input id="profile-upload" type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'profile')} /></label>
        </div>
        <div className="text-center md:text-left mt-4 md:mt-0">
          <h1 className="text-3xl font-bold">{profileData?.first_name} {profileData?.last_name}</h1>
          <p className="text-red-100/80 text-lg mt-1">{profileData?.track}</p>
        </div>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={onNavigateToEdit} className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 bg-red-500 backdrop-blur-sm text-white text-xs font-semibold rounded-full hover:bg-red-700 transition">
          <Edit2 size={14} />Edit Profile
        </motion.button>
      </div>
    </motion.div>
  );
};

const AnimatedProfileSection = ({ title, icon, children }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border border-white/30 p-6">
    <div className="flex items-center gap-3 mb-4"><div className="w-8 h-8 flex items-center justify-center bg-red-100/50 rounded-lg text-[#901b20]">{icon}</div><h2 className="text-xl font-bold text-gray-800">{title}</h2></div>
    {children}
  </motion.div>
);

const ProfileNavigation = ({ activeTab, onTabChange, tabs }) => (
    <div className="relative flex border-b border-gray-200">
        {tabs.map(tab => (
            <button key={tab.id} onClick={() => onTabChange(tab.id)} className={`relative px-4 py-3 text-sm font-semibold transition-colors ${activeTab === tab.id ? 'text-[#901b20]' : 'text-gray-500 hover:text-gray-800'}`}>
                {tab.label}
                {activeTab === tab.id && ( <motion.div className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-[#901b20]" layoutId="underline" /> )}
            </button>
        ))}
    </div>
);


function ProfilePage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [notification, setNotification] = useState(null);
  const { profile, loading, error, updatePhoto, updateCover } = useProfile();

  // Guard: show loading or error UI before accessing profile.user
  if (loading || uploadingPhoto) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-orange-50 to-red-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#901b20] mx-auto mb-4"></div>
          <p className="text-lg font-semibold text-gray-700">Loading profile...</p>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-orange-50 to-red-50">
        <div className="text-center">
          <p className="text-lg font-semibold text-red-700">{typeof error === 'string' ? error : 'Failed to load profile.'}</p>
        </div>
      </div>
    );
  }
  if (!profile || !profile.user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-orange-50 to-red-50">
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-700">Profile not found.</p>
        </div>
      </div>
    );
  }

  const handleTabChange = (tabName) => { setActiveTab(tabName); };
  const showNotification = (message, type = 'info') => { setNotification({ message, type }); setTimeout(() => setNotification(null), 3000); };
  const handlePhotoUpdate = async (photoType, file) => { if (!file) return; try { setUploadingPhoto(true); const result = photoType === 'profile' ? await updatePhoto(file) : await updateCover(file); if (result?.success) { showNotification(`${photoType} photo updated successfully!`, 'success'); } else { showNotification(`Failed to update photo: ${result?.error}`, 'error'); } } catch (e) { showNotification(`An error occurred: ${e.message}`, 'error'); } finally { setUploadingPhoto(false); } };

  const TABS = [
      { id: 'overview', label: 'Overview' },
      { id: 'education-experience', label: 'Experience & Education' },
      { id: 'skills-certificates', label: 'Skills & Certificates' },
      { id: 'projects-portfolio', label: 'Projects' }
  ];

  // --- Fully implemented renderTabContent function ---
  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <>
            <AnimatedProfileSection title="About Me" icon={<BookOpen size={20}/>}>
              <p className="text-gray-700 leading-relaxed text-base">{profile?.user?.profile?.summary || 'No summary available. Go to "Edit Profile" to add one.'}</p>
            </AnimatedProfileSection>
            <AnimatedProfileSection title="Contact Information" icon={<Mail size={20}/>}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-4 text-gray-700">
                <div><p className="text-gray-500 text-sm font-medium">Email</p><a href={`mailto:${profile?.user?.email}`} className="text-gray-800 hover:underline">{profile?.user?.email || 'Not provided'}</a></div>
                <div><p className="text-gray-500 text-sm font-medium">Phone</p><p className="text-gray-800">{profile?.user?.profile?.phone || 'Not provided'}</p></div>
                <div><p className="text-gray-500 text-sm font-medium">WhatsApp</p>{profile?.user?.profile?.whatsapp ? (<a href={`https://wa.me/${profile.user.profile.whatsapp}`} target="_blank" rel="noopener noreferrer" className="text-gray-800 hover:underline">{profile.user.profile.whatsapp}</a>) : (<p className="text-gray-800">Not provided</p>)}</div>
                <div><p className="text-gray-500 text-sm font-medium">LinkedIn</p>{profile?.user?.profile?.linkedin ? (<a href={profile.user.profile.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">View LinkedIn Profile</a>) : (<p className="text-gray-800">Not provided</p>)}</div>
                <div><p className="text-gray-500 text-sm font-medium">GitHub</p>{profile?.user?.profile?.github ? (<a href={profile.user.profile.github} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">View GitHub Profile</a>) : (<p className="text-gray-800">Not provided</p>)}</div>
                <div><p className="text-gray-500 text-sm font-medium">Portfolio</p>{profile?.user?.profile?.portfolio_url ? (<a href={profile.user.profile.portfolio_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">View Portfolio</a>) : (<p className="text-gray-800">Not provided</p>)}</div>
                {profile?.user?.profile?.available_for_freelance && (<div><p className="text-gray-500 text-sm font-medium">Availability</p><p className="font-semibold text-green-700">Available for Freelance</p></div>)}
              </div>
            </AnimatedProfileSection>
            {profile?.user?.skills?.length > 0 && (<AnimatedProfileSection title="Top Skills" icon={<BrainCircuit size={20}/>}><div className="flex flex-wrap gap-2">{profile.user.skills.slice(0, 5).map(skill => <SkillItem key={skill.id} skill={skill} />)}</div></AnimatedProfileSection>)}
            {profile?.user?.work_experiences?.length > 0 && (<AnimatedProfileSection title="Latest Experience" icon={<Briefcase size={20}/>}><div className="space-y-4">{profile.user.work_experiences.slice(0, 1).map(exp => (<ExperienceCard key={exp.id} data={exp} />))}</div></AnimatedProfileSection>)}
            {profile?.user?.educations?.length > 0 && (<AnimatedProfileSection title="Latest Education" icon={<GraduationCap size={20}/>}><div className="space-y-4">{profile.user.educations.slice(0, 1).map(edu => (<EducationCard key={edu.id} data={edu} />))}</div></AnimatedProfileSection>)}
          </>
        );
      case 'education-experience':
        return (
          <>
            {profile?.user?.work_experiences?.length > 0 ? (<AnimatedProfileSection title="Work Experience" icon={<Briefcase size={20} />}><div className="space-y-6">{profile.user.work_experiences.map(exp => (<ExperienceCard key={exp.id} data={exp} />))}</div></AnimatedProfileSection>) : <AnimatedProfileSection title="Work Experience" icon={<Briefcase size={20} />}><p className="text-center text-gray-500">No work experience added yet.</p></AnimatedProfileSection>}
            {profile?.user?.educations?.length > 0 ? (<AnimatedProfileSection title="Education & Qualifications" icon={<GraduationCap size={20}/>}><div className="space-y-6">{profile.user.educations.map(edu => (<EducationCard key={edu.id} data={edu} />))}</div></AnimatedProfileSection>) : <AnimatedProfileSection title="Education & Qualifications" icon={<GraduationCap size={20}/>}><p className="text-center text-gray-500">No education added yet.</p></AnimatedProfileSection>}
          </>
        );
      case 'skills-certificates':
        return (
          <>
            {profile?.user?.skills?.length > 0 ? (<AnimatedProfileSection title="Skills" icon={<BrainCircuit size={20}/>}><div className="flex flex-wrap gap-2">{profile.user.skills.map(skill => (<SkillItem key={skill.id} skill={skill} />))}</div></AnimatedProfileSection>) : <AnimatedProfileSection title="Skills" icon={<BrainCircuit size={20}/>}><p className="text-center text-gray-500">No skills added yet.</p></AnimatedProfileSection>}
            {profile?.user?.certificates?.length > 0 ? (<AnimatedProfileSection title="Certificates" icon={<Award size={20}/>}><div className="space-y-4">{profile.user.certificates.map(cert => (<CertificateCard key={cert.id} data={cert} />))}</div></AnimatedProfileSection>) : <AnimatedProfileSection title="Certificates" icon={<Award size={20}/>}><p className="text-center text-gray-500">No certificates added yet.</p></AnimatedProfileSection>}
          </>
        );
      case 'projects-portfolio':
        return (
          <>
            {profile?.user?.projects?.length > 0 ? (<AnimatedProfileSection title="Projects & Portfolio" icon={<Lightbulb size={20}/>}><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{profile.user.projects.map(project => (<ProjectCard key={project.id} data={project} />))}</div></AnimatedProfileSection>) : (<AnimatedProfileSection title="No Projects" icon={<Lightbulb size={20}/>}><p className="text-gray-600 text-center">No projects to display.</p></AnimatedProfileSection>)}
          </>
        );
      default:
        return <AnimatedProfileSection title="Not Found"><p>Tab content not found.</p></AnimatedProfileSection>;
    }
  };

  return (
    <>
      <Navbar/>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50 to-red-50 relative overflow-hidden pb-16">
        <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-[#901b20]/10 to-[#203947]/10 rounded-full blur-3xl opacity-50 -z-0"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-gradient-to-tr from-[#203947]/10 to-[#901b20]/10 rounded-full blur-3xl opacity-50 -z-0"></div>
        <main className="container mx-auto px-4 py-10 relative z-10">
          <AnimatedProfileHeader data={profile.user} onUpdatePhoto={handlePhotoUpdate} onNavigateToEdit={() => navigate('/student/profile/edit')} />
          <div className="mt-8 bg-white/60 backdrop-blur-sm rounded-xl shadow-md border border-white/30">
            <ProfileNavigation activeTab={activeTab} onTabChange={handleTabChange} tabs={TABS} />
          </div>
          <div className="mt-6">
            <AnimatePresence mode="wait">
              <motion.div key={activeTab} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }} className="grid grid-cols-1 gap-6">
                {renderTabContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
      <AnimatePresence>{notification && ( <motion.div>...</motion.div> )}</AnimatePresence>
    </>
  );
}

export default ProfilePage;