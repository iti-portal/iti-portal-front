import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // Import AnimatePresence
import { Search, MapPin, Briefcase, DollarSign, Building2, Users, Calendar, Code, Star, Sparkles } from 'lucide-react';
import { fetchAllJobs, fetchGovernorates, formatSalary, getExperienceLevel, getJobType, getRecommendedJobs, fetchUserSkills } from './GetJobs';
import Navbar from '../../../components/Layout/Navbar';
import { Link } from 'react-router-dom';

// The JobCard component with added motion props
function JobCard({ jobData, onSelectJob, isSelected, showScore = false }) {
  return (
    // Add motion.div for animation and hover effects
    <motion.div
      layout // Animates position changes when the list is filtered/sorted
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
      className={`border rounded-lg p-4 cursor-pointer relative 
        ${isSelected
          ? 'bg-blue-50 border-blue-400 ring-1 ring-blue-300 shadow-md'
          : 'bg-white border-gray-200 hover:border-blue-300'}`}
      onClick={() => onSelectJob(jobData)}
    >
      {showScore && jobData.matching_score && (
        <div className="absolute top-2 right-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-full px-2.5 py-1 flex items-center text-xs font-bold shadow-sm">
          <Star className="w-3 h-3 mr-1" fill="white" />
          {Math.round(jobData.matching_score)}%
        </div>
      )}

      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          {jobData.company?.company_profile?.logo ? (
            <img
              src={`http://127.0.0.1:8000/storage/${jobData.company.company_profile.logo}`}
              alt={jobData.company.company_profile.company_name + ' logo'}
              className="w-12 h-12 rounded-lg object-cover border border-gray-100 bg-white"
            />
          ) : (
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center border border-gray-100">
              <Building2 className="w-6 h-6 text-[#901b20]" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h2 className="text-base font-semibold text-gray-800 mb-0.5 truncate group-hover:text-[#901b20]">
            {jobData.title}
          </h2>
          <p className="text-sm font-medium text-red-700 mb-3 truncate">
            {jobData.company?.company_profile?.company_name}
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-600">
            <div className="flex items-center gap-1.5 whitespace-nowrap">
              <MapPin className="w-3 h-3 flex-shrink-0 text-gray-400" />
              <span className="truncate">{jobData.company?.company_profile?.location || 'N/A'}</span>
            </div>
            <div className="flex items-center gap-1.5 whitespace-nowrap">
              <Briefcase className="w-3 h-3 flex-shrink-0 text-gray-400" />
              <span>{getJobType(jobData.job_type)}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Main component with animations integrated
export default function AvailableJobs() {
    // --- ALL LOGIC REMAINS UNCHANGED ---
    const [govs, setGovs] = useState([]);
    const [selectedGov, setSelectedGov] = useState('');
    const [jobs, setJobs] = useState([]);
    const [filteredJobs, setFilteredJobs] = useState([]);
    const [selectedJob, setSelectedJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');
    const [selectedJobType, setSelectedJobType] = useState('');
    const [selectedExperience, setSelectedExperience] = useState('');
    const [selectedWorkLocation, setSelectedWorkLocation] = useState('');
    const [selectedJobTitle, setSelectedJobTitle] = useState('');
    const [totalJobs, setTotalJobs] = useState(0);
    const [recommendedJobs, setRecommendedJobs] = useState([]);
    const [showRecommended, setShowRecommended] = useState(false);
    const [recommendationLoading, setRecommendationLoading] = useState(false);
    const [userSkills, setUserSkills] = useState([]);
    const experienceLevels = [{ value: 'entry', label: 'Entry Level' }, { value: 'junior', label: 'Junior' }, { value: 'mid', label: 'Mid-Level' }, { value: 'senior', label: 'Senior' }, { value: 'lead', label: 'Lead' }];
    const workLocations = [{ value: 'remote', label: 'Remote' }, { value: 'onsite', label: 'On-site' }];
    useEffect(() => { const loadData = async () => { try { setLoading(true); const [jobsData, governorates] = await Promise.all([fetchAllJobs(), fetchGovernorates()]); setJobs(jobsData.jobs); setFilteredJobs(jobsData.jobs); setTotalJobs(jobsData.total); setGovs(governorates); if (jobsData.jobs.length > 0) setSelectedJob(jobsData.jobs[0]); const token = localStorage.getItem('token'); if (token) { const skills = await fetchUserSkills(token); setUserSkills(skills); } } catch (err) { setError(`Failed to load data: ${err.message}`); } finally { setLoading(false); } }; loadData(); }, []);
    useEffect(() => { if (!Array.isArray(jobs)) return; const jobsToFilter = showRecommended ? recommendedJobs : jobs; const filtered = jobsToFilter.filter(job => { const matchesSearch = search === '' || (job.company?.company_profile?.company_name && job.company.company_profile.company_name.toLowerCase().includes(search.toLowerCase())); const matchesJobType = selectedJobType === '' || job.job_type === selectedJobType; const matchesExperience = selectedExperience === '' || job.experience_level === selectedExperience; const matchesWorkLocation = selectedWorkLocation === '' || (selectedWorkLocation === 'remote' && job.is_remote) || (selectedWorkLocation === 'onsite' && !job.is_remote); const matchesJobTitle = selectedJobTitle === '' || (job.title && job.title.toLowerCase().includes(selectedJobTitle.toLowerCase())); const matchesGov = selectedGov === '' || selectedGov === 'all' || (job.company?.company_profile?.location && job.company.company_profile.location.toLowerCase().includes(selectedGov.toLowerCase())); return matchesSearch && matchesJobType && matchesExperience && matchesWorkLocation && matchesJobTitle && matchesGov; }); setFilteredJobs(filtered); if (selectedJob && !filtered.some(job => job.id === selectedJob.id)) { setSelectedJob(filtered[0] || null); } }, [search, selectedJobType, selectedExperience, selectedWorkLocation, selectedJobTitle, selectedGov, jobs, selectedJob, showRecommended, recommendedJobs]);
    const handleGovChange = e => setSelectedGov(e.target.value); const handleJobTypeChange = e => setSelectedJobType(e.target.value); const handleExperienceChange = e => setSelectedExperience(e.target.value); const handleWorkLocationChange = e => setSelectedWorkLocation(e.target.value); const handleJobTitleChange = e => setSelectedJobTitle(e.target.value); const handleSelectJob = (job) => setSelectedJob(job); const keywordHandler = e => setSearch(e.target.value);
    const handleGetRecommendations = async () => { try { setRecommendationLoading(true); setError(null); const token = localStorage.getItem('token'); if (!token) throw new Error('Please login to get recommendations'); const skills = await fetchUserSkills(token); if (skills.length === 0) throw new Error('Please add skills to your profile to get recommendations'); setUserSkills(skills); const recommendations = await getRecommendedJobs(skills, jobs); if (recommendations.length === 0) throw new Error('No recommendations found based on your current skills'); setRecommendedJobs(recommendations); setShowRecommended(true); setFilteredJobs(recommendations); if (recommendations.length > 0) setSelectedJob(recommendations[0]); } catch (error) { console.error('Error getting recommendations:', error); setError(error.message); } finally { setRecommendationLoading(false); } };
    const handleShowAllJobs = () => { setShowRecommended(false); setFilteredJobs(jobs); if (jobs.length > 0) setSelectedJob(jobs[0]); };
    const jobTypes = [...new Set(jobs.map(job => job.job_type))]; const jobTitles = [...new Set(jobs.map(job => job.title))];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50 to-red-50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-[#901b20]/10 to-[#203947]/10 rounded-full blur-3xl opacity-50 -z-0"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-gradient-to-tr from-[#203947]/10 to-[#901b20]/10 rounded-full blur-3xl opacity-50 -z-0"></div>

        <motion.section
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center pt-24 pb-28 px-4"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">
            Find Your Next <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#901b20] to-[#203947]">Opportunity</span>
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">Explore exclusive job openings from our network of trusted companies.</p>
        </motion.section>

        <motion.main
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full max-w-7xl mx-auto px-4 pb-16 mt-[-80px] relative z-10"
        >
          <div className="rounded-xl bg-white/80 backdrop-blur-sm shadow-lg border border-white/30 p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Job Listings</h2>
                <p className="text-slate-600 mt-1">Discover opportunities that match your skills.</p>
              </div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex gap-3 mt-4 md:mt-0">
                {showRecommended ? (
                  <button onClick={handleShowAllJobs} className="px-5 py-2.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg transition-all flex items-center gap-2 font-medium shadow-sm">
                    Show All Jobs
                  </button>
                ) : (
                  <button onClick={handleGetRecommendations} disabled={recommendationLoading} className="px-5 py-2.5 bg-gradient-to-r from-[#901b20] to-[#203947] text-white rounded-lg transition-all flex items-center gap-2 font-medium shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed">
                    {recommendationLoading ? <span className="material-icons animate-spin">sync</span> : <Sparkles className="w-5 h-5" />}
                    {recommendationLoading ? 'Analyzing...' : 'Get Recommendations'}
                  </button>
                )}
              </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {[
                { icon: Search, value: search, handler: keywordHandler, placeholder: 'Search by company...', type: 'text' },
                { icon: Code, value: selectedJobTitle, handler: handleJobTitleChange, placeholder: 'All Job Titles', options: jobTitles.map(t => ({ value: t, label: t })) },
                { icon: Briefcase, value: selectedJobType, handler: handleJobTypeChange, placeholder: 'All Job Types', options: jobTypes.map(t => ({ value: t, label: getJobType(t) })) },
                { icon: Users, value: selectedExperience, handler: handleExperienceChange, placeholder: 'All Experience Levels', options: experienceLevels },
                { icon: MapPin, value: selectedWorkLocation, handler: handleWorkLocationChange, placeholder: 'All Work Locations', options: workLocations },
                { icon: Building2, value: selectedGov, handler: handleGovChange, placeholder: 'All Governorates', options: govs.map(g => ({ value: g.governorate_name_en, label: g.governorate_name_en })) }
              ].map(({ icon: Icon, ...props }, index) => (
                <div key={index} className="relative">
                  <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                  {props.type === 'text' ? (
                    <input type="text" onChange={props.handler} value={props.value} placeholder={props.placeholder} className="w-full p-3 pl-10 text-sm text-gray-700 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#901b20]/50 focus:border-transparent bg-white/50" />
                  ) : (
                    <select value={props.value} onChange={props.handler} className="w-full p-3 pl-10 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#901b20]/50 focus:border-transparent bg-white/50 appearance-none">
                      <option value="">{props.placeholder}</option>
                      {props.options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>
                  )}
                </div>
              ))}
            </div>

            {error && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded-r-lg" role="alert">
                <p className="font-bold">Error</p><p>{error}</p><button onClick={() => setError(null)} className="mt-2 text-sm underline">Dismiss</button>
              </div>
            )}
            
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="w-full lg:w-2/5 h-[65vh] flex flex-col">
                <div className="flex-shrink-0 mb-2 px-1">
                  <h3 className="text-sm font-semibold text-gray-600">{showRecommended ? `Recommended Jobs (${filteredJobs.length})` : `Showing ${filteredJobs.length} of ${totalJobs} Jobs`}</h3>
                </div>
                <motion.div layout className="flex-1 overflow-y-auto pr-2 space-y-3">
                  <AnimatePresence>
                    {loading ? (
                      <div className="h-full flex items-center justify-center"><span className="material-icons text-4xl text-[#901b20] animate-spin">sync</span></div>
                    ) : filteredJobs.length > 0 ? (
                      filteredJobs.map(job => <JobCard key={job.id} jobData={job} onSelectJob={handleSelectJob} isSelected={selectedJob?.id === job.id} showScore={showRecommended} />)
                    ) : (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full flex items-center justify-center text-center text-gray-500">
                        <div><Search className="w-12 h-12 mx-auto text-gray-300 mb-2" /><p className="font-medium">No Jobs Found</p><p className="text-xs">Try adjusting your search criteria.</p></div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </div>
              
              <div className="w-full lg:w-3/5 h-[65vh] bg-white border border-gray-200 rounded-xl shadow-inner flex flex-col overflow-hidden">
                <AnimatePresence mode="wait">
                  {selectedJob ? (
                    <motion.div
                      key={selectedJob.id} // Re-animate when selectedJob changes
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex flex-col h-full"
                    >
                      <div className="relative h-24 bg-gradient-to-br from-[#203947] to-[#901b20] flex-shrink-0 p-5 flex items-center">
                        {selectedJob.company?.company_profile?.logo ? (
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-14 h-14 bg-white/10 rounded-lg flex items-center justify-center mr-4">
                            <img
                              src={`http://127.0.0.1:8000/storage/${selectedJob.company.company_profile.logo}`}
                              alt={selectedJob.company.company_profile.company_name + ' logo'}
                              className="w-12 h-12 rounded-lg object-cover border border-gray-100 bg-white"
                            />
                          </motion.div>
                        ) : (
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-14 h-14 bg-white/10 rounded-lg flex items-center justify-center mr-4">
                            <Building2 className="w-7 h-7 text-white" />
                          </motion.div>
                        )}
                        <div>
                          <h1 className="text-xl font-bold text-white truncate">{selectedJob.title}</h1>
                          <p className="text-red-100/80 text-sm truncate">{selectedJob.company?.company_profile?.company_name}</p>
                        </div>
                      </div>
                      <div className="flex-1 overflow-y-auto p-5 space-y-5">
                        {showRecommended && selectedJob.matching_score && (
                          <div className="bg-blue-50/70 border border-blue-200 rounded-lg p-3"><div className="flex items-center gap-3"><Star className="w-6 h-6 text-blue-500 flex-shrink-0" fill="currentColor" /><div><h3 className="font-semibold text-blue-800">This is a Great Match for You!</h3><p className="text-blue-700 text-sm">Matches {Math.round(selectedJob.matching_score)}% of your skills: {selectedJob.matched_skills?.join(', ')}</p></div></div></div>
                        )}
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="flex items-start gap-3"><MapPin className="w-4 h-4 mt-0.5 text-gray-400 flex-shrink-0" /><div><div className="text-xs text-gray-500">Location</div><div className="font-medium text-gray-800">{selectedJob.company?.company_profile?.location || 'N/A'}</div></div></div>
                          <div className="flex items-start gap-3"><DollarSign className="w-4 h-4 mt-0.5 text-gray-400 flex-shrink-0" /><div><div className="text-xs text-gray-500">Salary</div><div className="font-semibold text-gray-800">{formatSalary(selectedJob.salary_min, selectedJob.salary_max)}</div></div></div>
                          <div className="flex items-start gap-3"><Briefcase className="w-4 h-4 mt-0.5 text-gray-400 flex-shrink-0" /><div><div className="text-xs text-gray-500">Job Type</div><div className="font-medium text-gray-800">{getJobType(selectedJob.job_type)}</div></div></div>
                          <div className="flex items-start gap-3"><Users className="w-4 h-4 mt-0.5 text-gray-400 flex-shrink-0" /><div><div className="text-xs text-gray-500">Experience</div><div className="font-medium text-gray-800">{getExperienceLevel(selectedJob.experience_level)}</div></div></div>
                        </div>
                        <div><h3 className="font-semibold text-gray-800 text-sm mb-2">Job Description</h3><p className="text-sm text-gray-600 whitespace-pre-line bg-gray-50/70 p-4 rounded-lg border">{selectedJob.description}</p></div>
                        <div><h3 className="font-semibold text-gray-800 text-sm mb-2">Requirements</h3><p className="text-sm text-gray-600 whitespace-pre-line bg-gray-50/70 p-4 rounded-lg border">{selectedJob.requirements}</p></div>
                        <div><h3 className="font-semibold text-gray-800 text-sm mb-2">Required Skills</h3><div className="flex flex-wrap gap-2">{selectedJob.skills?.map(skill => <span key={skill} className="bg-[#901b20]/10 text-[#901b20] text-xs font-medium px-3 py-1 rounded-full">{skill}</span>)}</div></div>
                      </div>
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-shrink-0 bg-gray-50/80 p-4 border-t">
                        <Link to={`/job/${selectedJob.id}/apply`} className="w-full">
                        <button className="w-full bg-gradient-to-r from-[#901b20] to-[#a83236] hover:shadow-lg text-white font-bold py-3 px-4 rounded-lg shadow-md transition-all">Apply Now</button>
                        </Link>
                      </motion.div>
                    </motion.div>
                  ) : (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full flex items-center justify-center p-4 text-center">
                      <div><Briefcase className="w-16 h-16 text-gray-200 mx-auto mb-4" /><p className="text-lg font-medium text-gray-600">Select a job to view details</p><p className="text-gray-400 text-sm">Your next career move is just a click away.</p></div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.main>
      </div>
    </>
  );
}