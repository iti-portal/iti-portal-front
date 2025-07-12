import React, { useState, useEffect } from 'react';
import { Calendar, ChevronDown } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import 'react-toastify/dist/ReactToastify.css';

import { fetchAllSkills, addNewSkill, postNewJob } from '../../../services/post-jobApi';

export default function JobPostingForm() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requirements: '',
    salaryMin: '',
    salaryMax: '',
    applicationDeadline: '',
    requiredSkills: [],
    jobType: '',
    experienceLevel: '',
    isFeatured: false,
    isRemote: false
  });

  // State for dropdown visibility
  const [showSkillsDropdown, setShowSkillsDropdown] = useState(false);
  const [showJobTypeDropdown, setShowJobTypeDropdown] = useState(false);
  const [showExperienceDropdown, setShowExperienceDropdown] = useState(false);
  
  // State for API interaction
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [allSkills, setAllSkills] = useState([]);
  const [skillInput, setSkillInput] = useState('');

  // Static options
  const jobTypeOptions = [
    { value: 'full_time', label: 'Full-time' },
    { value: 'part_time', label: 'Part-time' },
    { value: 'contract', label: 'Contract' },
    { value: 'freelance', label: 'Freelance' },
    { value: 'internship', label: 'Internship' }
  ];

  const experienceLevelOptions = [
    { value: 'entry', label: 'Entry Level' },
    { value: 'junior', label: 'Junior' },
    { value: 'mid', label: 'Mid Level' },
    { value: 'senior', label: 'Senior' },
    { value: 'lead', label: 'Lead' },
    { value: 'executive', label: 'Executive' }
  ];

  // Fetch skills from the API service when the component mounts
  useEffect(() => {
    const loadSkills = async () => {
      if (!localStorage.getItem('token')) {
        toast.warn('You must be logged in to see skill suggestions.');
        return;
      }

      try {
        const skillsData = await fetchAllSkills();
        setAllSkills(skillsData);
      } catch (error) {
        console.error(error);
        toast.error(error.message);
      }
    };

    loadSkills();
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSkillToggle = (skill) => {
    setFormData(prev => ({
      ...prev,
      requiredSkills: prev.requiredSkills.filter(s => s !== skill)
    }));
  };
  
  const handleSelectSkill = (skill) => {
    if (!formData.requiredSkills.includes(skill)) {
      setFormData(prev => ({
        ...prev,
        requiredSkills: [...prev.requiredSkills, skill]
      }));
    }
    setSkillInput('');
    setShowSkillsDropdown(false);
  };

  const handleAddNewSkill = async () => {
    const newSkillName = skillInput.trim();
    if (!newSkillName || allSkills.map(s => s.toLowerCase()).includes(newSkillName.toLowerCase())) {
      return;
    }
    
    const loadingToast = toast.loading('Adding new skill...');
    try {
      await addNewSkill(newSkillName);
      
      // On success, update UI state
      setAllSkills(prev => [...prev, newSkillName]);
      handleSelectSkill(newSkillName);

      toast.update(loadingToast, { render: `Skill "${newSkillName}" added!`, type: "success", isLoading: false, autoClose: 3000 });
    } catch (error) {
      console.error(error);
      toast.update(loadingToast, { render: error.message, type: "error", isLoading: false, autoClose: 5000 });
    }
  };

  const handleSubmit = async (action) => {
    if (action === 'Cancel') {
      toast.info('Job posting cancelled');
      return;
    }

    // --- Validation ---
    if (!formData.title || !formData.description || !formData.requirements) {
      toast.error('Please fill in Job Title, Description, and Requirements.');
      return;
    }
    if (!formData.salaryMin || !formData.salaryMax) {
      toast.error('Please provide a full salary range.');
      return;
    }
    if (parseInt(formData.salaryMin) > parseInt(formData.salaryMax)) {
      toast.error('Minimum salary cannot be greater than maximum salary.');
      return;
    }
    if (!formData.jobType || !formData.experienceLevel) {
      toast.error('Please select Job Type and Experience Level.');
      return;
    }

    setIsSubmitting(true);
    const loadingToast = toast.loading('Posting job...');
    
    const jobData = {
      title: formData.title,
      description: formData.description,
      requirements: formData.requirements,
      job_type: formData.jobType,
      experience_level: formData.experienceLevel,
      salary_min: parseInt(formData.salaryMin),
      salary_max: parseInt(formData.salaryMax),
      application_deadline: formData.applicationDeadline || null,
      is_featured: formData.isFeatured,
      is_remote: formData.isRemote,
      skills: formData.requiredSkills.map(skill => ({
        name: skill,
        is_required: true
      }))
    };
    
    try {
      await postNewJob(jobData);
      
      toast.update(loadingToast, { render: "🎉 Job posted successfully!", type: "success", isLoading: false, autoClose: 5000 });
      setFormData({
          title: '', description: '', requirements: '', salaryMin: '',
          salaryMax: '', applicationDeadline: '', requiredSkills: [],
          jobType: '', experienceLevel: '', isFeatured: false, isRemote: false
      });
    } catch (error) {
      console.error(error);
      toast.update(loadingToast, { render: error.message, type: "error", isLoading: false, autoClose: 5000 });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const filteredSkills = skillInput 
    ? allSkills.filter(skill => 
        skill.toLowerCase().includes(skillInput.toLowerCase()) && 
        !formData.requiredSkills.includes(skill)
      )
    : [];
    
  const canAddNewSkill = skillInput.trim() && !allSkills.map(s => s.toLowerCase()).includes(skillInput.trim().toLowerCase());

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
      className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-6"
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8 text-center"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center px-4 py-2 bg-[#203947]/10 text-[#203947] rounded-full text-sm font-medium mb-4"
          >
            <span className="material-icons text-lg mr-2">work_outline</span>
            Post a Job
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="text-3xl lg:text-5xl font-bold text-gray-900 mb-2"
          >
            Post New <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#901b20] to-[#203947]">Job</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed"
          >
            Fill out the form below to post a new job opportunity
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={{
            hidden: { opacity: 0, y: 40 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
          }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {/* Left Column - Job Details */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8"
          >
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Job Details</h2>
              <p className="text-gray-600 text-sm">Provide the core information about the job position.</p>
            </div>
            <div className="space-y-6">
              {/* Job Title */}
              <motion.div whileFocus={{ scale: 1.02 }}>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Job Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g., Senior Software Engineer"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#901b20] focus:border-transparent transition-all"
                />
              </motion.div>
              {/* Job Description */}
              <motion.div whileFocus={{ scale: 1.02 }}>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Job Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  placeholder="Describe the role, responsibilities, and team culture."
                  rows={4}
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#901b20] focus:border-transparent resize-vertical transition-all"
                />
              </motion.div>
              {/* Job Requirements */}
              <motion.div whileFocus={{ scale: 1.02 }}>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Job Requirements <span className="text-red-500">*</span>
                </label>
                <textarea
                  placeholder="List required skills, experience, and qualifications."
                  rows={4}
                  value={formData.requirements}
                  onChange={(e) => handleInputChange('requirements', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#901b20] focus:border-transparent resize-vertical transition-all"
                />
              </motion.div>
              {/* Experience Level */}
              <motion.div whileHover={{ scale: 1.01 }}>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Experience Level <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowExperienceDropdown(!showExperienceDropdown)}
                    onBlur={() => setTimeout(() => setShowExperienceDropdown(false), 150)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#901b20] focus:border-transparent text-left flex items-center justify-between transition-all"
                  >
                    <span className={formData.experienceLevel ? 'text-gray-900' : 'text-gray-500'}>
                      {experienceLevelOptions.find(opt => opt.value === formData.experienceLevel)?.label || 'Select experience level'}
                    </span>
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  </button>
                  <AnimatePresence>
                  {showExperienceDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg"
                    >
                      {experienceLevelOptions.map((level) => (
                        <button
                          key={level.value}
                          type="button"
                          onClick={() => {
                            handleInputChange('experienceLevel', level.value);
                            setShowExperienceDropdown(false);
                          }}
                          className="w-full px-3 py-2 text-left hover:bg-gray-50 text-sm text-gray-700 first:rounded-t-md last:rounded-b-md"
                        >
                          {level.label}
                        </button>
                      ))}
                    </motion.div>
                  )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right Column - Compensation & Logistics */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8"
          >
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Compensation & Logistics</h2>
              <p className="text-gray-600 text-sm">Set salary, deadline, and required skills for applicants.</p>
            </div>
            <div className="space-y-6">
              {/* Salary Range */}
              <motion.div whileFocus={{ scale: 1.02 }}>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Salary Range (Annual) <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <input
                      type="number"
                      placeholder="Min salary"
                      min="0"
                      value={formData.salaryMin}
                      onChange={(e) => handleInputChange('salaryMin', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#901b20] focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      placeholder="Max salary"
                      min="0"
                      value={formData.salaryMax}
                      onChange={(e) => handleInputChange('salaryMax', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#901b20] focus:border-transparent transition-all"
                    />
                  </div>
                </div>
              </motion.div>
              {/* Application Deadline */}
              <motion.div whileFocus={{ scale: 1.02 }}>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Application Deadline
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={formData.applicationDeadline}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) => handleInputChange('applicationDeadline', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#901b20] focus:border-transparent pr-10 transition-all"
                  />
                  <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
              </motion.div>
              {/* Required Skills */}
              <motion.div whileFocus={{ scale: 1.02 }}>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Required Skills
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search or add a new skill"
                    value={skillInput}
                    onChange={(e) => {
                      setSkillInput(e.target.value);
                      setShowSkillsDropdown(true);
                    }}
                    onFocus={() => setShowSkillsDropdown(true)}
                    onBlur={() => setTimeout(() => setShowSkillsDropdown(false), 150)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#901b20] focus:border-transparent transition-all"
                  />
                  <AnimatePresence>
                  {showSkillsDropdown && (filteredSkills.length > 0 || canAddNewSkill) && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto"
                    >
                      {filteredSkills.map((skill) => (
                        <button
                          key={skill}
                          type="button"
                          onMouseDown={() => handleSelectSkill(skill)}
                          className="w-full px-3 py-2 text-left hover:bg-gray-50 text-sm text-gray-700"
                        >
                          {skill}
                        </button>
                      ))}
                      {canAddNewSkill && (
                        <button
                          type="button"
                          onMouseDown={handleAddNewSkill}
                          className="w-full px-3 py-2 text-left hover:bg-gray-50 text-sm text-gray-700 font-semibold"
                        >
                          Add "{skillInput}" as a new skill
                        </button>
                      )}
                    </motion.div>
                  )}
                  </AnimatePresence>
                </div>
                {formData.requiredSkills.length > 0 && (
                  <motion.div className="mt-2 flex flex-wrap gap-2">
                    {formData.requiredSkills.map((skill) => (
                      <motion.span
                        key={skill}
                        whileHover={{ scale: 1.08 }}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 shadow-sm"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => handleSkillToggle(skill)}
                          className="ml-1.5 h-4 w-4 rounded-full bg-gray-300 hover:bg-gray-400 flex items-center justify-center focus:outline-none"
                        >
                          <span className="text-xs text-white pb-0.5">×</span>
                        </button>
                      </motion.span>
                    ))}
                  </motion.div>
                )}
              </motion.div>
              {/* Job Type */}
              <motion.div whileHover={{ scale: 1.01 }}>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Job Type <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowJobTypeDropdown(!showJobTypeDropdown)}
                    onBlur={() => setTimeout(() => setShowJobTypeDropdown(false), 150)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#901b20] focus:border-transparent text-left flex items-center justify-between transition-all"
                  >
                    <span className={formData.jobType ? 'text-gray-900' : 'text-gray-500'}>
                      {jobTypeOptions.find(opt => opt.value === formData.jobType)?.label || 'Select a job type'}
                    </span>
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  </button>
                  <AnimatePresence>
                  {showJobTypeDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg"
                    >
                      {jobTypeOptions.map((type) => (
                        <button
                          key={type.value}
                          type="button"
                          onClick={() => {
                            handleInputChange('jobType', type.value);
                            setShowJobTypeDropdown(false);
                          }}
                          className="w-full px-3 py-2 text-left hover:bg-gray-50 text-sm text-gray-700 first:rounded-t-md last:rounded-b-md"
                        >
                          {type.label}
                        </button>
                      ))}
                    </motion.div>
                  )}
                  </AnimatePresence>
                </div>
              </motion.div>
              {/* Additional Options */}
              <motion.div className="space-y-3 pt-3">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => handleInputChange('isFeatured', e.target.checked)}
                    className="mr-2 h-4 w-4 text-[#901b20] focus:ring-[#901b20] border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">Feature this job post (extra charges may apply)</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isRemote}
                    onChange={(e) => handleInputChange('isRemote', e.target.checked)}
                    className="mr-2 h-4 w-4 text-[#901b20] focus:ring-[#901b20] border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">This is a fully remote position</span>
                </label>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex justify-end gap-3 mt-8"
        >
          <motion.button
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => handleSubmit('Cancel')}
            className="px-6 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#901b20]"
            disabled={isSubmitting}
          >
            Cancel
          </motion.button>
          <motion.button
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => handleSubmit('Post Job')}
            className="px-6 py-2 bg-gradient-to-r from-[#901b20] to-[#203947] text-white rounded-md text-sm font-medium hover:from-[#a83236] hover:to-[#2a4a5a] transition-all disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#901b20] shadow-lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Posting...' : 'Post Job'}
          </motion.button>
        </motion.div>
      </div>

      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </motion.div>
  );
}