// src/features/student/components/profile/edit/ProjectsAndPortfolioForm.js

import React, { useState, useEffect } from 'react';
import Modal from '../../../../../components/UI/Modal';
import ProjectSection from './ProjectSection';
import ProjectForm from './ProjectForm';
import { addProject, updateProject, deleteProject } from '../../../../../services/projectsService';

// Main component
function ProjectsAndPortfolioForm({ projects = [], onUpdateProjects }) {
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

  const handleProjectSubmit = async (formData) => {
    try {
      let result;
      
      if (editingProject) {
        // Update existing project
        result = await updateProject(editingProject.id, formData);
        
        if (result.success) {
          const updatedProjects = currentProjects.map(proj => 
            proj.id === editingProject.id 
              ? { ...proj, ...result.data }
              : proj
          );
          setCurrentProjects(updatedProjects);
          onUpdateProjects(updatedProjects);
          alert('Project updated successfully!');
        }
      } else {
        // Add new project
        result = await addProject(formData);
        
        if (result.success) {
          const updatedProjects = [...currentProjects, result.data];
          setCurrentProjects(updatedProjects);
          onUpdateProjects(updatedProjects);
          alert('Project added successfully!');
        }
      }
      
      // Close modal on success
      setShowProjectModal(false);
      setEditingProject(null);
      
    } catch (error) {
      console.error('Error saving project:', error);
      alert(`Error saving project: ${error.message}`);
    }
  };

  const handleProjectDelete = async (idToDelete) => {
    // Show confirmation dialog
    const confirmDelete = window.confirm('Are you sure you want to delete this project?');
    
    if (!confirmDelete) {
      return;
    }

    try {
      const result = await deleteProject(idToDelete);
      
      if (result.success) {
        const updatedProjects = currentProjects.filter(proj => proj.id !== idToDelete);
        setCurrentProjects(updatedProjects);
        onUpdateProjects(updatedProjects);
        alert('Project deleted successfully!');
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      alert(`Error deleting project: ${error.message}`);
    }
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
