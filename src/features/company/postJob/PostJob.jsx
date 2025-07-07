import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, ChevronDown } from 'lucide-react';

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

  // Fetch skills from the backend when the component mounts
  useEffect(() => {
    const fetchSkills = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.warn('You must be logged in to see skill suggestions.');
        return;
      }

      try {
        const response = await axios.get('http://localhost:8000/api/skills/', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const skillsData = response.data.data;
        
        if (Array.isArray(skillsData)) {
          setAllSkills(skillsData.map(skill => skill.name));
        } else {
          console.error("API response for skills did not contain a 'data' array.", response.data);
          toast.error("Received an unexpected skill format from the server.");
        }

      } catch (error) {
        console.error('Failed to fetch skills:', error);
        toast.error('Could not load skills from the server.');
      }
    };

    fetchSkills();
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
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
    const token = localStorage.getItem('token');
    const newSkillName = skillInput.trim();

    if (!newSkillName || allSkills.map(s => s.toLowerCase()).includes(newSkillName.toLowerCase())) {
        return;
    }
    if (!token) {
        toast.error('Authentication required to add a new skill.');
        return;
    }

    const loadingToast = toast.loading('Adding new skill...');
    try {
        const skillFormData = new FormData();
        skillFormData.append('skill_name', newSkillName); 

        // ### FINAL FIX: Use the skill name from the input since the API call was successful ###
        // The API call returns a success message, not the created object.
        // We await the call to ensure it completes without error.
        await axios.post(
            'http://localhost:8000/api/user-skills/', 
            skillFormData,
            { 
                headers: { 
                    'Authorization': `Bearer ${token}`
                } 
            }
        );
        
        // If the above line doesn't throw an error, the creation was successful.
        // Now, we use the 'newSkillName' we already have to update the UI.
        setAllSkills(prev => [...prev, newSkillName]);
        handleSelectSkill(newSkillName);

        toast.dismiss(loadingToast);
        toast.success(`Skill "${newSkillName}" added successfully!`);

    } catch (error) {
        toast.dismiss(loadingToast);
        console.error('Failed to add new skill:', error.response?.data || error.message);
        toast.error(error.response?.data?.message || 'Could not add new skill.');
    }
  };


  const handleSubmit = async (action) => {
    if (action === 'Cancel') {
      toast.info('Job posting cancelled');
      return;
    }

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
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found. Please login first.');
      }
      
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

      await axios.post('http://localhost:8000/api/company/jobs/', jobData, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      toast.dismiss(loadingToast);
      toast.success('🎉 Job posted successfully!');
      setFormData({
          title: '', description: '', requirements: '', salaryMin: '',
          salaryMax: '', applicationDeadline: '', requiredSkills: [],
          jobType: '', experienceLevel: '', isFeatured: false, isRemote: false
      });

    } catch (error) {
      console.error('Job posting failed:', error.response?.data || error.message);
      const errorMessage = error.response?.data?.message || error.response?.data?.detail || 'An unexpected error occurred.';
      toast.error(errorMessage);
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

  // (JSX is unchanged and omitted for brevity)
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Post New Job</h1>
          <p className="text-gray-600">Fill out the form below to post a new job opportunity</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Job Details */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Job Details</h2>
              <p className="text-gray-600 text-sm">Provide the core information about the job position.</p>
            </div>
            <div className="space-y-6">
              {/* Job Title */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Job Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g., Senior Software Engineer"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#901b20] focus:border-transparent"
                />
              </div>

              {/* Job Description */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Job Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  placeholder="Describe the role, responsibilities, and team culture."
                  rows={4}
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#901b20] focus:border-transparent resize-vertical"
                />
              </div>

              {/* Job Requirements */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Job Requirements <span className="text-red-500">*</span>
                </label>
                <textarea
                  placeholder="List required skills, experience, and qualifications."
                  rows={4}
                  value={formData.requirements}
                  onChange={(e) => handleInputChange('requirements', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#901b20] focus:border-transparent resize-vertical"
                />
              </div>

              {/* Experience Level */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Experience Level <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowExperienceDropdown(!showExperienceDropdown)}
                    onBlur={() => setTimeout(() => setShowExperienceDropdown(false), 150)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#901b20] focus:border-transparent text-left flex items-center justify-between"
                  >
                    <span className={formData.experienceLevel ? 'text-gray-900' : 'text-gray-500'}>
                      {experienceLevelOptions.find(opt => opt.value === formData.experienceLevel)?.label || 'Select experience level'}
                    </span>
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  </button>
                  
                  {showExperienceDropdown && (
                    <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
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
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Compensation & Logistics */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Compensation & Logistics</h2>
              <p className="text-gray-600 text-sm">Set salary, deadline, and required skills for applicants.</p>
            </div>

            <div className="space-y-6">
              {/* Salary Range */}
              <div>
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#901b20] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      placeholder="Max salary"
                      min="0"
                      value={formData.salaryMax}
                      onChange={(e) => handleInputChange('salaryMax', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#901b20] focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Application Deadline */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Application Deadline
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={formData.applicationDeadline}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) => handleInputChange('applicationDeadline', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#901b20] focus:border-transparent pr-10"
                  />
                  <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Required Skills */}
              <div>
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#901b20] focus:border-transparent"
                    />
                  
                  {showSkillsDropdown && (filteredSkills.length > 0 || canAddNewSkill) && (
                    <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
                      {filteredSkills.map((skill) => (
                        <button
                          key={skill}
                          type="button"
                          onMouseDown={() => handleSelectSkill(skill)} // use onMouseDown to fire before onBlur
                          className="w-full px-3 py-2 text-left hover:bg-gray-50 text-sm text-gray-700"
                        >
                          {skill}
                        </button>
                      ))}
                      {canAddNewSkill && (
                        <button
                          type="button"
                          onMouseDown={handleAddNewSkill} // use onMouseDown to fire before onBlur
                          className="w-full px-3 py-2 text-left hover:bg-gray-50 text-sm text-gray-700 font-semibold"
                        >
                          Add "{skillInput}" as a new skill
                        </button>
                      )}
                    </div>
                  )}
                </div>
                
                {formData.requiredSkills.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {formData.requiredSkills.map((skill) => (
                      <span key={skill} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {skill}
                        <button
                          type="button"
                          onClick={() => handleSkillToggle(skill)}
                          className="ml-1.5 h-4 w-4 rounded-full bg-gray-300 hover:bg-gray-400 flex items-center justify-center focus:outline-none"
                        >
                          <span className="text-xs text-white pb-0.5">×</span>
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Job Type */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Job Type <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowJobTypeDropdown(!showJobTypeDropdown)}
                    onBlur={() => setTimeout(() => setShowJobTypeDropdown(false), 150)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#901b20] focus:border-transparent text-left flex items-center justify-between"
                  >
                    <span className={formData.jobType ? 'text-gray-900' : 'text-gray-500'}>
                      {jobTypeOptions.find(opt => opt.value === formData.jobType)?.label || 'Select a job type'}
                    </span>
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  </button>
                  
                  {showJobTypeDropdown && (
                    <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
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
                    </div>
                  )}
                </div>
              </div>

              {/* Additional Options */}
              <div className="space-y-3 pt-3">
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
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 mt-8">
          <button
            type="button"
            onClick={() => handleSubmit('Cancel')}
            className="px-6 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#901b20]"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => handleSubmit('Post Job')}
            className="px-6 py-2 bg-[#901b20] text-white rounded-md text-sm font-medium hover:bg-[#7a1719] transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#901b20]"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Posting...' : 'Post Job'}
          </button>
        </div>
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
    </div>
  );
}