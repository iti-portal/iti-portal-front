import { useState, useEffect } from 'react';
import { Search, MapPin, Briefcase, DollarSign, Building2, Users, Calendar, ExternalLink, Code, Star, Sparkles } from 'lucide-react';
import { fetchAllJobs, fetchGovernorates, formatSalary, getExperienceLevel, getJobType, getRecommendedJobs, fetchUserSkills } from './GetJobs';
import Navbar from '../../../components/Layout/Navbar';

function JobCard({ jobData, onSelectJob, isSelected, showScore = false }) {
  return (
  <div
      className={`border rounded-lg p-4 mb-3 cursor-pointer transition-all duration-150 relative ${isSelected
          ? 'bg-gradient-to-br from-red-50 to-orange-50 border-red-200 ring-1 ring-red-200 shadow-sm'
          : 'bg-white border-gray-200 hover:border-red-200 hover:shadow-xs'}`}
      onClick={() => onSelectJob(jobData)}
    >
      {showScore && jobData.matching_score && (
        <div className="absolute top-2 right-2 bg-white bg-opacity-90 rounded-full px-2 py-0.5 flex items-center text-xs font-medium shadow-xs border border-gray-100">
          <Star className="w-3 h-3 text-yellow-500 mr-0.5" />
          {Math.round(jobData.matching_score)}%
        </div>
      )}

      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 rounded-md bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center border border-gray-200">
            <Building2 className="w-5 h-5 text-red-500" />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h2 className="text-base font-semibold text-gray-800 mb-1 truncate">
                {jobData.title}
              </h2>

              <p className="text-sm font-medium text-red-600 mb-2 truncate">
                {jobData.company?.company_profile?.company_name}
              </p>

              <div className="flex flex-wrap items-center gap-2 text-xs text-gray-600 mb-2">
                <div className="flex items-center gap-1 bg-gray-50 px-2 py-0.5 rounded whitespace-nowrap">
                  <MapPin className="w-3 h-3 flex-shrink-0" />
                  <span className="truncate">{jobData.company?.company_profile?.location || 'Location not specified'}</span>
                </div>
                <div className="flex items-center gap-1 bg-gray-50 px-2 py-0.5 rounded whitespace-nowrap">
                  <Briefcase className="w-3 h-3 flex-shrink-0" />
                  <span>{getJobType(jobData.job_type)}</span>
                </div>
                <div className="flex items-center gap-1 bg-gray-50 px-2 py-0.5 rounded whitespace-nowrap">
                  <Users className="w-3 h-3 flex-shrink-0" />
                  <span>{getExperienceLevel(jobData.experience_level)}</span>
                </div>
                {jobData.is_remote ? (
                  <span className="bg-green-50 text-green-700 text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap">
                    Remote
                  </span>
                ) : (
                  <span className="bg-blue-50 text-blue-700 text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap">
                    On-site
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-1 text-xs font-medium text-green-600 whitespace-nowrap">
                  <DollarSign className="w-3 h-3 flex-shrink-0" />
                  <span>{formatSalary(jobData.salary_min, jobData.salary_max)}</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500 whitespace-nowrap">
                  <Calendar className="w-3 h-3 flex-shrink-0" />
                  <span>Apply by {new Date(jobData.application_deadline).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AvailableJobs() {
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

  const experienceLevels = [
    { value: 'entry', label: 'Entry Level' },
    { value: 'junior', label: 'Junior' },
    { value: 'mid', label: 'Mid-Level' },
    { value: 'senior', label: 'Senior' },
    { value: 'lead', label: 'Lead' }
  ];

  const workLocations = [
    { value: 'remote', label: 'Remote' },
    { value: 'onsite', label: 'On-site' }
  ];

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [jobsData, governorates] = await Promise.all([
          fetchAllJobs(),
          fetchGovernorates()
        ]);
        
        setJobs(jobsData.jobs);
        setFilteredJobs(jobsData.jobs);
        setTotalJobs(jobsData.total);
        setGovs(governorates);
        
        if (jobsData.jobs.length > 0) {
          setSelectedJob(jobsData.jobs[0]);
        }

        const token = localStorage.getItem('token');
        if (token) {
          const skills = await fetchUserSkills(token);
          setUserSkills(skills);
        }
      } catch (err) {
        setError(`Failed to load data: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    if (!Array.isArray(jobs)) return;

    const jobsToFilter = showRecommended ? recommendedJobs : jobs;

    const filtered = jobsToFilter.filter(job => {
      const matchesSearch = search === '' || 
        (job.company?.company_profile?.company_name && 
         job.company.company_profile.company_name.toLowerCase().includes(search.toLowerCase()));

      const matchesJobType = selectedJobType === '' || 
        job.job_type === selectedJobType;

      const matchesExperience = selectedExperience === '' || 
        job.experience_level === selectedExperience;

      const matchesWorkLocation = selectedWorkLocation === '' || 
        (selectedWorkLocation === 'remote' && job.is_remote) ||
        (selectedWorkLocation === 'onsite' && !job.is_remote);

      const matchesJobTitle = selectedJobTitle === '' ||
        (job.title && job.title.toLowerCase().includes(selectedJobTitle.toLowerCase()));

      const matchesGov = selectedGov === '' || 
        selectedGov === 'all' ||
        (job.company?.company_profile?.location && 
         job.company.company_profile.location.toLowerCase().includes(selectedGov.toLowerCase()));

      return matchesSearch && matchesJobType && matchesExperience && 
             matchesWorkLocation && matchesJobTitle && matchesGov;
    });

    setFilteredJobs(filtered);
    
    if (selectedJob && !filtered.some(job => job.id === selectedJob.id)) {
      setSelectedJob(filtered[0] || null);
    }
  }, [
    search, 
    selectedJobType, 
    selectedExperience, 
    selectedWorkLocation, 
    selectedJobTitle, 
    selectedGov, 
    jobs, 
    selectedJob,
    showRecommended,
    recommendedJobs
  ]);

  const handleGovChange = e => {
    setSelectedGov(e.target.value);
  };

  const handleJobTypeChange = e => {
    setSelectedJobType(e.target.value);
  };

  const handleExperienceChange = e => {
    setSelectedExperience(e.target.value);
  };

  const handleWorkLocationChange = e => {
    setSelectedWorkLocation(e.target.value);
  };

  const handleJobTitleChange = e => {
    setSelectedJobTitle(e.target.value);
  };

  const handleSelectJob = (job) => {
    setSelectedJob(job);
  };

  const keywordHandler = e => {
    setSearch(e.target.value);
  };

  const handleGetRecommendations = async () => {
    try {
      setRecommendationLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      console.log(token) ;
      if (!token) {
        throw new Error('Please login to get recommendations');
      }

      const skills = await fetchUserSkills(token);
      if (skills.length === 0) {
        throw new Error('Please add skills to your profile to get recommendations');
      }

      setUserSkills(skills);
      const recommendations = await getRecommendedJobs(skills, jobs);
      
      if (recommendations.length === 0) {
        throw new Error('No recommendations found based on your current skills');
      }

      setRecommendedJobs(recommendations);
      setShowRecommended(true);
      setFilteredJobs(recommendations);
      
      if (recommendations.length > 0) {
        setSelectedJob(recommendations[0]);
      }
    } catch (error) {
      console.error('Error getting recommendations:', error);
      setError(error.message);
    } finally {
      setRecommendationLoading(false);
    }
  };

  const handleShowAllJobs = () => {
    setShowRecommended(false);
    setFilteredJobs(jobs);
    if (jobs.length > 0) {
      setSelectedJob(jobs[0]);
    }
  };

  const jobTypes = [...new Set(jobs.map(job => job.job_type))];
  const jobTitles = [...new Set(jobs.map(job => job.title))];

  return (
    <><Navbar /><div className="min-h-screen bg-gray-50 py-20">
      <div className="w-full px-4 mx-auto max-w-screen-2xl">
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-xs mb-4">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl font-bold text-gray-900">Find Jobs</h1>
            <div className="flex gap-2">
              {showRecommended ? (
                <button
                  onClick={handleShowAllJobs}
                  className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-all flex items-center gap-1"
                >
                  Show All Jobs
                </button>
              ) : (
                <button
                  onClick={handleGetRecommendations}
                  disabled={recommendationLoading}
                  className="px-3 py-1.5 text-sm bg-red-700 text-white rounded-md transition-all flex items-center gap-1"
                >
                  {recommendationLoading ? (
                    <>
                      <span className="animate-spin">↻</span> Getting Recommendations...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" /> Get Recommended Jobs
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            <div className="relative">
              <input
                type="text"
                onChange={keywordHandler}
                placeholder="Search by company name..."
                className="w-full p-2 pl-9 text-sm text-gray-700 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-transparent placeholder-gray-400 transition-all duration-150" />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>

            <div className="relative">
              <select
                value={selectedJobTitle}
                onChange={handleJobTitleChange}
                className="w-full px-3 py-2 pl-9 text-sm border border-gray-200 rounded-md focus:ring-1 focus:ring-red-500 focus:border-transparent outline-none transition-all duration-150 bg-white"
              >
                <option value="">All Job Titles</option>
                {jobTitles.map((title, index) => (
                  <option key={index} value={title}>
                    {title}
                  </option>
                ))}
              </select>
              <Code className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            </div>

            <div className="relative">
              <select
                value={selectedJobType}
                onChange={handleJobTypeChange}
                className="w-full px-3 py-2 pl-9 text-sm border border-gray-200 rounded-md focus:ring-1 focus:ring-red-500 focus:border-transparent outline-none transition-all duration-150 bg-white"
              >
                <option value="">All Job Types</option>
                {jobTypes.map((type) => (
                  <option key={type} value={type}>
                    {getJobType(type)}
                  </option>
                ))}
              </select>
              <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            </div>

            <div className="relative">
              <select
                value={selectedExperience}
                onChange={handleExperienceChange}
                className="w-full px-3 py-2 pl-9 text-sm border border-gray-200 rounded-md focus:ring-1 focus:ring-red-500 focus:border-transparent outline-none transition-all duration-150 bg-white"
              >
                <option value="">All Experience Levels</option>
                {experienceLevels.map((level) => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
              <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            </div>

            <div className="relative">
              <select
                value={selectedWorkLocation}
                onChange={handleWorkLocationChange}
                className="w-full px-3 py-2 pl-9 text-sm border border-gray-200 rounded-md focus:ring-1 focus:ring-red-500 focus:border-transparent outline-none transition-all duration-150 bg-white"
              >
                <option value="">All Work Locations</option>
                {workLocations.map((location) => (
                  <option key={location.value} value={location.value}>
                    {location.label}
                  </option>
                ))}
              </select>
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            </div>

            <div className="relative">
              <select
                value={selectedGov}
                onChange={handleGovChange}
                className="w-full px-3 py-2 pl-9 text-sm border border-gray-200 rounded-md focus:ring-1 focus:ring-red-500 focus:border-transparent outline-none transition-all duration-150 bg-white"
              >
                <option value="">All Locations</option>
                {govs.map((gov) => (
                  <option key={gov.id} value={gov.governorate_name_en}>
                    {gov.governorate_name_en}
                  </option>
                ))}
              </select>
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4 text-sm">
            <p className="text-red-700">{error}</p>
            <button
              onClick={() => setError(null)}
              className="mt-1 text-red-600 hover:text-red-800 text-xs underline"
            >
              Dismiss
            </button>
          </div>
        )}

        <div className="flex flex-col xl:flex-row gap-4">
          <div className={`${filteredJobs.length > 0 || loading ? 'w-full xl:w-2/5' : 'w-full'} h-[calc(100vh-180px)] overflow-y-auto pr-2`}>
            {loading ? (
              <div className="h-60 flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto"></div>
                  <p className="mt-2 text-gray-600 text-sm font-medium">Loading jobs...</p>
                </div>
              </div>
            ) : showRecommended ? (
              filteredJobs.length > 0 ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-sm font-bold text-gray-900">
                      Recommended Jobs ({filteredJobs.length})
                    </h2>
                    <div className="text-xs text-gray-500">
                      Based on your skills: {userSkills.join(', ')}
                    </div>
                  </div>
                  {filteredJobs.map((job) => (
                    <JobCard
                      key={job.id}
                      jobData={job}
                      onSelectJob={handleSelectJob}
                      isSelected={selectedJob?.id === job.id}
                      showScore={true} />
                  ))}
                </div>
              ) : (
                <div className="h-60 flex items-center justify-center">
                  <div className="text-center">
                    <Sparkles className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                    <p className="text-base text-gray-500 mb-1">No matching recommendations</p>
                    <p className="text-gray-400 text-xs">
                      Try adjusting your filters or add more skills to your profile
                    </p>
                  </div>
                </div>
              )
            ) : filteredJobs.length > 0 ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-sm font-bold text-gray-900">
                    Showing {filteredJobs.length} of {totalJobs} Jobs
                  </h2>
                </div>
                {filteredJobs.map((job) => (
                  <JobCard
                    key={job.id}
                    jobData={job}
                    onSelectJob={handleSelectJob}
                    isSelected={selectedJob?.id === job.id} />
                ))}
              </div>
            ) : (
              <div className="h-60 flex items-center justify-center">
                <div className="text-center">
                  <Search className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                  <p className="text-base text-gray-500 mb-1">No jobs found</p>
                  <p className="text-gray-400 text-xs">Try adjusting your search criteria</p>
                </div>
              </div>
            )}
          </div>

          {(filteredJobs.length > 0 || loading || (showRecommended && recommendedJobs.length > 0)) && (
            <div className="w-full xl:w-3/5 h-[calc(100vh-180px)] bg-white border border-gray-200 rounded-lg shadow-xs overflow-hidden flex flex-col">
              {selectedJob ? (
                <>
                  <div className="relative h-28 bg-gradient-to-r from-red-800 to-red-800 flex-shrink-0">
                    <div className="absolute inset-0 bg-black bg-opacity-5"></div>
                    <div className="relative h-full flex items-center justify-between p-4 text-white">
                      <div className="max-w-[80%]">
                        <h1 className="text-lg font-bold mb-0.5 truncate">{selectedJob.title}</h1>
                        <p className="text-red-100 text-sm truncate">{selectedJob.company?.company_profile?.company_name}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-4">
                    {showRecommended && selectedJob.matching_score && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                        <div className="flex items-center gap-2">
                          <Star className="w-5 h-5 text-blue-600" />
                          <div>
                            <h3 className="font-medium text-blue-800">Good Match!</h3>
                            <p className="text-blue-700 text-sm">
                              This job matches {Math.round(selectedJob.matching_score)}% of your skills
                              {selectedJob.matching_reason && ` - ${selectedJob.matching_reason}`}
                              {selectedJob.matched_skills?.length > 0 && (
                                <>
                                  <br />
                                  <span className="text-blue-600">
                                    Matched skills: {selectedJob.matched_skills.join(', ')}
                                  </span>
                                </>
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-gray-50 p-3 rounded border border-gray-200">
                        <div className="flex items-center gap-2 mb-1">
                          <MapPin className="w-4 h-4 text-gray-600" />
                          <span className="text-xs font-medium text-gray-700">Location</span>
                        </div>
                        <p className="text-gray-800 text-sm truncate">
                          {selectedJob.company?.company_profile?.location || 'Location not specified'}
                        </p>
                      </div>

                      <div className="bg-gray-50 p-3 rounded border border-gray-200">
                        <div className="flex items-center gap-2 mb-1">
                          <DollarSign className="w-4 h-4 text-gray-600" />
                          <span className="text-xs font-medium text-gray-700">Salary</span>
                        </div>
                        <p className="text-gray-800 text-sm font-semibold whitespace-nowrap">
                          {formatSalary(selectedJob.salary_min, selectedJob.salary_max)}
                        </p>
                      </div>

                      <div className="bg-gray-50 p-3 rounded border border-gray-200">
                        <div className="flex items-center gap-2 mb-1">
                          <Briefcase className="w-4 h-4 text-gray-600" />
                          <span className="text-xs font-medium text-gray-700">Job Type</span>
                        </div>
                        <p className="text-gray-800 text-sm">{getJobType(selectedJob.job_type)}</p>
                      </div>

                      <div className="bg-gray-50 p-3 rounded border border-gray-200">
                        <div className="flex items-center gap-2 mb-1">
                          <Users className="w-4 h-4 text-gray-600" />
                          <span className="text-xs font-medium text-gray-700">Experience</span>
                        </div>
                        <p className="text-gray-800 text-sm">{getExperienceLevel(selectedJob.experience_level)}</p>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-3 rounded border border-gray-200 mb-4">
                      <div className="flex items-center gap-2 mb-1">
                        <MapPin className="w-4 h-4 text-gray-600" />
                        <span className="text-xs font-medium text-gray-700">Work Location</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {selectedJob.is_remote ? (
                          <span className="bg-green-50 text-green-700 text-xs font-medium px-2 py-0.5 rounded-full">
                            Remote
                          </span>
                        ) : (
                          <>
                            <span className="bg-blue-50 text-blue-700 text-xs font-medium px-2 py-0.5 rounded-full mr-2">
                              On-site
                            </span>
                            {selectedJob.company?.company_profile?.location}
                          </>
                        )}
                      </div>
                    </div>

                    {selectedJob.company?.company_profile && (
                      <div className="bg-gray-50 rounded-lg p-4 mb-4">
                        <h3 className="font-bold text-gray-900 text-sm mb-2 flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-gray-600" />
                          About the Company
                        </h3>
                        <div className="space-y-2 text-sm text-gray-600">
                          <p><span className="font-medium">Industry:</span> {selectedJob.company.company_profile.industry}</p>
                          <p><span className="font-medium">Size:</span> {selectedJob.company.company_profile.company_size}</p>
                          <p><span className="font-medium">Established:</span> {new Date(selectedJob.company.company_profile.established_at).getFullYear()}</p>
                          <p className="mt-2 whitespace-pre-line">{selectedJob.company.company_profile.description}</p>
                        </div>
                      </div>
                    )}

                    <div className="mb-4">
                      <h3 className="font-bold text-gray-900 text-sm mb-2">Job Description</h3>
                      <div className="text-sm text-gray-700 whitespace-pre-line bg-gray-50 p-3 rounded border border-gray-200">
                        {selectedJob.description}
                      </div>
                    </div>

                    <div className="mb-4">
                      <h3 className="font-bold text-gray-900 text-sm mb-2">Requirements</h3>
                      <div className="text-sm text-gray-700 whitespace-pre-line bg-gray-50 p-3 rounded border border-gray-200">
                        {selectedJob.requirements}
                      </div>
                    </div>

                    <div className="mb-4">
                      <h3 className="font-bold text-gray-900 text-sm mb-2">Job Skills</h3>
                      <div className="text-sm text-gray-700 whitespace-pre-line bg-gray-50 p-3 rounded border border-gray-200">
                        {selectedJob.skills?.map((skill, index) => (
                          <span
                            key={index}
                            className="inline-block text-red-800 text-sm font-medium mr-2 mb-2 px-2.5 py-0.5"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-yellow-600" />
                        <span className="font-medium text-yellow-800 text-xs">Application Deadline</span>
                      </div>
                      <p className="text-yellow-700 text-sm mt-1">
                        {new Date(selectedJob.application_deadline).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex-shrink-0 bg-white pt-3 pb-3 border-t border-gray-200 px-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                    <button className="w-full bg-gradient-to-r from-red-800 to-red-800 hover:from-red-700 hover:to-red-800 text-white font-medium py-2 px-4 rounded-md shadow-xs transform transition-all duration-150 focus:ring-1 focus:ring-red-500 focus:ring-offset-1 outline-none text-sm">
                      Apply for This Position
                    </button>
                  </div>
                </>
              ) : (
                <div className="h-full flex items-center justify-center p-4">
                  <div className="text-center">
                    <Briefcase className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                    <p className="text-base text-gray-500 mb-0.5">Select a job to view details</p>
                    <p className="text-gray-400 text-xs">Click on any job card to see more information</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div></>
  );
}