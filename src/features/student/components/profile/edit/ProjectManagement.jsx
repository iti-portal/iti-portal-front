// src/features/student/components/profile/edit/ProjectManagement.jsx

import React, { useState, useEffect } from 'react';
import Modal from '../../../../../components/UI/Modal';
import Alert from '../../../../../components/UI/Alert';
import ProjectSection from './ProjectSection.jsx';
import ProjectForm from './ProjectForm.jsx';
import { addProject, updateProject, deleteProject, addProjectImage, deleteProjectImage } from '../../../../../services/projectsService';
import { getFeaturedProjects } from '../../../../../services/featuredProjectsService';

function ProjectManagement({ projects = [], onUpdateProjects, showNotifications = true, userId }) {
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

  // Confirmation modal state
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  // Fetch projects with images on component mount or when userId changes
  useEffect(() => {
    const fetchProjectsWithImages = async () => {
      if (userId) {
        try {
          const projectsData = await getFeaturedProjects(userId);
          // The API already returns project_images array, no need to modify
          setCurrentProjects(projectsData);
          onUpdateProjects(projectsData);
        } catch (error) {
          console.error('Error fetching projects with images:', error);
          // Fallback to props if API fails
          setCurrentProjects(projects || []);
        }
      } else {
        // Fallback to props if no userId
        setCurrentProjects(projects || []);
      }
    };

    fetchProjectsWithImages();
    // Note: Removed onUpdateProjects from dependency array to prevent infinite loop
  }, [userId]);

  // Sync data from props to internal state (backup)
  useEffect(() => {
    if (!userId) {
      setCurrentProjects(projects || []);
    }
  }, [projects, userId]);

  // Helper function to refresh projects after operations
  const refreshProjects = async () => {
    if (userId) {
      try {
        const projectsData = await getFeaturedProjects(userId);
        // The API already returns project_images array, no need to modify
        setCurrentProjects(projectsData);
        onUpdateProjects(projectsData);
      } catch (error) {
        console.error('Error refreshing projects:', error);
      }
    }
  };

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
          showNotification('Project updated successfully!', 'success');
          
          // Update local state directly instead of API refresh
          const updatedProjects = currentProjects.map(project => 
            project.id === editingProject.id 
              ? { ...project, ...result.data, project_images: project.project_images || [] }
              : project
          );
          setCurrentProjects(updatedProjects);
          onUpdateProjects(updatedProjects);
        }
      } else {
        // Add new project
        result = await addProject(formData);
        
        if (result.success) {
          showNotification('🎉 Project added successfully! Your project has been saved.', 'success');
          
          // Add new project to local state instead of API refresh
          const newProject = { ...result.data, project_images: [] };
          const updatedProjects = [...currentProjects, newProject];
          setCurrentProjects(updatedProjects);
          onUpdateProjects(updatedProjects);
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

  const handleProjectDelete = (idToDelete) => {
    setConfirmDeleteId(idToDelete);
    setShowConfirmModal(true);
  };

  const confirmDeleteProject = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    try {
      const result = await deleteProject(confirmDeleteId);
      if (result.success) {
        showNotification('Project deleted successfully!', 'success');
        const updatedProjects = currentProjects.filter(project => project.id !== confirmDeleteId);
        setCurrentProjects(updatedProjects);
        onUpdateProjects(updatedProjects);
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      showNotification(`Error deleting project: ${error.message}`, 'error');
    } finally {
      setShowConfirmModal(false);
      setConfirmDeleteId(null);
    }
  };

  const cancelDeleteProject = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setShowConfirmModal(false);
    setConfirmDeleteId(null);
  };

  const handleCloseProjectModal = () => {
    setShowProjectModal(false);
    setEditingProject(null);
  };

  const handleImageAdd = async (projectId, imageFile) => {
    try {
      const result = await addProjectImage(projectId, imageFile);
      
      if (result.success) {
        // Update local state directly instead of API refresh
        const updatedProjects = currentProjects.map(project => {
          if (project.id === projectId) {
            const updatedImages = [...(project.project_images || []), result.data];
            return { ...project, project_images: updatedImages };
          }
          return project;
        });
        setCurrentProjects(updatedProjects);
        onUpdateProjects(updatedProjects);
        showNotification('Project image added successfully!', 'success');
      }
    } catch (error) {
      console.error('Error adding project image:', error);
      showNotification(`Error adding project image: ${error.message}`, 'error');
    }
  };

  const handleImageDelete = async (imageId) => {
    try {
      const result = await deleteProjectImage(imageId);
      
      if (result && result.success) {
        // Update local state directly instead of API refresh
        const updatedProjects = currentProjects.map(project => ({
          ...project,
          project_images: (project.project_images || []).filter(img => img.id !== imageId)
        }));
        setCurrentProjects(updatedProjects);
        onUpdateProjects(updatedProjects);
        showNotification('Project image deleted successfully!', 'success');
      } else {
        showNotification('Failed to delete project image', 'error');
      }
    } catch (error) {
      console.error('Error deleting project image:', error);
      
      // Even if API call fails, remove from UI if image already deleted
      if (error.message && error.message.includes('not found')) {
        const updatedProjects = currentProjects.map(project => ({
          ...project,
          project_images: (project.project_images || []).filter(img => img.id !== imageId)
        }));
        setCurrentProjects(updatedProjects);
        onUpdateProjects(updatedProjects);
        showNotification('Image removed from list (already deleted)', 'info');
      } else {
        showNotification(`Error deleting project image: ${error.message || 'Unknown error'}`, 'error');
      }
    }
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
        onImageAdd={handleImageAdd}
        onImageDelete={handleImageDelete}
      />

      {/* Project Modal */}
      <Modal
        isOpen={showProjectModal}
        onClose={handleCloseProjectModal}
        title={editingProject ? 'Edit Project' : 'Add New Project'}
        className="w-full max-w-3xl"
      >
        <ProjectForm
          onSubmit={handleProjectSubmit}
          initialData={editingProject}
        />
      </Modal>

      {/* Custom Confirmation Modal for Project Delete */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6 border-b">
              <h3 className="text-lg font-bold text-gray-900">Delete Project</h3>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-600">Are you sure you want to delete this project? This action cannot be undone.</p>
            </div>
            <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3">
              <button type="button" onClick={cancelDeleteProject} className="px-4 py-2 text-sm font-medium bg-white border rounded-md hover:bg-gray-100">Cancel</button>
              <button type="button" onClick={confirmDeleteProject} className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md">Confirm</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ProjectManagement;
