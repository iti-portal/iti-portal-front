// src/features/student/components/profile/edit/ProjectForm.jsx

import React, { useState } from 'react';
import { FaCode, FaUpload, FaTrash } from 'react-icons/fa';

function ProjectForm({ onSubmit, initialData = null }) {
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '';
      return date.toISOString().split('T')[0];
    } catch (error) {
      return '';
    }
  };

  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    technologiesUsed: initialData?.technologiesUsed || initialData?.technologies_used || '',
    description: initialData?.description || '',
    projectUrl: initialData?.projectUrl || initialData?.project_url || '',
    githubUrl: initialData?.githubUrl || initialData?.github_url || '',
    startDate: formatDateForInput(initialData?.startDate || initialData?.start_date),
    endDate: formatDateForInput(initialData?.endDate || initialData?.end_date),
    isFeatured: initialData?.isFeatured || initialData?.is_featured || false,
    images: []
  });

  const [errors, setErrors] = useState({});


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length === 0) return;

    const newImages = [];
    let hasError = false;

    files.forEach((file, index) => {
      
      // Check file size (2MB limit)
      if (file.size > 2 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          images: 'Each image must be less than 2MB'
        }));
        hasError = true;
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({
          ...prev,
          images: 'Only image files are allowed'
        }));
        hasError = true;
        return;
      }

      // Create preview URL
      const preview = URL.createObjectURL(file);
      
      const newImage = {
        file: file,
        altText: `${formData.title || 'Project'} image ${formData.images.length + index + 1}`,
        order: formData.images.length + index + 1,
        preview: preview,
        id: Date.now() + index // Unique ID for React key
      };
      
      newImages.push(newImage);
    });


    if (!hasError) {
      // Add new images to existing ones
      setFormData(prev => {
        const updatedImages = [...prev.images, ...newImages];
        return {
          ...prev,
          images: updatedImages
        };
      });

      // Clear any previous errors
      if (errors.images) {
        setErrors(prev => ({ ...prev, images: '' }));
      }
    }

    // Reset the file input so the same file can be selected again
    e.target.value = '';
  };

  const handleImageAltChange = (imageId, altText) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.map(img => 
        img.id === imageId ? { ...img, altText } : img
      )
    }));
  };

  const handleRemoveImage = (imageId) => {
    setFormData(prev => {
      // Clean up preview URL to prevent memory leaks
      const imageToRemove = prev.images.find(img => img.id === imageId);
      if (imageToRemove && imageToRemove.preview) {
        URL.revokeObjectURL(imageToRemove.preview);
      }
      
      return {
        ...prev,
        images: prev.images.filter(img => img.id !== imageId)
      };
    });
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) newErrors.title = 'Project title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.technologiesUsed.trim()) newErrors.technologiesUsed = 'Technologies are required';
    
    const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
    if (formData.projectUrl && !urlPattern.test(formData.projectUrl)) {
      newErrors.projectUrl = 'Invalid project URL';
    }
    if (formData.githubUrl && !urlPattern.test(formData.githubUrl)) {
      newErrors.githubUrl = 'Invalid GitHub URL';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isEditMode = !!initialData;

  const handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!validate()) return;

    if (isEditMode) {
      // Send plain object for edit (no images)
      const data = {
        title: formData.title,
        technologies_used: formData.technologiesUsed,
        description: formData.description,
        project_url: formData.projectUrl,
        github_url: formData.githubUrl,
        start_date: formData.startDate,
        end_date: !formData.isFeatured && formData.endDate ? formData.endDate : null,
        is_featured: formData.isFeatured ? 1 : 0
      };
      onSubmit(data);
    } else {
      // Add mode: use FormData for file upload
      const data = new FormData();
      data.append('title', formData.title);
      data.append('technologies_used', formData.technologiesUsed);
      data.append('description', formData.description);
      data.append('project_url', formData.projectUrl);
      data.append('github_url', formData.githubUrl);
      data.append('start_date', formData.startDate);
      if (!formData.isFeatured && formData.endDate) {
        data.append('end_date', formData.endDate);
      }
      data.append('is_featured', formData.isFeatured ? 1 : 0);
      formData.images.forEach((img, idx) => {
        if (img.file) {
          data.append(`images[${idx}]`, img.file);
          data.append(`alt_texts[${idx}]`, img.altText || '');
          data.append(`orders[${idx}]`, img.order || idx + 1);
        }
      });
      onSubmit(data);
    }
  };

  // Clean up preview URLs when component unmounts
  React.useEffect(() => {
    return () => {
      formData.images.forEach(image => {
        if (image.preview) {
          URL.revokeObjectURL(image.preview);
        }
      });
    };
  }, [formData.images]);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Project Title *</label>
        <input
          name="title"
          type="text"
          value={formData.title}
          onChange={handleChange}
          required
          className={`w-full px-3 py-2 border rounded-md ${errors.title ? 'border-red-300' : 'border-gray-300'}`}
          placeholder="E-commerce Shopping Platform"
        />
        {errors.title && <p className="text-sm text-red-600 mt-1">{errors.title}</p>}
      </div>

      {/* Technologies */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Technologies Used *</label>
        <input
          name="technologiesUsed"
          type="text"
          value={formData.technologiesUsed}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-md ${errors.technologiesUsed ? 'border-red-300' : 'border-gray-300'}`}
          placeholder="Laravel, Vue.js, MySQL, Stripe API, Redis"
        />
        {errors.technologiesUsed && <p className="text-sm text-red-600 mt-1">{errors.technologiesUsed}</p>}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
        <textarea
          name="description"
          rows="3"
          value={formData.description}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-md ${errors.description ? 'border-red-300' : 'border-gray-300'}`}
          placeholder="Describe your project features and achievements"
        />
        {errors.description && <p className="text-sm text-red-600 mt-1">{errors.description}</p>}
      </div>

      {/* URLs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Project URL</label>
          <input
            name="projectUrl"
            type="url"
            value={formData.projectUrl}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md ${errors.projectUrl ? 'border-red-300' : 'border-gray-300'}`}
            placeholder="https://myproject.com"
          />
          {errors.projectUrl && <p className="text-sm text-red-600 mt-1">{errors.projectUrl}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">GitHub URL</label>
          <input
            name="githubUrl"
            type="url"
            value={formData.githubUrl}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md ${errors.githubUrl ? 'border-red-300' : 'border-gray-300'}`}
            placeholder="https://github.com/username/project"
          />
          {errors.githubUrl && <p className="text-sm text-red-600 mt-1">{errors.githubUrl}</p>}
        </div>
      </div>

      {/* Dates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
          <input
            name="startDate"
            type="date"
            value={formData.startDate}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
          <input
            name="endDate"
            type="date"
            value={formData.endDate}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
      </div>

      {/* Featured */}
      <div className="flex items-center">
        <input
          name="isFeatured"
          type="checkbox"
          checked={formData.isFeatured}
          onChange={handleChange}
          className="h-4 w-4 text-iti-primary border-gray-300 rounded"
        />
        <label className="ml-2 text-sm text-gray-700">Featured Project</label>
      </div>

      {/* Submit */}
      <div className="flex justify-end pt-4">
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 bg-iti-primary text-white rounded-md hover:bg-iti-primary-dark transition-colors"
        >
          <FaCode className="mr-2" />
          {initialData ? 'Update Project' : 'Add Project'}
        </button>
      </div>
    </form>
  );
}

export default ProjectForm;