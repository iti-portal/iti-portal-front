// src/features/Student/Profile/components/edit/EducationAndExperienceForm.js

import React, { useState, useEffect } from 'react';

// دالة لإنشاء ID فريد مؤقت
const generateUniqueId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);

function EducationFormItem({ education, onUpdate, onDelete }) {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    // For checkbox, use checked; otherwise, use value
    onUpdate(education.id, {
      ...education,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  return (
    <div className="bg-gray-50 p-4 rounded-md shadow-sm border border-gray-200 mb-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Degree / Diploma */}
        <div>
          <label htmlFor={`edu-degree-${education.id}`} className="block text-sm font-medium text-gray-700">Degree / Diploma</label>
          <input
            type="text" name="degree" id={`edu-degree-${education.id}`} value={education.degree} onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="e.g., Bachelor in Computer Engineering"
          />
        </div>
        {/* University / Institute */}
        <div>
          <label htmlFor={`edu-university-${education.id}`} className="block text-sm font-medium text-gray-700">University / Institute</label>
          <input
            type="text" name="university" id={`edu-university-${education.id}`} value={education.university} onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="e.g., Cairo University"
          />
        </div>
        {/* Start Date */}
        <div>
          <label htmlFor={`edu-startDate-${education.id}`} className="block text-sm font-medium text-gray-700">Start Date</label>
          <input
            type="date" name="startDate" id={`edu-startDate-${education.id}`} value={education.startDate} onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        {/* End Date / Present */}
        <div>
          <label htmlFor={`edu-endDate-${education.id}`} className="block text-sm font-medium text-gray-700">End Date</label>
          <input
            type="date" name="endDate" id={`edu-endDate-${education.id}`} value={education.endDate} onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            disabled={education.isCurrentlyStudying}
          />
          <div className="flex items-center mt-2">
            <input
              id={`edu-present-${education.id}`}
              name="isCurrentlyStudying"
              type="checkbox"
              checked={education.isCurrentlyStudying}
              onChange={handleChange}
              className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
            />
            <label htmlFor={`edu-present-${education.id}`} className="ml-2 block text-sm text-gray-900">
              Currently Studying
            </label>
          </div>
        </div>
        {/* Description */}
        <div className="md:col-span-2">
          <label htmlFor={`edu-description-${education.id}`} className="block text-sm font-medium text-gray-700">Description (Optional)</label>
          <textarea
            name="description" id={`edu-description-${education.id}`} rows="3" value={education.description || ''} onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm resize-y"
            placeholder="e.g., Graduated with excellent grades, focusing on software development and data analysis."
          ></textarea>
        </div>
      </div>
      <div className="flex justify-end mt-4">
        <button
          type="button"
          onClick={() => onDelete(education.id)}
          className="ml-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Delete Qualification
        </button>
      </div>
    </div>
  );
}

// ==========================================================
// مكون لـ Work Experience Item (الخبرة العملية)
// ==========================================================
function WorkExperienceFormItem({ experience, onUpdate, onDelete }) {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    onUpdate(experience.id, {
      ...experience,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  return (
    <div className="bg-gray-50 p-4 rounded-md shadow-sm border border-gray-200 mb-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Job Title */}
        <div>
          <label htmlFor={`exp-title-${experience.id}`} className="block text-sm font-medium text-gray-700">Job Title</label>
          <input
            type="text" name="title" id={`exp-title-${experience.id}`} value={experience.title} onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="e.g., Front-end Developer"
          />
        </div>
        {/* Company */}
        <div>
          <label htmlFor={`exp-company-${experience.id}`} className="block text-sm font-medium text-gray-700">Company / Organization</label>
          <input
            type="text" name="company" id={`exp-company-${experience.id}`} value={experience.company} onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="e.g., TechSolutions"
          />
        </div>
        {/* Location */}
        <div>
          <label htmlFor={`exp-location-${experience.id}`} className="block text-sm font-medium text-gray-700">Location</label>
          <input
            type="text" name="location" id={`exp-location-${experience.id}`} value={experience.location || ''} onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="e.g., Cairo, Egypt"
          />
        </div>
        {/* Start Date */}
        <div>
          <label htmlFor={`exp-startDate-${experience.id}`} className="block text-sm font-medium text-gray-700">Start Date</label>
          <input
            type="date" name="startDate" id={`exp-startDate-${experience.id}`} value={experience.startDate} onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        {/* End Date / Present */}
        <div>
          <label htmlFor={`exp-endDate-${experience.id}`} className="block text-sm font-medium text-gray-700">End Date</label>
          <input
            type="date" name="endDate" id={`exp-endDate-${experience.id}`} value={experience.endDate} onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            disabled={experience.isCurrentlyWorking}
          />
          <div className="flex items-center mt-2">
            <input
              id={`exp-present-${experience.id}`}
              name="isCurrentlyWorking"
              type="checkbox"
              checked={experience.isCurrentlyWorking}
              onChange={handleChange}
              className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
            />
            <label htmlFor={`exp-present-${experience.id}`} className="ml-2 block text-sm text-gray-900">
              Currently Working Here
            </label>
          </div>
        </div>
        {/* Responsibilities / Description */}
        <div className="md:col-span-2">
          <label htmlFor={`exp-description-${experience.id}`} className="block text-sm font-medium text-gray-700">Responsibilities / Description</label>
          <textarea
            name="description" id={`exp-description-${experience.id}`} rows="4" value={experience.description} onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm resize-y"
            placeholder="Describe your key responsibilities and achievements in this role."
          ></textarea>
        </div>
      </div>
      <div className="flex justify-end mt-4">
        <button
          type="button"
          onClick={() => onDelete(experience.id)}
          className="ml-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Delete Experience
        </button>
      </div>
    </div>
  );
}

// ==========================================================
// المكون الرئيسي لـ Education & Experience Tab
// ==========================================================
function EducationAndExperienceForm({ educations, workExperiences, onUpdateEducations, onUpdateWorkExperiences }) {
  const [currentEducations, setCurrentEducations] = useState(educations || []);
  const [currentWorkExperiences, setCurrentWorkExperiences] = useState(workExperiences || []);

  // مزامنة البيانات من الـ props مع الحالة الداخلية عند التغيير الخارجي
  useEffect(() => {
    setCurrentEducations(educations || []);
    setCurrentWorkExperiences(workExperiences || []);
  }, [educations, workExperiences]);

  // Education Handlers
  const handleEducationUpdate = (id, updatedEdu) => {
    const updatedEducations = currentEducations.map(edu => (edu.id === id ? updatedEdu : edu));
    setCurrentEducations(updatedEducations);
    onUpdateEducations(updatedEducations);
  };

  const handleAddEducation = () => {
    const newEdu = {
      id: generateUniqueId(),
      degree: '',
      university: '',
      startDate: '',
      endDate: '',
      description: '',
      isCurrentlyStudying: false,
    };
    const updatedEducations = [...currentEducations, newEdu];
    setCurrentEducations(updatedEducations);
    onUpdateEducations(updatedEducations);
  };

  const handleEducationDelete = (idToDelete) => {
    const updatedEducations = currentEducations.filter(edu => edu.id !== idToDelete);
    setCurrentEducations(updatedEducations);
    onUpdateEducations(updatedEducations);
  };

  // Work Experience Handlers
  const handleWorkExperienceUpdate = (id, updatedExp) => {
    const updatedExperiences = currentWorkExperiences.map(exp => (exp.id === id ? updatedExp : exp));
    setCurrentWorkExperiences(updatedExperiences);
    onUpdateWorkExperiences(updatedExperiences);
  };

  const handleAddWorkExperience = () => {
    const newExp = {
      id: generateUniqueId(),
      title: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      description: '',
      isCurrentlyWorking: false,
    };
    const updatedExperiences = [...currentWorkExperiences, newExp];
    setCurrentWorkExperiences(updatedExperiences);
    onUpdateWorkExperiences(updatedExperiences);
  };

  const handleWorkExperienceDelete = (idToDelete) => {
    const updatedExperiences = currentWorkExperiences.filter(exp => exp.id !== idToDelete);
    setCurrentWorkExperiences(updatedExperiences);
    onUpdateWorkExperiences(updatedExperiences);
  };

  return (
    <div className="space-y-6">
      {/* Education & Qualifications Section */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Education & Qualifications</h2>
        <p className="text-gray-600 text-sm mb-4">Add your academic background and certifications.</p>

        {currentEducations.length > 0 ? (
          currentEducations.map(edu => (
            <EducationFormItem
              key={edu.id}
              education={edu}
              onUpdate={handleEducationUpdate}
              onDelete={handleEducationDelete}
            />
          ))
        ) : (
          <p className="text-gray-500 text-center py-4">No education qualifications added yet.</p>
        )}

        <button
          type="button"
          onClick={handleAddEducation}
          className="mt-4 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Add New Qualification
        </button>
      </div>

      {/* Work Experience Section (Optional, if you want it in the same tab) */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Work Experience</h2>
        <p className="text-gray-600 text-sm mb-4">Detail your professional work history.</p>

        {currentWorkExperiences.length > 0 ? (
          currentWorkExperiences.map(exp => (
            <WorkExperienceFormItem
              key={exp.id}
              experience={exp}
              onUpdate={handleWorkExperienceUpdate}
              onDelete={handleWorkExperienceDelete}
            />
          ))
        ) : (
          <p className="text-gray-500 text-center py-4">No work experience added yet.</p>
        )}

        <button
          type="button"
          onClick={handleAddWorkExperience}
          className="mt-4 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Add New Work Experience
        </button>
      </div>
    </div>
  );
}

export default EducationAndExperienceForm;