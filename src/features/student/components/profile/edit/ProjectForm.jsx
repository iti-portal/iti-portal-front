// src/features/student/components/profile/edit/ProjectForm.jsx

import React, { useState } from 'react';
import { FaCode, FaGithub, FaLink, FaUpload } from 'react-icons/fa';

function ProjectForm({ onSubmit, initialData = null }) {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    type: initialData?.type || '',
    description: initialData?.description || '',
    technologiesUsed: initialData?.technologiesUsed || '',
    projectUrl: initialData?.projectUrl || '',
    githubUrl: initialData?.githubUrl || '',
    images: initialData?.images || [],
  });

  const [errors, setErrors] = useState({});
  const [previewImage, setPreviewImage] = useState(
    initialData?.images && initialData.images.length > 0 
      ? initialData.images[0].imagePath 
      : null
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ 
      ...formData, 
      [name]: value 
    });
    
    // Clear error for this field when it's being edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handleTechnologiesChange = (e) => {
    const { value } = e.target;
    setFormData({ 
      ...formData, 
      technologiesUsed: value 
    });
    
    if (errors.technologiesUsed) {
      setErrors({
        ...errors,
        technologiesUsed: ''
      });
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (2MB limit)
      if (file.size > 2 * 1024 * 1024) {
        setErrors({
          ...errors,
          image: 'Image size must be less than 2MB'
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setFormData({
          ...formData,
          images: [{ 
            imagePath: reader.result, 
            altText: formData.title || 'Project Image' 
          }]
        });
        
        // Clear image error
        if (errors.image) {
          setErrors({
            ...errors,
            image: ''
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setPreviewImage(null);
    setFormData({
      ...formData,
      images: []
    });
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Project title is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Project description is required';
    }

    if (!formData.technologiesUsed.trim()) {
      newErrors.technologiesUsed = 'Technologies used is required';
    }    // Validate URLs if provided
    const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
    
    if (formData.projectUrl && formData.projectUrl.trim() && !urlPattern.test(formData.projectUrl.trim())) {
      newErrors.projectUrl = 'Please enter a valid project URL';
    }

    if (formData.githubUrl && formData.githubUrl.trim() && !urlPattern.test(formData.githubUrl.trim())) {
      newErrors.githubUrl = 'Please enter a valid GitHub URL';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Project Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Project Title *
          </label>
          <input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            className={`block w-full px-3 py-2 border ${
              errors.title ? 'border-red-300 bg-red-50' : 'border-gray-300'
            } rounded-md shadow-sm focus:outline-none focus:ring-iti-primary focus:border-iti-primary sm:text-sm`}
            placeholder="e.g., ITI Portal Dashboard"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title}</p>
          )}
        </div>

        {/* Project Type/Category */}
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
            Category <span className="text-sm text-gray-500">(optional)</span>
          </label>
          <input
            id="type"
            name="type"
            type="text"
            value={formData.type}
            onChange={handleChange}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-iti-primary focus:border-iti-primary sm:text-sm"
            placeholder="e.g., Full Stack Web Application"
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Project Description *
        </label>
        <textarea
          id="description"
          name="description"
          rows="4"
          value={formData.description}
          onChange={handleChange}
          className={`block w-full px-3 py-2 border ${
            errors.description ? 'border-red-300 bg-red-50' : 'border-gray-300'
          } rounded-md shadow-sm focus:outline-none focus:ring-iti-primary focus:border-iti-primary sm:text-sm resize-y`}
          placeholder="A brief overview of the project, your role, and key features."
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description}</p>
        )}
      </div>

      {/* Technologies Used */}
      <div>
        <label htmlFor="technologiesUsed" className="block text-sm font-medium text-gray-700 mb-1">
          Technologies Used *
        </label>
        <input
          id="technologiesUsed"
          name="technologiesUsed"
          type="text"
          value={formData.technologiesUsed}
          onChange={handleTechnologiesChange}
          className={`block w-full px-3 py-2 border ${
            errors.technologiesUsed ? 'border-red-300 bg-red-50' : 'border-gray-300'
          } rounded-md shadow-sm focus:outline-none focus:ring-iti-primary focus:border-iti-primary sm:text-sm`}
          placeholder="e.g., React.js, Node.js, Tailwind CSS"
        />
        {errors.technologiesUsed && (
          <p className="mt-1 text-sm text-red-600">{errors.technologiesUsed}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          Separate technologies with commas
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Project URL */}
        <div>
          <label htmlFor="projectUrl" className="block text-sm font-medium text-gray-700 mb-1">
            <FaLink className="inline-block mr-1 text-gray-500" />
            Project URL <span className="text-sm text-gray-500">(Live Demo)</span>
          </label>
          <input
            id="projectUrl"
            name="projectUrl"
            type="url"
            value={formData.projectUrl}
            onChange={handleChange}
            className={`block w-full px-3 py-2 border ${
              errors.projectUrl ? 'border-red-300 bg-red-50' : 'border-gray-300'
            } rounded-md shadow-sm focus:outline-none focus:ring-iti-primary focus:border-iti-primary sm:text-sm`}
            placeholder="https://your-project-demo.com"
          />
          {errors.projectUrl && (
            <p className="mt-1 text-sm text-red-600">{errors.projectUrl}</p>
          )}
        </div>

        {/* GitHub URL */}
        <div>
          <label htmlFor="githubUrl" className="block text-sm font-medium text-gray-700 mb-1">
            <FaGithub className="inline-block mr-1 text-gray-500" />
            GitHub URL <span className="text-sm text-gray-500">(optional)</span>
          </label>
          <input
            id="githubUrl"
            name="githubUrl"
            type="url"
            value={formData.githubUrl}
            onChange={handleChange}
            className={`block w-full px-3 py-2 border ${
              errors.githubUrl ? 'border-red-300 bg-red-50' : 'border-gray-300'
            } rounded-md shadow-sm focus:outline-none focus:ring-iti-primary focus:border-iti-primary sm:text-sm`}
            placeholder="https://github.com/your-username/your-repo"
          />
          {errors.githubUrl && (
            <p className="mt-1 text-sm text-red-600">{errors.githubUrl}</p>
          )}
        </div>
      </div>

      {/* Project Image Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Project Image <span className="text-sm text-gray-500">(optional)</span>
        </label>
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0">
            {previewImage ? (
              <div className="relative">
                <img 
                  src={previewImage} 
                  alt={formData.title || "Project Preview"} 
                  className="h-24 w-24 object-cover rounded-md border border-gray-200" 
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute -top-2 -right-2 bg-iti-primary text-white rounded-full p-1 text-xs hover:bg-iti-primary-dark transition-colors duration-200"
                  title="Remove image"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ) : (
              <div className="h-24 w-24 flex items-center justify-center bg-gray-100 rounded-md border border-gray-300 text-gray-400">
                <FaUpload className="h-8 w-8" />
              </div>
            )}
          </div>
          <div>
            <label 
              htmlFor="projectImage" 
              className="cursor-pointer bg-iti-secondary text-iti-primary py-2 px-3 rounded-md text-sm font-medium hover:bg-gray-100 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus:ring-iti-primary transition-colors duration-200"
            >
              <span>Upload Image</span>
              <input
                id="projectImage"
                name="projectImage"
                type="file"
                className="sr-only"
                accept="image/*"
                onChange={handleImageUpload}
              />
            </label>
            <p className="mt-1 text-xs text-gray-500">
              JPG, PNG, GIF up to 2MB
            </p>
            {errors.image && (
              <p className="mt-1 text-sm text-red-600">{errors.image}</p>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button
          type="button"
          onClick={handleSubmit}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-iti-primary hover:bg-iti-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-iti-primary transition-colors duration-200"
        >
          <FaCode className="mr-2 -ml-1 h-4 w-4" />
          {initialData ? 'Update Project' : 'Add Project'}
        </button>
      </div>
    </div>
  );
}

export default ProjectForm;
