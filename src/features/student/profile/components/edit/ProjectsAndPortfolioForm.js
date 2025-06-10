// src/features/Student/Profile/components/edit/ProjectsAndPortfolioForm.js

import React, { useState, useEffect } from 'react';
import { FaGithub, FaLink, FaUpload } from 'react-icons/fa'; // تأكدي من تثبيت react-icons إذا لم يكن كذلك (npm install react-icons)

// دالة لإنشاء ID فريد مؤقت
const generateUniqueId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);

// ***************************************************************
// ProjectFormItem Component - تم تضمينه مباشرة هنا
// ***************************************************************
function ProjectFormItem({ project, onUpdate, onDelete }) {
  const [currentProject, setCurrentProject] = useState(project);
  const [previewImage, setPreviewImage] = useState(project.images && project.images.length > 0 ? project.images[0].imagePath : null);

  useEffect(() => {
    setCurrentProject(project);
    setPreviewImage(project.images && project.images.length > 0 ? project.images[0].imagePath : null);
  }, [project]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...currentProject, [name]: value };
    setCurrentProject(updated);
    onUpdate(currentProject.id, updated);
  };

  const handleTechnologiesChange = (e) => {
    const { value } = e.target;
    const techsArray = value.split(',').map(tech => tech.trim()).filter(tech => tech);
    const updated = { ...currentProject, technologiesUsed: techsArray.join(', ') };
    setCurrentProject(updated);
    onUpdate(currentProject.id, updated);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        const updatedImages = [{ imagePath: reader.result, altText: currentProject.title || 'Project Image' }];
        const updated = { ...currentProject, images: updatedImages };
        setCurrentProject(updated);
        onUpdate(currentProject.id, updated);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setPreviewImage(null);
    const updated = { ...currentProject, images: [] };
    setCurrentProject(updated);
    onUpdate(currentProject.id, updated);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Project Title */}
        <div>
          <label htmlFor={`project-title-${project.id}`} className="block text-sm font-medium text-gray-700">Project Title</label>
          <input
            type="text"
            name="title" // <-- تم تغيير الاسم
            id={`project-title-${project.id}`}
            value={currentProject.title || ''}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
            placeholder="e.g., ITI Portal Dashboard"
          />
        </div>

        {/* Project Category/Type (Optional) */}
        <div>
          <label htmlFor={`project-type-${project.id}`} className="block text-sm font-medium text-gray-700">Category (Optional)</label>
          <input
            type="text"
            name="type"
            id={`project-type-${project.id}`}
            value={currentProject.type || ''}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
            placeholder="e.g., Full Stack Web Application"
          />
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <label htmlFor={`project-description-${project.id}`} className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            id={`project-description-${project.id}`}
            rows="4"
            value={currentProject.description || ''}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm resize-y"
            placeholder="A brief overview of the project, your role, and key features."
          ></textarea>
        </div>

        {/* Technologies Used */}
        <div className="md:col-span-2">
          <label htmlFor={`project-tech-used-${project.id}`} className="block text-sm font-medium text-gray-700">Technologies Used</label>
          <input
            type="text"
            name="technologiesUsed" // <-- تم تغيير الاسم
            id={`project-tech-used-${project.id}`}
            value={currentProject.technologiesUsed || ''}
            onChange={handleTechnologiesChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
            placeholder="e.g., React.js, Node.js, Tailwind CSS"
          />
          <p className="mt-1 text-sm text-gray-500">Separate technologies with commas.</p>
        </div>

        {/* Project URL */}
        <div>
          <label htmlFor={`project-url-${project.id}`} className="block text-sm font-medium text-gray-700">
            <FaLink className="inline-block mr-1 text-gray-500" /> Project URL (Live Demo)
          </label>
          <input
            type="url"
            name="projectUrl" // <-- تم تغيير الاسم
            id={`project-url-${project.id}`}
            value={currentProject.projectUrl || ''}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
            placeholder="https://your-project-demo.com"
          />
        </div>

        {/* GitHub URL */}
        <div>
          <label htmlFor={`github-url-${project.id}`} className="block text-sm font-medium text-gray-700">
            <FaGithub className="inline-block mr-1 text-gray-500" /> GitHub URL
          </label>
          <input
            type="url"
            name="githubUrl" // <-- اسم جديد
            id={`github-url-${project.id}`}
            value={currentProject.githubUrl || ''}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
            placeholder="https://github.com/your-username/your-repo"
          />
        </div>

        {/* Project Image Upload */}
        <div className="md:col-span-2">
          <label htmlFor={`project-image-${project.id}`} className="block text-sm font-medium text-gray-700 mb-2">Project Image</label>
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              {previewImage ? (
                <div className="relative">
                  <img src={previewImage} alt={currentProject.title || "Project Preview"} className="h-24 w-24 object-cover rounded-md border border-gray-200" />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 text-xs hover:bg-red-600"
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
              <label htmlFor={`project-image-${project.id}`} className="cursor-pointer bg-red-100 text-red-700 py-2 px-3 rounded-md text-sm font-medium hover:bg-red-200 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus:ring-red-500">
                <span>Upload Image</span>
                <input
                  id={`project-image-${project.id}`}
                  name="projectImage"
                  type="file"
                  className="sr-only"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </label>
              <p className="mt-1 text-xs text-gray-500">JPG, PNG, GIF up to 2MB. (Will be saved as URL)</p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-end mt-6">
        <button
          type="button"
          onClick={() => onDelete(project.id)}
          className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Delete Project
        </button>
      </div>
    </div>
  );
}

// ***************************************************************
// ProjectsAndPortfolioForm Component - main component
// ***************************************************************
function ProjectsAndPortfolioForm({ projects, onUpdateProjects }) {
  const [currentProjects, setCurrentProjects] = useState(projects || []);

  useEffect(() => {
    setCurrentProjects(projects || []);
  }, [projects]);

  const handleProjectUpdate = (id, updatedProj) => {
    const updatedProjects = currentProjects.map(proj => (proj.id === id ? updatedProj : proj));
    setCurrentProjects(updatedProjects);
    onUpdateProjects(updatedProjects);
  };

  const handleAddProject = () => {
    // تحديد هيكل المشروع الجديد بما يتوافق تمامًا مع ProjectCard.js
    const newProject = {
      id: generateUniqueId(),
      title: '',             // يتوافق مع data.title في ProjectCard
      description: '',
      technologiesUsed: '',  // يتوافق مع data.technologiesUsed في ProjectCard (سيكون string هنا)
      projectUrl: '',        // يتوافق مع data.projectUrl في ProjectCard
      githubUrl: '',         // يتوافق مع data.githubUrl في ProjectCard
      images: [],            // يتوافق مع data.images في ProjectCard
      type: '',              // حقل اختياري (Category)
    };
    const updatedProjects = [...currentProjects, newProject];
    setCurrentProjects(updatedProjects);
    onUpdateProjects(updatedProjects);
  };

  const handleProjectDelete = (idToDelete) => {
    const updatedProjects = currentProjects.filter(proj => proj.id !== idToDelete);
    setCurrentProjects(updatedProjects);
    onUpdateProjects(updatedProjects);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Projects & Portfolio</h2>
        <p className="text-gray-600 text-sm mb-4">Showcase your best work. Each project will be displayed with its details and links on your public profile.</p>

        {currentProjects.length > 0 ? (
          <div className="space-y-6"> {/* إضافة مسافة بين بطاقات المشاريع */}
            {currentProjects.map(project => (
              <ProjectFormItem // هنا نستدعي ProjectFormItem المضمنة
                key={project.id}
                project={project}
                onUpdate={handleProjectUpdate}
                onDelete={handleProjectDelete}
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">No projects added yet. Click "Add New Project" to get started!</p>
        )}

        <button
          type="button"
          onClick={handleAddProject}
          className="mt-6 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Add New Project
        </button>
      </div>
    </div>
  );
}

export default ProjectsAndPortfolioForm;