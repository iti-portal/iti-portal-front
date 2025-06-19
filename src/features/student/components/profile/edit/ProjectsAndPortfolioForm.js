// src/features/student/components/profile/edit/ProjectsAndPortfolioForm.js

import React, { useState, useEffect } from 'react';
import Modal from '../../../../../components/UI/Modal';
import ProjectSection from './ProjectSection';
import ProjectForm from './ProjectForm';

// Helper function to generate unique ID
const generateUniqueId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);

// Main component
function ProjectsAndPortfolioForm({ projects, onUpdateProjects }) {
  const [currentProjects, setCurrentProjects] = useState(projects || []);
  
  // Modal state
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  useEffect(() => {
    setCurrentProjects(projects || []);
  }, [projects]);
  // Project Modal Handlers
  const handleAddProject = () => {
    setEditingProject(null);
    setShowProjectModal(true);
  };

  const handleEditProject = (project) => {
    setEditingProject(project);
    setShowProjectModal(true);
  };

  const handleProjectSubmit = (formData) => {
    let updatedProjects;
    
    if (editingProject) {
      // Update existing project
      updatedProjects = currentProjects.map(proj => 
        proj.id === editingProject.id 
          ? { ...proj, ...formData }
          : proj
      );
    } else {
      // Add new project
      const newProject = {
        id: generateUniqueId(),
        ...formData
      };
      updatedProjects = [...currentProjects, newProject];
    }
    
    setCurrentProjects(updatedProjects);
    onUpdateProjects(updatedProjects);
    
    // Close modal
    setShowProjectModal(false);
    setEditingProject(null);
  };

  const handleProjectDelete = (idToDelete) => {
    const updatedProjects = currentProjects.filter(proj => proj.id !== idToDelete);
    setCurrentProjects(updatedProjects);
    onUpdateProjects(updatedProjects);
  };

  const handleCloseProjectModal = () => {
    setShowProjectModal(false);
    setEditingProject(null);
  };
  return (
    <div className="space-y-6">
      {/* Projects Section */}
      <ProjectSection
        projects={currentProjects}
        onAdd={handleAddProject}
        onEdit={handleEditProject}
        onDelete={handleProjectDelete}
      />

      {/* Project Modal */}
      <Modal
        isOpen={showProjectModal}
        onClose={handleCloseProjectModal}
        title={editingProject ? 'Edit Project' : 'Add New Project'}
        className="max-w-4xl"
      >
        <ProjectForm
          onSubmit={handleProjectSubmit}
          initialData={editingProject}
        />
      </Modal>
    </div>
  );
}

export default ProjectsAndPortfolioForm;
