import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, Plus, Loader2, Edit, Trash2, X, List } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

import 'react-toastify/dist/ReactToastify.css';

import { getMyServices, updateService, deleteService } from '../../services/serviceApi';
import ServiceForm from '../../features/services/components/ServiceForm';
import Navbar from '../../components/Layout/Navbar';
import ConfirmationModal from '../../components/Common/ConfirmationModal';

const MyServicesPage = () => {
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  const fetchServices = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getMyServices();
      setServices(Array.isArray(response.data.services) ? response.data.services : []);
    } catch (error) {
      toast.error(error.message || "Failed to fetch your services.");
      setServices([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const handleEditClick = (service) => {
    setSelectedService(service);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (serviceId) => {
    setServiceToDelete(serviceId);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!serviceToDelete) return;
    setIsDeleting(true);
    try {
      await deleteService(serviceToDelete);
      toast.success("Service deleted successfully!");
      setServices(prev => prev.filter(s => s.id !== serviceToDelete));
      setIsConfirmModalOpen(false);
    } catch (error) {
      toast.error(error.message || "Failed to delete the service.");
    } finally {
      setIsDeleting(false);
      setServiceToDelete(null);
    }
  };
  
  const handleUpdateService = async (formData) => {
    if (!selectedService) return;
    setIsSubmitting(true);
    try {
        const dataToSubmit = { ...formData, id: selectedService.id };
        await updateService(dataToSubmit);
        toast.success("Service updated successfully!");
        closeEditModal();
        fetchServices();
    } catch (error) {
        toast.error(error.message || "Failed to update the service.");
    } finally {
        setIsSubmitting(false);
    }
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedService(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50 to-red-50 relative overflow-hidden">
      <ToastContainer position="bottom-right" theme="colored" />
      <Navbar />
      
      <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-[#901b20]/10 to-[#203947]/10 rounded-full blur-3xl opacity-50 -z-0"></div>
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-gradient-to-tr from-[#203947]/10 to-[#901b20]/10 rounded-full blur-3xl opacity-50 -z-0"></div>

      <main className="pt-24 pb-10 px-4 sm:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full mb-4 border border-white/30 shadow-sm">
              <List className="text-[#901b20] mr-2" size={18} />
              <span className="text-[#901b20] font-semibold text-sm">MY SERVICES</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">Manage Your Services</h1>
            <p className="text-gray-600 text-lg">View, edit, or delete the services you offer.</p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 sm:p-8 border border-white/30"
          >
            <div className="flex justify-end mb-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/create-service')}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#901b20] to-[#203947] text-white font-semibold rounded-full shadow-lg"
              >
                <Plus size={20} />
                <span>Offer New Service</span>
              </motion.button>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin text-[#901b20]" size={48} /></div>
            ) : services.length > 0 ? (
              <div className="space-y-4">
                {services.map(service => (
                  <motion.div
                    key={service.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white/70 p-5 rounded-lg shadow-sm border border-gray-200/80 flex justify-between items-start hover:shadow-md hover:border-gray-300 transition-all"
                  >
                    <div className="flex-grow">
                      <span className="inline-block px-3 py-1 text-xs font-semibold text-[#901b20] bg-red-100 rounded-full mb-3">
                          {service.service_type.replace(/_/g, ' ').toUpperCase()}
                      </span>
                      <h3 className="text-xl font-bold text-gray-800">{service.title}</h3>
                      <p className="text-gray-600 mt-1 pr-4">{service.description || "No description provided."}</p>
                      <p className="text-xs text-gray-400 mt-4">Created: {new Date(service.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center gap-1 flex-shrink-0 ml-2">
                      <motion.button whileHover={{scale: 1.1}} whileTap={{scale: 0.9}} onClick={() => handleEditClick(service)} className="p-2 text-gray-500 hover:text-blue-600 rounded-full hover:bg-gray-100 transition-colors"><Edit size={18} /></motion.button>
                      <motion.button whileHover={{scale: 1.1}} whileTap={{scale: 0.9}} onClick={() => handleDeleteClick(service.id)} className="p-2 text-gray-500 hover:text-red-600 rounded-full hover:bg-gray-100 transition-colors"><Trash2 size={18} /></motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 px-6">
                  <Briefcase size={48} className="mx-auto text-gray-400" />
                  <h3 className="mt-4 text-xl font-semibold text-gray-800">You haven't offered any services yet.</h3>
                  <p className="mt-2 text-gray-500">Click the "Offer New Service" button above to get started.</p>
              </div>
            )}
          </motion.div>
        </motion.div>
      </main>
      
      <AnimatePresence>
        {isEditModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50"
              onClick={closeEditModal}
            >
                <motion.div
                  initial={{ y: -50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -50, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/30 w-full max-w-2xl relative"
                  onClick={(e) => e.stopPropagation()}
                >
                    <motion.button whileHover={{scale: 1.1}} whileTap={{scale: 0.9}} onClick={closeEditModal} className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-800 rounded-full hover:bg-gray-100 transition-colors"><X /></motion.button>
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Service</h2>
                    <ServiceForm 
                      onSubmit={handleUpdateService}
                      isLoading={isSubmitting}
                      initialData={selectedService}
                      submitButtonText="Save Changes"
                    />
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>

      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Service"
        message="Are you sure you want to permanently delete this service? This action cannot be undone."
        confirmText="Yes, Delete"
        isConfirming={isDeleting}
      />
    </div>
  );
};

export default MyServicesPage;