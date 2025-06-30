// src/features/student/components/profile/edit/ProjectManagement.jsx

import React, { useState, useEffect } from 'react';
import Modal from '../../../../../components/UI/Modal';
import Alert from '../../../../../components/UI/Alert';
import ProjectSection from './ProjectSection.jsx';
import ProjectForm from './ProjectForm.jsx';
import { addProject, updateProject, deleteProject } from '../../../../../services/projectsService';

function ProjectManagement({ projects = [], onUpdateProjects, showNotifications = true }) {
  const [currentProjects, setCurrentProjects] = useState(projects || []);
  
  // Modal state
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  
  // Notification state
  const [notification, setNotification] = useState({ 
    show: false, 
    type: 'info', 
    message: '' 
  });

  // Sync data from props to internal state
  useEffect(() => {
    setCurrentProjects(projects || []);
  }, [projects]);

  // Helper function to show notifications
  const showNotification = (message, type = 'success') => {
    if (showNotifications) {
      setNotification({ show: true, type, message });
    }
  };

  const hideNotification = () => {
    setNotification({ show: false, type: 'info', message: '' });
  };

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
            proj.id === editingProject.id ? result.data : proj
          );
          setCurrentProjects(updatedProjects);
          onUpdateProjects(updatedProjects);
          showNotification('Project updated successfully!', 'success');
        }
      } else {
        // Add new project
        result = await addProject(formData);
        
        if (result.success) {
          const updatedProjects = [result.data, ...currentProjects];
          setCurrentProjects(updatedProjects);
          onUpdateProjects(updatedProjects);
          showNotification('🎉 Project added successfully! Your project has been saved.', 'success');
        }
      }
      
      // Close modal on success
      setShowProjectModal(false);
      setEditingProject(null);
      
    } catch (error) {
      console.error('Error saving project:', error);
      showNotification(`Error saving project: ${error.message}`, 'error');
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
        showNotification('Project deleted successfully!', 'success');
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      showNotification(`Error deleting project: ${error.message}`, 'error');
    }
  };

  const handleCloseProjectModal = () => {
    setShowProjectModal(false);
    setEditingProject(null);
  };

  return (
    <>
      {/* Notification - only show if notifications are enabled */}
      {showNotifications && (
        <Alert
          show={notification.show}
          type={notification.type}
          message={notification.message}
          onClose={hideNotification}
        />
      )}
      
      {/* Project Section */}
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
        className="max-w-3xl"
      >
        <ProjectForm
          onSubmit={handleProjectSubmit}
          initialData={editingProject}
        />
      </Modal>
    </>
  );
}

export default ProjectManagement;
