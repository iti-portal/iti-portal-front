import React, { useState } from 'react';
import { Calendar, ChevronDown } from 'lucide-react';

export default function PostJob() {
  const [formData, setFormData] = useState({
    jobTitle: '',
    jobDescription: '',
    jobRequirements: '',
    salaryRange: '',
    applicationDeadline: '',
    requiredSkills: [],
    jobType: ''
  });

  const [showSkillsDropdown, setShowSkillsDropdown] = useState(false);
  const [showJobTypeDropdown, setShowJobTypeDropdown] = useState(false);

  const skillOptions = [
    'JavaScript', 'React', 'Node.js', 'Python', 'Java', 'SQL', 'AWS', 'Docker',
    'Project Management', 'Communication', 'Leadership', 'Problem Solving'
  ];

  const jobTypeOptions = [
    'Full-time', 'Part-time', 'Contract', 'Freelance', 'Internship', 'Remote'
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSkillToggle = (skill) => {
    setFormData(prev => ({
      ...prev,
      requiredSkills: prev.requiredSkills.includes(skill)
        ? prev.requiredSkills.filter(s => s !== skill)
        : [...prev.requiredSkills, skill]
    }));
  };

  const handleSubmit = (action) => {
    console.log(`${action} clicked`, formData);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Post New Job</h1>
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
                  Job Title
                </label>
                <input
                  type="text"
                  placeholder="e.g., Senior Software Engineer"
                  value={formData.jobTitle}
                  onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#901b20] focus:border-transparent"
                />
              </div>

              {/* Job Description */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Job Description
                </label>
                <textarea
                  placeholder="Describe the role, responsibilities, and team culture."
                  rows={4}
                  value={formData.jobDescription}
                  onChange={(e) => handleInputChange('jobDescription', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#901b20] focus:border-transparent resize-none"
                />
              </div>

              {/* Job Requirements */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Job Requirements
                </label>
                <textarea
                  placeholder="List required skills, experience, and qualifications."
                  rows={4}
                  value={formData.jobRequirements}
                  onChange={(e) => handleInputChange('jobRequirements', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#901b20] focus:border-transparent resize-none"
                />
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
                  Salary Range (Annual)
                </label>
                <input
                  type="text"
                  placeholder="e.g., $80,000 - $120,000"
                  value={formData.salaryRange}
                  onChange={(e) => handleInputChange('salaryRange', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#901b20] focus:border-transparent"
                />
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
                  <button
                    type="button"
                    onClick={() => setShowSkillsDropdown(!showSkillsDropdown)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#901b20] focus:border-transparent text-left flex items-center justify-between"
                  >
                    <span className="text-gray-500">
                      {formData.requiredSkills.length > 0 
                        ? `${formData.requiredSkills.length} skills selected`
                        : 'Add skills'
                      }
                    </span>
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  </button>
                  
                  {showSkillsDropdown && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
                      {skillOptions.map((skill) => (
                        <label key={skill} className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.requiredSkills.includes(skill)}
                            onChange={() => handleSkillToggle(skill)}
                            className="mr-2 h-4 w-4 text-[#901b20] focus:ring-[#901b20] border-gray-300 rounded"
                          />
                          <span className="text-sm text-gray-700">{skill}</span>
                        </label>
                      ))}
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
                          className="ml-1 h-3 w-3 rounded-full bg-gray-300 hover:bg-gray-400 flex items-center justify-center"
                        >
                          <span className="text-xs text-white">×</span>
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Job Type */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Job Type
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowJobTypeDropdown(!showJobTypeDropdown)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#901b20] focus:border-transparent text-left flex items-center justify-between"
                  >
                    <span className={formData.jobType ? 'text-gray-900' : 'text-gray-500'}>
                      {formData.jobType || 'Select a job type'}
                    </span>
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  </button>
                  
                  {showJobTypeDropdown && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                      {jobTypeOptions.map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => {
                            handleInputChange('jobType', type);
                            setShowJobTypeDropdown(false);
                          }}
                          className="w-full px-3 py-2 text-left hover:bg-gray-50 text-sm text-gray-700 first:rounded-t-md last:rounded-b-md"
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 mt-8">
          <button
            type="button"
            onClick={() => handleSubmit('Cancel')}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => handleSubmit('Post Job')}
            className="px-6 py-2 bg-[#901b20] text-white rounded-md hover:bg-[#7a1719] transition-colors"
          >
            Post Job
          </button>
        </div>
      </div>
    </div>
  );
}