// src/features/Student/Profile/components/edit/EducationAndExperienceForm.js

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaTrash, FaGraduationCap, FaBriefcase } from 'react-icons/fa';

// دالة لإنشاء ID فريد مؤقت
const generateUniqueId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);

function EducationFormItem({ education, onUpdate, onDelete }) {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    onUpdate(education.id, {
      ...education,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  return (
    <motion.div 
      className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-xl shadow-md border border-gray-200 mb-4 hover:shadow-lg transition-shadow duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.01 }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Degree / Diploma */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <label htmlFor={`edu-degree-${education.id}`} className="block text-sm font-semibold text-gray-700 mb-2">Degree / Diploma</label>
          <motion.input
            type="text" name="degree" id={`edu-degree-${education.id}`} value={education.degree} onChange={handleChange}
            className="block w-full border border-gray-300 rounded-lg shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#901b20] focus:border-[#901b20] sm:text-sm transition-all duration-200 hover:border-gray-400"
            placeholder="e.g., Bachelor in Computer Engineering"
            whileFocus={{ scale: 1.02 }}
          />
        </motion.div>
        
        {/* University / Institute */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <label htmlFor={`edu-university-${education.id}`} className="block text-sm font-semibold text-gray-700 mb-2">University / Institute</label>
          <motion.input
            type="text" name="university" id={`edu-university-${education.id}`} value={education.university} onChange={handleChange}
            className="block w-full border border-gray-300 rounded-lg shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#901b20] focus:border-[#901b20] sm:text-sm transition-all duration-200 hover:border-gray-400"
            placeholder="e.g., Cairo University"
            whileFocus={{ scale: 1.02 }}
          />
        </motion.div>
        
        {/* Start Date */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <label htmlFor={`edu-startDate-${education.id}`} className="block text-sm font-semibold text-gray-700 mb-2">Start Date</label>
          <motion.input
            type="date" name="startDate" id={`edu-startDate-${education.id}`} value={education.startDate} onChange={handleChange}
            className="block w-full border border-gray-300 rounded-lg shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#901b20] focus:border-[#901b20] sm:text-sm transition-all duration-200 hover:border-gray-400"
            whileFocus={{ scale: 1.02 }}
          />
        </motion.div>
        
        {/* End Date / Present */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <label htmlFor={`edu-endDate-${education.id}`} className="block text-sm font-semibold text-gray-700 mb-2">End Date</label>
          <motion.input
            type="date" name="endDate" id={`edu-endDate-${education.id}`} value={education.endDate} onChange={handleChange}
            className="block w-full border border-gray-300 rounded-lg shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#901b20] focus:border-[#901b20] sm:text-sm transition-all duration-200 hover:border-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
            disabled={education.isCurrentlyStudying}
            whileFocus={{ scale: 1.02 }}
          />
          <motion.div 
            className="flex items-center mt-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.5 }}
          >
            <input
              id={`edu-present-${education.id}`}
              name="isCurrentlyStudying"
              type="checkbox"
              checked={education.isCurrentlyStudying}
              onChange={handleChange}
              className="h-4 w-4 text-[#901b20] focus:ring-[#901b20] border-gray-300 rounded"
            />
            <label htmlFor={`edu-present-${education.id}`} className="ml-2 block text-sm text-gray-700 font-medium">
              Currently Studying
            </label>
          </motion.div>
        </motion.div>
        
        {/* Description */}
        <motion.div 
          className="md:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.6 }}
        >
          <label htmlFor={`edu-description-${education.id}`} className="block text-sm font-semibold text-gray-700 mb-2">Description (Optional)</label>
          <motion.textarea
            name="description" id={`edu-description-${education.id}`} rows="3" value={education.description || ''} onChange={handleChange}
            className="block w-full border border-gray-300 rounded-lg shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#901b20] focus:border-[#901b20] sm:text-sm resize-y transition-all duration-200 hover:border-gray-400"
            placeholder="e.g., Graduated with excellent grades, focusing on software development and data analysis."
            whileFocus={{ scale: 1.01 }}
          ></motion.textarea>
        </motion.div>
      </div>
      
      <motion.div 
        className="flex justify-end mt-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.7 }}
      >
        <motion.button
          type="button"
          onClick={() => onDelete(education.id)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200"
          whileHover={{ scale: 1.05, boxShadow: "0 8px 20px rgba(220, 38, 38, 0.3)" }}
          whileTap={{ scale: 0.95 }}
        >
          <FaTrash className="mr-2" />
          Delete Qualification
        </motion.button>
      </motion.div>
    </motion.div>
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
    <motion.div 
      className="bg-gradient-to-br from-white to-blue-50 p-6 rounded-xl shadow-md border border-gray-200 mb-4 hover:shadow-lg transition-shadow duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.01 }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Job Title */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <label htmlFor={`exp-title-${experience.id}`} className="block text-sm font-semibold text-gray-700 mb-2">Job Title</label>
          <motion.input
            type="text" name="title" id={`exp-title-${experience.id}`} value={experience.title} onChange={handleChange}
            className="block w-full border border-gray-300 rounded-lg shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#901b20] focus:border-[#901b20] sm:text-sm transition-all duration-200 hover:border-gray-400"
            placeholder="e.g., Front-end Developer"
            whileFocus={{ scale: 1.02 }}
          />
        </motion.div>
        
        {/* Company */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <label htmlFor={`exp-company-${experience.id}`} className="block text-sm font-semibold text-gray-700 mb-2">Company / Organization</label>
          <motion.input
            type="text" name="company" id={`exp-company-${experience.id}`} value={experience.company} onChange={handleChange}
            className="block w-full border border-gray-300 rounded-lg shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#901b20] focus:border-[#901b20] sm:text-sm transition-all duration-200 hover:border-gray-400"
            placeholder="e.g., TechSolutions"
            whileFocus={{ scale: 1.02 }}
          />
        </motion.div>
        
        {/* Location */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <label htmlFor={`exp-location-${experience.id}`} className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
          <motion.input
            type="text" name="location" id={`exp-location-${experience.id}`} value={experience.location || ''} onChange={handleChange}
            className="block w-full border border-gray-300 rounded-lg shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#901b20] focus:border-[#901b20] sm:text-sm transition-all duration-200 hover:border-gray-400"
            placeholder="e.g., Cairo, Egypt"
            whileFocus={{ scale: 1.02 }}
          />
        </motion.div>
        
        {/* Start Date */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <label htmlFor={`exp-startDate-${experience.id}`} className="block text-sm font-semibold text-gray-700 mb-2">Start Date</label>
          <motion.input
            type="date" name="startDate" id={`exp-startDate-${experience.id}`} value={experience.startDate} onChange={handleChange}
            className="block w-full border border-gray-300 rounded-lg shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#901b20] focus:border-[#901b20] sm:text-sm transition-all duration-200 hover:border-gray-400"
            whileFocus={{ scale: 1.02 }}
          />
        </motion.div>
        
        {/* End Date / Present */}
        <motion.div 
          className="md:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
        >
          <label htmlFor={`exp-endDate-${experience.id}`} className="block text-sm font-semibold text-gray-700 mb-2">End Date</label>
          <motion.input
            type="date" name="endDate" id={`exp-endDate-${experience.id}`} value={experience.endDate} onChange={handleChange}
            className="block w-full border border-gray-300 rounded-lg shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#901b20] focus:border-[#901b20] sm:text-sm transition-all duration-200 hover:border-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
            disabled={experience.isCurrentlyWorking}
            whileFocus={{ scale: 1.02 }}
          />
          <motion.div 
            className="flex items-center mt-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.6 }}
          >
            <input
              id={`exp-present-${experience.id}`}
              name="isCurrentlyWorking"
              type="checkbox"
              checked={experience.isCurrentlyWorking}
              onChange={handleChange}
              className="h-4 w-4 text-[#901b20] focus:ring-[#901b20] border-gray-300 rounded"
            />
            <label htmlFor={`exp-present-${experience.id}`} className="ml-2 block text-sm text-gray-700 font-medium">
              Currently Working Here
            </label>
          </motion.div>
        </motion.div>
        
        {/* Responsibilities / Description */}
        <motion.div 
          className="md:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.7 }}
        >
          <label htmlFor={`exp-description-${experience.id}`} className="block text-sm font-semibold text-gray-700 mb-2">Responsibilities / Description</label>
          <motion.textarea
            name="description" id={`exp-description-${experience.id}`} rows="4" value={experience.description} onChange={handleChange}
            className="block w-full border border-gray-300 rounded-lg shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#901b20] focus:border-[#901b20] sm:text-sm resize-y transition-all duration-200 hover:border-gray-400"
            placeholder="Describe your key responsibilities and achievements in this role."
            whileFocus={{ scale: 1.01 }}
          ></motion.textarea>
        </motion.div>
      </div>
      
      <motion.div 
        className="flex justify-end mt-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.8 }}
      >
        <motion.button
          type="button"
          onClick={() => onDelete(experience.id)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200"
          whileHover={{ scale: 1.05, boxShadow: "0 8px 20px rgba(220, 38, 38, 0.3)" }}
          whileTap={{ scale: 0.95 }}
        >
          <FaTrash className="mr-2" />
          Delete Experience
        </motion.button>
      </motion.div>
    </motion.div>
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
    <motion.div 
      className="space-y-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Education & Qualifications Section */}
      <motion.div 
        className="bg-white rounded-xl p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        whileHover={{ scale: 1.01 }}
      >
        <motion.div 
          className="flex items-center mb-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="bg-gradient-to-r from-[#901b20] to-red-700 p-3 rounded-full mr-4">
            <FaGraduationCap className="text-white text-xl" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800 bg-gradient-to-r from-[#901b20] to-red-700 bg-clip-text text-transparent">
              Education & Qualifications
            </h2>
            <p className="text-gray-600 text-sm mt-1">Add your academic background and certifications.</p>
          </div>
        </motion.div>        {/* Fixed Height Scrollable Container */}
        <div className="max-h-96 overflow-y-auto custom-scrollbar pr-2 mb-6 space-y-4">
          <AnimatePresence>
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
              <motion.div 
                className="text-center py-12 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-dashed border-gray-300"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <FaGraduationCap className="mx-auto text-4xl text-gray-400 mb-4" />
                <p className="text-gray-500 text-lg font-medium">No education qualifications added yet</p>
                <p className="text-gray-400 text-sm mt-2">Click the button below to add your first qualification</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.button
          type="button"
          onClick={handleAddEducation}
          className="w-full bg-gradient-to-r from-[#901b20] to-red-700 hover:from-[#7a1619] hover:to-red-800 text-white font-semibold py-4 px-6 rounded-xl shadow-lg transition-all duration-300 transform flex items-center justify-center"
          whileHover={{ 
            scale: 1.02, 
            boxShadow: "0 8px 20px rgba(144, 27, 32, 0.3)" 
          }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <FaPlus className="mr-3 text-lg" />
          Add New Qualification
        </motion.button>
      </motion.div>

      {/* Work Experience Section */}
      <motion.div 
        className="bg-white rounded-xl p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        whileHover={{ scale: 1.01 }}
      >
        <motion.div 
          className="flex items-center mb-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="bg-gradient-to-r from-[#901b20] to-red-700 p-3 rounded-full mr-4">
            <FaBriefcase className="text-white text-xl" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800 bg-gradient-to-r from-[#901b20] to-red-700 bg-clip-text text-transparent">
              Work Experience
            </h2>
            <p className="text-gray-600 text-sm mt-1">Detail your professional work history.</p>
          </div>
        </motion.div>        {/* Fixed Height Scrollable Container */}
        <div className="max-h-96 overflow-y-auto custom-scrollbar pr-2 mb-6 space-y-4">
          <AnimatePresence>
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
              <motion.div 
                className="text-center py-12 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl border-2 border-dashed border-gray-300"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <FaBriefcase className="mx-auto text-4xl text-gray-400 mb-4" />
                <p className="text-gray-500 text-lg font-medium">No work experience added yet</p>
                <p className="text-gray-400 text-sm mt-2">Click the button below to add your first work experience</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.button
          type="button"
          onClick={handleAddWorkExperience}
          className="w-full bg-gradient-to-r from-[#901b20] to-red-700 hover:from-[#7a1619] hover:to-red-800 text-white font-semibold py-4 px-6 rounded-xl shadow-lg transition-all duration-300 transform flex items-center justify-center"
          whileHover={{ 
            scale: 1.02, 
            boxShadow: "0 8px 20px rgba(144, 27, 32, 0.3)" 
          }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <FaPlus className="mr-3 text-lg" />
          Add New Work Experience
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

export default EducationAndExperienceForm;