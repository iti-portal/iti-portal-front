// src/features/student/components/profile/edit/ProjectsAndPortfolioForm.js

import React, { useState, useEffect } from 'react';
import Modal from '../../../../../components/UI/Modal';
import ProjectSection from './ProjectSection';
import ProjectForm from './ProjectForm';
import { addProject, updateProject, deleteProject } from '../../../../../services/projectsService';
import Alert from '../../../../../components/UI/Alert';

// Main component
function ProjectsAndPortfolioForm({ projects = [], onUpdateProjects }) {
  const [currentProjects, setCurrentProjects] = useState(projects || []);
  const [notification, setNotification] = useState({ show: false, type: 'info', message: '' });
  const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);
  const [confirmModalContent, setConfirmModalContent] = useState({ title: '', message: '', onConfirm: () => {} });
  
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
          setNotification({ show: true, type: 'success', message: 'Project updated successfully!' });
        }
      } else {
        // Add new project
        result = await addProject(formData);
        
        if (result.success) {
          const updatedProjects = [...currentProjects, result.data];
          setCurrentProjects(updatedProjects);
          onUpdateProjects(updatedProjects);
          setNotification({ show: true, type: 'success', message: 'Project added successfully!' });
        }
      }
      
      // Close modal on success
      setShowProjectModal(false);
      setEditingProject(null);
      
    } catch (error) {
      console.error('Error saving project:', error);
      setNotification({ show: true, type: 'error', message: `Error saving project: ${error.message}` });
    }
  };

  const handleProjectDelete = async (idToDelete) => {
    const deleteHandler = async () => {
        try {
          const result = await deleteProject(idToDelete);
          
          if (result.success) {
            const updatedProjects = currentProjects.filter(proj => proj.id !== idToDelete);
            setCurrentProjects(updatedProjects);
            onUpdateProjects(updatedProjects);
            setNotification({ show: true, type: 'success', message: 'Project deleted successfully!' });
          }
        } catch (error) {
          console.error('Error deleting project:', error);
          setNotification({ show: true, type: 'error', message: `Error deleting project: ${error.message}` });
        }
    };

    setConfirmModalContent({
        title: 'Confirm Deletion',
        message: 'Are you sure you want to delete this project?',
        onConfirm: () => {
            deleteHandler();
            setConfirmModalOpen(false);
        }
    });
    setConfirmModalOpen(true);
  };

  const handleCloseProjectModal = () => {
    setShowProjectModal(false);
    setEditingProject(null);
  };

  return (
    <div className="space-y-6">
      <Alert
        show={notification.show}
        type={notification.type}
        message={notification.message}
        onClose={() => setNotification({ ...notification, show: false })}
      />
      <Modal
        isOpen={isConfirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        title={confirmModalContent.title}
      >
        <p>{confirmModalContent.message}</p>
        <div className="flex justify-end space-x-4 mt-4">
          <button
            onClick={() => setConfirmModalOpen(false)}
            className="px-4 py-2 rounded-lg text-gray-600 bg-gray-200 hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={confirmModalContent.onConfirm}
            className="px-4 py-2 rounded-lg text-white bg-red-600 hover:bg-red-700 transition-colors"
          >
            Confirm
          </button>
        </div>
      </Modal>
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
